# from .FronzenLake import *
from abc import *

class Env(metaclass=ABCMeta):
    def __init__(self, states, actions):
        self.states = states
        self.actions = actions

    @abstractmethod
    def get_reward(self, state, action):
        pass

    @abstractmethod
    def get_next_state(self, state, action):
        pass

    @abstractmethod
    def is_goal(self, state):
        pass

    def step(self, state, action):
        reward = self.get_reward(state, action)
        next_state = self.get_next_state(state, action)
        
        return (reward, next_state, self.is_goal(next_state))
    
    def get_start_state(self):
        pass