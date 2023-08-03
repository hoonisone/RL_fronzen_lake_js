import import_ipynb
import Model
import Env
import Agent
import random
import tqdm
import matplotlib.pyplot as plt
import numpy as np

class Demo:
    def __init__(self, env, agent):
        self.env = env
        self.agent = agent
        self.agent.start(0)
        
    def one_step(self, verbose=False):
            if self.agent.finished:
                self.agent.start(0)
            else:
                state, reward, done = self.env.step(self.agent.past_state, self.agent.past_action)
                if verbose:
                    print(state, reward, done)
                    
                if done == True:
                    self.agent.step(reward, state, True)
                    return True
                else:
                    self.agent.step(reward, state, False)
                    return False
                
    def one_episode(self, verbose=False):
        while True:
            if self.one_step(verbose=verbose) == True:
                result = {"step_num":self.agent.latest_step}
                return result
    

    # def repeat_test(self, test_num, change_period, verbose=False):
    #     return [self.one_test(change_period, verbose=verbose) for i in tqdm.tqdm(range(test_num))]
    
    # def test(self, verbose=False):
    #     return self.repeat_test(10, 30, verbose=verbose)
            
    def test_with_changing_map(self, episode_per_map, verbose = False):
        self.env.start_map()
        test_result = []
        for i in range(self.env.map_num*episode_per_map):

            result = self.one_episode(verbose=verbose)
            test_result.append(result)

            if i % episode_per_map == (episode_per_map-1):
                self.env.next_map()
        return test_result

