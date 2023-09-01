from rl.env.grid import ChangingGridEnv
from rl.agent import ProposedAgent
import simulator

import json
from multi import *

def test(args):
    map_name = args["map_name"]
    use_forget = args["use_forget"]
    episode_per_map = args["episode_per_map"]
    verbose = args["verbose"]
    forget_metric = args["forget_metric"]
    env = ChangingGridEnv(map_name)
    agent = ProposedAgent(env.states, env.actions)
    agent.use_forget = use_forget
    agent.forget_metric = forget_metric
    demo = simulator.Demo(env, agent)
    return demo.test_with_changing_map(episode_per_map = episode_per_map, verbose = verbose)

def test_and_save(args):
    multi_num = args["multi_num"]
    save_path = args["save_path"]

    result = do_multi_processing(test, args, multi_num)
    with open(save_path, "w") as f:
        f.write(json.dumps(result))

    

test_10x10_forget = {
    "map_name":"10x10",
    "use_forget":True,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "forget_metric":[[1.5, 0.2]],
    "save_path":"./../data/result2/test_result_10x10_forget.txt"
}

test_10x10_no_forget = {
    "map_name":"10x10",
    "use_forget":False,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "forget_metric":[[1.5, 0.2]],
    "save_path":"./../data/result2/test_result_10x10_no_forget.txt"
}

test_5x5_forget = {
    "map_name":"5x5",
    "use_forget":True,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "forget_metric":[[1.5, 0.2]],
    "save_path":"./../data/result2/test_result_5x5_forget.txt"
}

test_5x5_no_forget = {
    "map_name":"5x5",
    "use_forget":False,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "forget_metric":[[1.5, 0.2]],
    "save_path":"./../data/result2/test_result_5x5_no_forget.txt"
}

forget_tunning = {
    "map_name":"5x5",
    "use_forget":True,
    "episode_per_map":10,
    "verbose":False,
    "multi_num":10,
    "forget_metric":None,
    "save_path":None
}


if __name__ == '__main__':

    # for threshold in np.arange(1, 2.300001, 0.1):
    #     for ratio in np.arange(0.1, 1.00001, 0.1):
    #         threshold = np.round(threshold, 2)
    #         ratio = np.round(ratio, 2)

    #         print(threshold, ratio)
    #         forget_tunning["forget_metric"] = [[threshold, ratio]]
    #         forget_tunning["save_path"] = f"./../data/tuning/5x5_({threshold}, {ratio}).txt"
    #         test_and_save(forget_tunning)

    test_and_save(test_5x5_forget)
    # test_and_save(test_5x5_no_forget)
    # test_and_save(test_10x10_forget)
    # test_and_save(test_10x10_no_forget)




