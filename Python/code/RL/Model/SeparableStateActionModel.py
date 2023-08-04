import random
import  json
from RL import Model

from RL import util


class SeperableStateActionModel:
    
    def __init__(self, state_num, action_num, recent_buffer_size=10, old_buffer_size=10):
        creator = lambda : Model.SeparableRewardStateModel(recent_buffer_size=recent_buffer_size, old_buffer_size=old_buffer_size)
        self.table = util.create_object_tensor([state_num, action_num], creator)
        self.recent_visit = Model.SampleModel(100000)
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
        
    def get_all_samples(self, _type=None, state=None, action=None, reward=None, next_state=None, finished=None):
        if all([_type==None, state==None, action==None, reward==None, next_state!=None, finished==None]):
            return []
        arr = []
        if next_state in self.state_to_pre_state_action:             # 수정 위치
            for x in self.state_to_pre_state_action[next_state]:
                _state, _action = json.loads(x)
                _type, _state, _action, _reward, _next_state, _finished = self.get_sample(
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