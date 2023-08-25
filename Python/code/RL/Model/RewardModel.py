from rl import util
import numpy as np

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