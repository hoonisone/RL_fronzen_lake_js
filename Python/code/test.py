import Demo
import multiprocessing
from multiprocessing import Process 
import json

def f(id, return_dict):
    demo = Demo.Demo(use_forget = False)
    result = demo.one_test(change_period=30)
    return_dict[id] = result

if __name__ == '__main__':
    # 프로세스의 결과물을 저장하기 위한 공용 저장소
    manager = multiprocessing.Manager()
    return_dict = manager.dict()


    p_list = []
    for id in range(10):
        p = Process(target=f, args=(0, return_dict))
        p_list.append(p)


    for p in p_list:    
        p.start()
    
    for p in p_list:
        p.join()
    
    print(return_dict)
    result = json.dumps(dict(return_dict))

    with open("./../data/result.txt", "w") as f:
        f.write(result)



