
import math
from rl import util

def print_dict(keys, values):
    max_len = max([len(str(key)) for key in keys])
    infor = [f"%-{max_len}s: %s" % (str(key), str(value)) for (key, value) in zip(keys, values)]
    return "\n".join(infor)

class GaussianDistributionModel:
    """
        숫자 값을 넘겨주면 가우시안 분포로 추정해준다.
        최근 값에 더 가중치를 둔다.
    """
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
        """
            업데이트 가중치(step_size)반환
            1/샘플 개수의 1로 계산하돼 최소 min_step_size를 유지한다.
        """
        if(self.size == 0): # 처음에는 1
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
assert util.near(4.666666666666666, model.variance, 1e-5)

model.update(3)

assert(model.mean == 3)
assert util.near(3.5, model.variance, 1e-5)

model.update(1)
assert(model.mean == 2.6)
assert util.near(3.6, model.variance, 1e-5)