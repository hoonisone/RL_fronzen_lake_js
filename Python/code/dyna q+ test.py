# sys.path.append({경로})

from rl.env.grid import ChangingGridEnv
from rl.agent import ProposedAgent
from simulator import Simulator
import json
from pathlib import Path

# map = Env.Grid.GridMapLoader().load_map("Dyna Q Test")
# env = Env.Grid.GridEnv(map)

args_no_planning = {
    "planning_num":0,
    "save_path":Path("./result/planning(0).json")
}

args_planning_10 = {
    "planning_num":10,
    "save_path":Path("./result/planning(10).json")
}

args_planning_20 = {
    "planning_num":20,
    "save_path":Path("./result/planning(20).json")
}

def test(args):
    env = ChangingGridEnv(map_name = "Dyna Q Test")
    agent = ProposedAgent(env.states, env.actions)
    agent.planning_num = args["planning_num"]

    sim = Simulator(env, agent)

    sim.env.start_map()
    test_result = []
    episode_num_before_change = 3000
    episode_num_after_change = 3000
    results = sim.n_step(episode_num_before_change, verbose = True)
    sim.env.next_map()
    results += sim.n_step(episode_num_after_change, verbose = True)

    with open(args["save_path"], "w") as f:
        f.write(json.dumps(results))

test(no_planning_args)
test(planning_args)