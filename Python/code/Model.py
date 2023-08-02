import import_ipynb
from util import *
import math
import random
import numpy as np

class ActionTauTable:
    """
        state, action 쌍에 대한 tau값 관리
    """
    def __init__(self, states, actions):
        self.value_table = np.zeros((len(states), len(actions)), dtype=int)

    def update(self, state, action):
        # 전체 경우의 수에 값을 1씩 더하고 인자로 받은 케이스는 0으로 초기화
        self.value_table = self.value_table+1
        self.value_table[state, action] = 0

    def get_taus_for_state(self, state):
        return self.value_table[state]

def print_dict(keys, values):
    max_len = max([len(str(key)) for key in keys])
    infor = [f"%-{max_len}s: %s" % (str(key), str(value)) for (key, value) in zip(keys, values)]
    return "\n".join(infor)
    
class GaussianDistributionModel:
    MIN_STD = 0.0000001
    
    
    def __init__(self, mean=0, variance=1, min_step_size = 0.05):
        self.mean = mean
        self.variance = variance
        self.min_step_size = min_step_size
        self.size = 0

    def update(self, sample):
        self.size += 1
        step_size = self.step_size()
        self.variance += step_size*((sample-self.mean)**2 - self.variance)
        self.mean += step_size*(sample-self.mean)

    def forget(self, ratio):
        self.size = math.floor(self.size*(1-ratio))
    
    def step_size(self):
        if(self.size == 0):
            return 1
        return max(1/self.size, self.min_step_size)
    
    def get_infor(self):
        keys = ["Mean", "Variance", "Size", "Step_size", "Min_step_size"]
        values = [self.mean, self.variance, self.size, self.step_size(), self.min_step_size]
        return print_dict(keys, values)
                
model = GaussianDistributionModel()

model.update(1)
assert(model.mean == 1)
assert(model.variance == 1)

model.update(3)
assert(model.mean == 2)
assert(model.variance == 2.5)

model.update(5)
assert(model.mean == 3)
assert near(4.666666666666666, model.variance, 1e-5)

model.update(3)

assert(model.mean == 3)
assert near(3.5, model.variance, 1e-5)

model.update(1)
assert(model.mean == 2.6)
assert near(3.6, model.variance, 1e-5)


class RewardModel:
    def __init__(self):
        self.rewards= []
        self.sum = 0
    
    def add(self, reward):
        self.rewards.insert(0, reward)
        self.sum += reward

    def pop(self):
        reward = self.rewards.pop()
        self.sum -= reward
        return reward
    
    @property
    def mean(self):
        return self.sum/len(self.rewards)
    
model = RewardModel()

model.add(2)
assert (model.mean == 2)

model.add(4)
assert (model.mean == 3)

model.add(6)
assert (model.mean == 4)

model.pop()
assert (model.mean == 5)

model.pop()
assert (model.mean == 6)

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
        for i in range(forget_num): 
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

class SampleModel:
    def __init__(self, buffer_size):
        self.buffer = []
        self.buffer_size = buffer_size

    def update(self, sample):
        self.buffer.insert(0, sample)
        if(self.buffer_size < len(self.buffer)):
            self.buffer.pop()
            
    def get_sample(self):
        if len(self.buffer) == 0:
            return None
        
        return self.buffer[np.random.choice(range(len(self.buffer)))]
    

    def forget(self):
        self.buffer = []
        
        
model = SampleModel(3)
model.update(1)

assert (model.get_sample() == 1)
model.update(2)
model.update(3)
model.update(4)

assert(1 not in [model.get_sample() for i in range(100)])

class SeperableStateActionModel:
    
    def __init__(self, state_num, action_num, recent_buffer_size=10, old_buffer_size=10):
        creator = lambda : SeparableRewardStateModel(recent_buffer_size=recent_buffer_size, old_buffer_size=old_buffer_size)
        self.table = create_object_tensor([state_num, action_num], creator)
        self.recent_visit = SampleModel(100000)
        self.state_to_pre_state_action = {}
        
    def update(self, state, action, reward, next_state, finished):
        self.recent_visit.update([state, action])

        self.table[state][action].update(reward, next_state, finished)

        if next_state not in self.state_to_pre_state_action:
            self.state_to_pre_state_action[next_state] = set()
        
        self.state_to_pre_state_action[next_state].add(str([state, action]))
    
    def get_sample(self, type = None, state=None, action=None, reward=None, next_state=None, finished=None):
        
        if all([type==None, state==None, action==None, reward==None, next_state==None, finished==None]):
            
            sample = self.recent_visit.get_sample()
            if sample == None:
                return [None, None, None, None, None, None]
            state, action = sample            
            
            return self.get_sample(None, state, action, None, None, None)
        
        elif all ([type==None, state!=None, action!=None, reward==None, next_state==None, finished==None]):

            type, reward, next_state, finished = self.table[state][action].get_sample(None, None, None, None)
            
            if type == None:
                return [None, None, None, None, None, None]
            
            return [type, state, action, reward, next_state, finished]
        elif all ([type==None, state!=None, action!=None, reward==None, next_state!=None, finished==None]):
            type, reward, next_state, finished = self.table[state][action].get_sample(None, None, next_state, None)
            return [type, state, action, reward, next_state, finished]
        
        
        raise Exception("정의되지 않은 케이스");
        
    def get_all_samples(_type=None, state=None, action=None, reward=None, next_state=None, finished=None):
        if all([_type==None, state==None, action==None, reward==None, next_state!=None, finished==None]):
            return []
        arr = []
        if next_state in state_to_pre_state_action:
            for x in state_to_pre_state_action[next_state]:
                _state, _action = json.loads(x)
                _type, _state, _action, _reward, _next_state, _finished = get_sample(
                    None, _state, _action, None, next_state, None
                )
                if _type is None:
                    continue
                arr.append([_type, _state, _action, _reward, _next_state, _finished])

        return arr

    def forget_visit_list_by_state_action(self, state, action):
        new_list = []
        for visit in self.recent_visit:
            if visit[0] == state and visit[1] == action:
                continue
            new_list.insert(0, visit)

        self.recent_visit.forget()
        
        for visit in new_list:
            self.recent_visit.update(visit)
        
    def forget_by_state_action(self, state, action, forget_ratio):
        self.table[state][action].forget_old_samples(forget_ratio)
    
    def forget_pre_state_action_by_state(self, state, action, forget_ratio):
        next_states = self.table[state][action].get_all_next_states()
        for next_state in next_states:
            if random.random() < forget_ratio:
                pre_state_action_str = json.dumps([state, action])
                if next_state in self.state_to_pre_state_action:
                    self.state_to_pre_state_action[next_state].discard(pre_state_action_str)

model = SeperableStateActionModel(3, 3)

# model.update(1, 2, 0, 1, False)
model.get_sample(None, None, None, None, None, None)

class StateActionValue():
    def __init__(self, state_num, action_num, mean=0, variance=1, min_step_size=0.05):
        creator = lambda: GaussianDistributionModel(mean=mean, variance=variance, min_step_size=min_step_size)
        self.table = create_object_tensor([state_num, action_num], creator)
        
        
    def update(self, state, action, value):
        self.table[state][action].update(value)

    def get_value(self, state, action):
        return self.table[state][action].mean
    
    def get_variance(self, state, action):
        return self.table[state][action].variance
    

    def get_size(self, state, action):
        return self.table[state][action].size
    
    
StateActionValue(1, 1)