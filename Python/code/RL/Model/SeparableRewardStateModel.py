import random

from . import RewardStateModel

class SeparableRewardStateModel:
    def __init__(self, recent_buffer_size=10, old_buffer_size=100):
        self.recent_sample_model = RewardStateModel(buffer_size=recent_buffer_size)
        self.old_sample_model = RewardStateModel(buffer_size=old_buffer_size)
    
    def update(self, reward, next_state, finished):
        pop_state, pop_action, pop_finished = self.recent_sample_model.update(reward, next_state, finished)
        if pop_state != None:
            self.old_sample_model.update(pop_state, pop_action, pop_finished)
        
    @property
    def recent_size(self):
        return self.recent_sample_model.size
    
    @property
    def old_size(self):
        return self.old_sample_model.size
    @property
    def size(self):
        return self.recent_size + self.old_size
    
    def get_all_next_states(self):
        arr1 = self.recent_sample_model.get_all_next_states()
        arr2 = self.old_sample_model.get_all_next_states()
        return arr1.concat(arr2)
    

    def is_empty(self):
        return self.size == 0

    def get_sample(self, type=None, reward=None, next_state=None, finished=None):
        if(type == None):
            recent_ratio = self.recent_size/self.size
            recent = (random.random() <= recent_ratio)
            type = "recent" if recent else "old"
            return self.get_sample(type, reward, next_state, finished)
        else:
            
            model = self.recent_sample_model if (type == "recent") else self.old_sample_model
            result = model.get_sample(None, None, None)
            reward, next_state, finished = result
            if reward == None:
                return [None, None, None, None]
            return [type, reward, next_state, finished]
        
    def check(self, a1, b1, c1, d1, a2, b2, c2, d2):
        return all([a1 == (a2!=None), 
                    b1 == (b2 != None), 
                    c1 == (c2 != None),
                    d1 == (d2 != None)])
    


    def forget_recent_samples(self, forget_ratio):
        self.recent_sample_model.forget(forget_ratio)
    
    def forget_old_samples(self, forget_ratio):
        self.old_sample_model.forget(forget_ratio)
    

    def is_separable(self):
        return self.recent_sample_model.buffer_size<=self.old_sample_model.size
    
model = SeparableRewardStateModel()
model.update(0, "A", False)

model.forget_recent_samples(1)
model.forget_recent_samples(1)

assert(1)