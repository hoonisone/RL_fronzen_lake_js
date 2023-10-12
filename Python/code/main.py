import json
import simulator
import multiprocessing

from multi import *
from confspace import *
from pathlib import Path
from omegaconf import OmegaConf
from rl.agent import ProposedAgent, Dyna_Q_Plus
from rl.env.grid import ChangingGridEnv
from rl.policy import *

conf = {
    "changing_steps":[3000],
    "step_num":5000,
    "step_verbose":False,
    "episode_verbose":False,
    "multi_num":1,
    "save_dir":"./../data/result2"
}
serach_space = {
    "map_name":["Dyna Q Test"],
    "use_forget":[False],
    "forget_metric":[(1.5, 0.2), (1.5, 0.1)],
}

def work(args):
    map_name = args["map_name"]
    use_forget = args["use_forget"]
    forget_metric = args["forget_metric"]
    env = ChangingGridEnv(map_name)
    # agent = ProposedAgent(env.states, env.actions)
    agent_config = OmegaConf.create({
        "gamma": 0.95,
        "model_buffer_size":100,
        "policy_config":{"epsilon":0.1, "kappa":0.001, "mode":PolicyMode.RANDOM}})
    agent = Dyna_Q_Plus(env.states, env.actions, agent_config)
    agent.use_forget = use_forget
    agent.forget_metric = forget_metric
    sim = simulator.Changing_Map_Simulator(env, agent)
    result = sim.run(args)
    with open(Path(args.save_dir)/args.conf_space.path, "w") as f:
        f.write(json.dumps(result))
    return result

def name_call_back(i, search_parameter):
    return f"({i})_{'_'.join([str(value) for value in search_parameter.values()])}.txt"
    
if __name__ == "__main__":


    num_processes = 10
    pool = multiprocessing.Pool(processes=num_processes)
    config_space = ConfigSpace(conf, serach_space, name_call_back=name_call_back)

    for config in config_space:
        work(config)

    # results = pool.map(work, config_space)

    # for result in results:
    #     print(result)

    # # 프로세스 풀 종료
    # pool.close()
    # pool.join()