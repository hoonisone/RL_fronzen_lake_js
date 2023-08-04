def create_object_tensor(shape, creator):
    length = shape[0]
    if len(shape) == 1:
        return [creator() for i in range(length)]
    else:
        shape = shape[1:]
        return [create_object_tensor(shape, creator) for i in range(length)]
    
tensor = create_object_tensor([1, 2, 3], lambda : 1)
assert (tensor == [[[1, 1, 1], [1, 1, 1]]])

import numpy as np
def near(arr1, arr2, thresh):
    arr1 = np.array(arr1)
    arr2 = np.array(arr2)
    return np.all(np.abs(arr1 - arr2) < thresh)

import heapq

class Heap:
    def __init__(self):
        self.heap = []

    def push(self, newValue):
        heapq.heappush(self.heap, newValue)

    def pop(self):
        return heapq.heappop(self.heap)

    def is_empty(self):
        return len(self.heap) == 0

    def clear(self):
        self.heap = []

# h = Heap()
# h.push('1')
# h.pop()

import json
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)
        
class JsonHeap:
    def __init__(self):
        self.heap = Heap()

    def push(self, newValue):
        self.heap.push(json.dumps(newValue, ensure_ascii=False, indent="\t", cls=NpEncoder))
                
    def pop(self):
        return json.loads(self.heap.pop())

    def is_empty(self):
        return len(self.heap) == 0

    def clear(self):
        self.heap = []
# jh = JsonHeap()
# jh.push([1])
# jh.pop()