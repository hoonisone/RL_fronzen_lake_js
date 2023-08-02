import import_ipynb
import Model
import Env
import Agent
import random
import tqdm
import matplotlib.pyplot as plt
import numpy as np

def get_test_env():
#     return Env.FrozenLake(map_size = 5, frozen_ratio = 0.9, random_next_probability = 0.1)
    return Env.ChangingFrozenLake("5x5")

def get_test_agent(env, use_forget = False):
    agent = Agent.Agent(env.get_states(), env.get_actions())
    agent.use_forget = use_forget
    return agent

class Demo:
    def __init__(self, use_forget):
        self.env = get_test_env()
        self.agent = get_test_agent(self.env, use_forget)
        self.agent.start(0)
        
    def one_step(self):
            if self.agent.finished:
                self.agent.start(0)
            else:
                state, reward, done = self.env.step(self.agent.past_state, self.agent.past_action)
                if done == True:
                    self.agent.step(reward, state, True)
                    return True
                else:
                    self.agent.step(reward, state, False)
                    return False
                
    def one_episode(self):
        while True:
            if self.one_step() == True:
                result = {"step_num":self.agent.latest_step}
                return result

    def one_test(self, change_period):
        self.env.start_map()
        test_result = []
        for c in range(self.env.map_num):
            for i in range(change_period):
                result = self.one_episode()
                test_result.append(result)
            self.env.next_map()
        return test_result
    
    def repeat_test(self, test_num, change_period):
        return [self.one_test(change_period) for i in tqdm.tqdm(range(test_num))]
    
    def test(self):
        return self.repeat_test(10, 30)
            