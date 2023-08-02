import import_ipynb
import ipynb
import Demo
from multiprocessing import Process 

def f():
    demo = Demo.Demo(use_forget = False)
    result = demo.one_test()
    return result

if __name__ == '__main__':
    p0 = Process(target=f)
    a = p0.start()
    # p0.join()
    print(a)


