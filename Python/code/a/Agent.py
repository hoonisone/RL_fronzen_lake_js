import import_ipynb
import random
import Policy
import Model
import util
import numpy as np
import json
import Env

class Agent:
    def __init__(self, states, actions):
        # reward
        self.default_reward = -0.03
        self.curiosity_reward = 0.001
        self.repeat_penalty = -0.01

        # basic element
        self.states = states
        self.actions = actions
        self.state_num = len(states)
        self.action_num = len(actions)

        self.past_state = None
        self.past_action = None

        self.finished = True

        # Policy
        self.policy = Policy.Policy(0.05, 0.0001)

        min_step_size = 0.05
        recent_buffer_size = 10
        old_buffer_size = 30


        self.value = Model.StateActionValue(state_num=self.state_num, action_num=self.action_num, min_step_size=min_step_size)
        self.recent_value = Model.StateActionValue(state_num=self.state_num, action_num=self.action_num, min_step_size=min_step_size)
        self.old_value = Model.StateActionValue(state_num=self.state_num, action_num=self.action_num, min_step_size=min_step_size)

        self.model = Model.SeperableStateActionModel(state_num=self.state_num, action_num=self.action_num, recent_buffer_size=recent_buffer_size, old_buffer_size=old_buffer_size)

        self.tau_value_table = Model.ActionTauTable(states, actions)

#         self.after_action_value_update_callback = Callback_2()  # state, action

#         self.after_step_callback = Callback_0()
#         self.goal_callback = Callback_0()
#         self.hall_callback = Callback_0()
#         self.first_state = Callback_1()
#         self.first_state_action = Callback_2()
        self.total_step = 0
        self.latest_step = 0
        self.total_episode = 0

        self.use_forget = False
        self.planning_num = 100
        self.heap = util.JsonHeap()
        self.gamma = 0.95

        self.planning_value_threshold = 0.1
        self.forget_history = []

    def set_epsilon(self, value):
        self.policy.epsilon = value

    def get_epsilon(self):
        return self.policy.epsilon

    def set_kappa(self, value):
        self.policy.kappa = value

    def get_kappa(self):
        return self.policy.kappa

    def set_step_size(self, value):
        self.action_state_value_manager.step_size = value

    def get_step_size(self):
        return self.action_state_value_manager.step_size

    def get_state_e_value(self, state):
        return self.action_state_value_manager.getStateValue(state)

    def reset_all(self):
        self.reset_all_value()
        self.reset_all_model()

    def reset_all_value(self):
        self.action_state_value_manager.reset_all_value()

    def reset_all_model(self):
        self.action_state_value_manager.reset_all_model()

    def set_group(self, group):
        self.group = group

    def start(self, state):
        self.finished = False
        self.total_episode += 1
        self.latest_step = 0
        self.past_state = state
        self.past_action = self.choose_action(state)
        return self.past_action

    def check_recent_old_difference(self, state, action):
        if self.is_distribution_comparable(state, action):
            recent_mean = self.recent_value.get_value(state, action)
            recent_variance = self.recent_value.get_variance(state, action)
            old_mean = self.old_value.get_value(state, action)
            old_variance = self.old_value.get_variance(state, action)

            recent_z = abs(recent_mean - old_mean) / (old_variance ** 0.5)
            old_z = abs(old_mean - recent_mean) / (recent_variance ** 0.5)

            return min(recent_z, old_z)
        return 0

    def bootstrap_value(self, reward, next_state, finished):
        next_return = 0 if finished else max(self.get_action_values_for_state(next_state))
        cur_return = reward + self.gamma * next_return
        return cur_return

    def pq_planning(self):
        visited = set()
        while not self.heap.is_empty():
            state, action = json.loads(self.heap.pop())
            type_, state, action, reward, next_state, finished = self.model.get_sample(None, state, action, None, None, None)
            if type_ is None:
                continue

            visited.add(f"{state},{action}")

            value = self.bootstrap_value(reward, next_state, finished)
            self.value.update(state, action, value)
#             self.after_action_value_update_callback.invoke(state, action)

            next_state = state
            samples = self.model.get_all_samples(None, None, None, None, next_state, None)

            for type_, state, action, reward, next_state, finished in samples:
                if f"{state},{action}" in visited:
                    continue
                value = self.bootstrap_value(reward, next_state, finished)
                p = abs(value - self.value.get_value(state, action))
                if self.planning_value_threshold <= p:
                    self.heap.push([state, action])
    def planning(self):
        for _ in range(self.planning_num):
            
            type_, state, action, reward, next_state, finished = self.model.get_sample(None, None, None, None, None, None)

            if type_ is None:
                continue

            value = self.bootstrap_value(reward, next_state, finished)
            self.value.update(state, action, value)
            if type_ == "recent":
                self.recent_value.update(state, action, value)
            elif type_ == "old":
                self.old_value.update(state, action, value)

#             self.after_action_value_update_callback.invoke(state, action)

    def _step(self, state, action, reward, next_state, finished):
        value = self.bootstrap_value(reward, next_state, finished)
       
        
        p = value - self.value.get_value(state, action)
        if self.planning_value_threshold < p:
            self.heap.push([state, action])
        
        self.value.update(state, action, value)
#         self.after_action_value_update_callback.invoke(state, action)
        self.recent_value.update(state, action, value)
        self.model.update(state, action, reward, next_state, finished)
        
        recent_old_difference = self.check_recent_old_difference(state, action)
        
        if self.use_forget:
            self.forget_model(state, action, next_state, recent_old_difference)

        env_changed = 1 < recent_old_difference
        

    
        self.policy.update_parameter(env_changed)

        

        self.planning()

    def step(self, reward, state, finished):
        reward += self.default_reward
        
        self._step(self.past_state, self.past_action, reward, state, finished)
        
        self.past_state = state
        self.past_action = self.choose_action(self.past_state)

        # update tau
        self.tau_value_table.update(self.past_state, self.past_action)

        self.total_step += 1
        self.latest_step += 1

        self.finished = finished
        return self.past_action

    def choose_action(self, state):
        q_values = self.get_action_values_for_state(state)
        tau = self.get_tau_values_for_state(state)

        return self.policy.choose_action(self.actions, q_values, tau)

    def get_action_values_for_state(self, state):
        return np.array([self.value.get_value(state, action) for action in self.actions])
    
    def get_tau_values_for_state(self, state):
        return self.tau_value_table.value_table[state]

    def get_state_value(self, state):
        q_values = self.get_action_values_for_state(state)
        return max(q_values)

    def get_state_value_map(self):
        value_map = []
        for state in self.agent.states:
            value_map.append(self.get_state_value(state))
        return value_map

    def is_distribution_comparable(self, state, action):
        return (self.recent_value.get_size(state, action) > 10) and (self.old_value.get_size(state, action) > 10)

    def forget_model(self, state, action, next_state, model_difference):
        if model_difference > 2.3:
            self.model.forget_by_state_action(state, action, 1)
            # self.model.forget_by_state(next_state, 1)
            print("forget")
        elif model_difference > 1.5:
            self.model.forget_by_state_action(state, action, 1)
            # self.model.forget_by_state(next_state, 0.5)
            print("forget 0.2")
            self.forget_history.append([self.total_episode, self.total_step, state])


