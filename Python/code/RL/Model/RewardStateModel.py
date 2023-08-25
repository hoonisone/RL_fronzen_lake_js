import math
import numpy as np

from . import RewardModel

class RewardStateModel:
    def __init__(self, buffer_size=10):
        self.state_to_reward_model = {}
        self.sample_buffer = []
        self.buffer_size = buffer_size
    

    def update(self, reward, next_state, finished):
        if next_state not in self.state_to_reward_model:
            self.state_to_reward_model[next_state] = RewardModel()
        
        self.sample_buffer.insert(0, [next_state, finished])
        self.state_to_reward_model[next_state].add(reward)
        
        if self.buffer_size < len(self.sample_buffer):
            return_next_state, return_finished = self.sample_buffer.pop()
            return_reward = self.state_to_reward_model[return_next_state].pop()
            return [return_reward, return_next_state, return_finished]
        
        return [None, None, None]
    

    def get_all_next_states(self):
        return list(self.state_to_reward_model.keys())
        

    def get_sample(self, reward, next_state, finished):
        if self.check(False, False, False, reward, next_state, finished):
            if len(self.sample_buffer) == 0:
                return [None, None, None]
            
            [next_state, finished] = self.sample_buffer[np.random.choice(len(self.sample_buffer))]
#             random_util.randomChoiceself.sample_buffer()
            return self.get_sample(None, next_state, finished)
        elif self.check(False, True, True, reward, next_state, finished): # next_state, finished -> reward 만
            if next_state not in self.state_to_reward_model:
                return [None, None, None]
            
            reward = self.state_to_reward_model[next_state].mean
        
        elif self.check(False, True, False, reward, next_state, finished): # next_state, finished -> reward 만
            if next_state not in self.state_to_reward_model:
                return [None, None, None]
            
            finished = False
            for ns, _f in self.sample_buffer:
                if ns == next_state:
                    finished = _f
                    break
                    
            return self.get_sample(None, next_state, finished)

        return [reward, next_state, finished]
    

    def check(self, a1, b1, c1, a2, b2, c2):
        return (a1 == (a2!=None) 
        and b1 == (b2 != None) 
        and c1 == (c2 != None))
    
    @property
    def size(self):
        return len(self.sample_buffer)

    def forget(self, forget_ratio):
        forget_num = math.floor(self.size*forget_ratio)
        for i in range(min(forget_num, self.size)): 
            forget_next_state, forget_finished = self.sample_buffer.pop()
            self.state_to_reward_model[forget_next_state].pop()
            
            
model = RewardStateModel()
model.update(0, "A", False)
model.update(1, "A", False)
model.update(2, "A", False)
model.update(5, "B", True)
model.update(6, "B", True)
model.update(7, "B", True)
(r, ns, f) = model.get_sample(None, "A", False)
assert (r == 1)
assert (ns == "A")
assert (f == False)

(r, ns, f) = model.get_sample(None, "B", None)
assert (r == 6)
assert (ns == "B")
assert (f == True)

assert (model.get_all_next_states() == ["A", "B"])

model.forget(2/3)
assert (model.size == 2)
