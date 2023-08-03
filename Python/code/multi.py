import multiprocessing
from multiprocessing import Process 

def do_work(id, return_dict, work, args):
    return_dict[id] = work(args)

def do_multi_processing(work, args, multi_num):
    manager = multiprocessing.Manager()
    return_dict = manager.dict()

    p_list = []
    for id in range(multi_num):
        p = Process(target=do_work, args=(id, return_dict, work, args))
        p_list.append(p)

    for p in p_list:    
        p.start()
    
    for p in p_list:
        p.join()

    return_dict = dict(return_dict)

    return_list = [return_dict[i] for i in range(len(return_dict))]
    return return_list