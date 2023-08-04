
import numpy as np

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