from RL import Model
from RL import util

class StateActionValue():
    def __init__(self, state_num, action_num, mean=0, variance=1, min_step_size=0.05):
        creator = lambda: Model.GaussianDistributionModel(mean=mean, variance=variance, min_step_size=min_step_size)
        self.table = util.create_object_tensor([state_num, action_num], creator)
        
        
    def update(self, state, action, value):
        self.table[state][action].update(value)

    def get_value(self, state, action):
        return self.table[state][action].mean
    
    def get_variance(self, state, action):
        return self.table[state][action].variance
    

    def get_size(self, state, action):
        return self.table[state][action].size
    
    
StateActionValue(1, 1)