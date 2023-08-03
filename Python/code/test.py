import Demo

import json
import Env
import Agent
from multi import *


def test(args):
    map_name = args["map_name"]
    use_forget = args["use_forget"]
    episode_per_map = args["episode_per_map"]
    verbose = args["verbose"]

    env = Env.ChangingFrozenLake(map_name)
    agent = Agent.Agent(env.get_states(), env.get_actions())
    agent.use_forget = use_forget
    demo = Demo.Demo(env, agent)
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
    "save_path":"./../data/test_result_5x5_forget.txt"
}

test_10x10_no_forget = {
    "map_name":"10x10",
    "use_forget":False,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "save_path":"./../data/test_result_5x5_no_forget.txt"
}

test_5x5_forget = {
    "map_name":"5x5",
    "use_forget":True,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "save_path":"./../data/test_result_5x5_forget).txt"
}

test_5x5_no_forget = {
    "map_name":"5x5",
    "use_forget":False,
    "episode_per_map":30,
    "verbose":False,
    "multi_num":10,
    "save_path":"./../data/test_result_5x5_forget).txt"
}
if __name__ == '__main__':
    # test_and_save(forget_test)
    # test_and_save(no_forget_test)
    test_and_save(test_10x10_forget)
    test_and_save(test_10x10_no_forget)

    test_and_save(test_5x5_forget)
    test_and_save(test_5x5_no_forget)