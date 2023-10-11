from rl.env.grid import ChangingGridEnv
from rl.agent import ProposedAgent
import simulator

import json
from multi import *
from omegaconf import OmegaConf
from confspace import *

def test(args):
    map_name = args["map_name"]
    use_forget = args["use_forget"]
    forget_metric = args["forget_metric"]
    env = ChangingGridEnv(map_name)
    agent = ProposedAgent(env.states, env.actions)
    agent.use_forget = use_forget
    agent.forget_metric = forget_metric
    demo = simulator.Changing_Map_Simulator(env, agent)
    return demo.run(args)

def test_and_save(args):
    multi_num = args["multi_num"]
    save_path = args["save_path"]

    result = do_multi_processing(test, args, multi_num)
    with open(save_path, "w") as f:

        f.write(json.dumps(result))

conf = {
    "changing_steps":[5, 10],
    "step_num":30,
    "step_verbose":False,
    "episode_verbose":False,
    "multi_num":1,
    "save_path":"./../data/result2/test_result_10x10_forget.txt"
}
serach_space = {
    "map_name":["5x5", "10x10"],
    "use_forget":[True, False],
    "forget_metric":[(1.5, 0.2), (1.5, 0.1)],
}




if __name__ == '__main__':
    config_space = ConfigSpace(conf, serach_space)
    for config in config_space:
        print(config)
    # for threshold in np.arange(1, 2.300001, 0.1):
    #     for ratio in np.arange(0.1, 1.00001, 0.1):
    #         threshold = np.round(threshold, 2)
    #         ratio = np.round(ratio, 2)

    #         print(threshold, ratio)
    #         forget_tunning["forget_metric"] = [[threshold, ratio]]
    #         forget_tunning["save_path"] = f"./../data/tuning/5x5_({threshold}, {ratio}).txt"
    #         test_and_save(forget_tunning)

    # test_and_save(conf)
    # test_and_save(test_5x5_no_forget)
    # test_and_save(test_10x10_forget)
    # test_and_save(test_10x10_no_forget)




