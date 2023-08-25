import random
import numpy as np

from rl import util

class EnvChangeRatioChecker:
    """
    * 전체 업데이트 횟수 중 변경 사항의 비중을 체크
    """
    def __init__(self, max_buffer_size=1000):
        self.buffer = []
        self.count = 0
        self.max_buffer_size = max_buffer_size

    def update(self, changed):
        self.count += 1 if changed else 0
        self.buffer.append(changed)

        if len(self.buffer) > self.max_buffer_size:
            self.count -= 1 if self.buffer.pop(0) else 0

    def get_ratio(self):
        return self.count / len(self.buffer)


class PolicyParameterManager:
    def __init__(self, initial_epsilon, initial_kappa):
        self.min_epsilon = 0.01
        self.max_epsilon = 0.30
        self._epsilon = initial_epsilon

        self.max_kappa = 0.01
        self.min_kappa = 0.0001
        self._kappa = initial_kappa

        self.env_change_checker = EnvChangeRatioChecker(100)

    def update(self, env_changed):
        self.env_change_checker.update(env_changed)
        env_change_ratio = self.env_change_checker.get_ratio()
        self._epsilon = max(env_change_ratio ** 0.5 * self.max_epsilon, self.min_epsilon)
        self._kappa = max(env_change_ratio * self.max_kappa, self.min_kappa)

    @property
    def epsilon(self):
        return self._epsilon

    @epsilon.setter
    def epsilon(self, value):
        if not self.use_auto_epsilon:
            self._epsilon = value

    @property
    def kappa(self):
        return self._kappa

    @kappa.setter
    def kappa(self, value):
        if not self.use_auto_kappa:
            self._kappa = value


class Policy:
    def __init__(self, epsilon=0.05, kappa=0.000, use_auto_epsilon=False, use_auto_kappa=False):
        self.epsilon = epsilon
        self.kappa = kappa

        self.use_auto_epsilon = use_auto_epsilon
        self.use_auto_kappa = use_auto_kappa
        self.parameter_manager = PolicyParameterManager(epsilon, kappa)

#         self.epsilon_auto_change_callback = Callback_1()
#         self.kappa_auto_change_callback = Callback_1()

    def update_parameter(self, env_changed):
        self.parameter_manager.update(env_changed)
        if self.use_auto_epsilon:
            self.epsilon = self.parameter_manager.epsilon
            self.epsilon_auto_change_callback.invoke(self.epsilon)
        if self.use_auto_kappa:
            self.kappa = self.parameter_manager.kappa
            self.kappa_auto_change_callback.invoke(self.kappa)

    def greedy_choose(self, actions, values):
        max_idx = np.flatnonzero(values == values.max())[0]
        return actions[max_idx]

    def random_choose(self, actions):
        return random.choice(actions)

    def epsilon_greedy_choose(self, actions, values):
        if random.random() < self.epsilon:
            return self.random_choose(actions)
        else:
            return self.greedy_choose(actions, values)

    def recalculate_value(self, q_values, tau):
        return q_values+(tau** 0.5)*self.kappa
        
#         tau_values = [v ** 0.5 for v in tau]
#         tau_values = [v * self.kappa for v in tau_values]
#         return [q + t for q, t in zip(q_values, tau_values)]

    def choose_action(self, actions, q_values, tau):
        action_values = self.recalculate_value(q_values, tau)
        return self.epsilon_greedy_choose(actions, action_values)

class PolicyMode:
    Exploitation = "exploitation"

    
p = Policy(epsilon=0.05, kappa=0.000, use_auto_epsilon=False, use_auto_kappa=False)
p.choose_action([1, 2, 3], np.array([1, 2, 3]), np.array([3, 4, 5]))
