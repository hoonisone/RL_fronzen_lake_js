import sys
from pathlib import Path
print()
print(Path(__file__).parent.parent.absolute()/"rl")
sys.path.append(Path(__file__).parent.parent.absolute()/"rl")
print(sys.path)
# import os
# os.chdir('libs')

from rl.env.grid import ChangingGridEnv
from rl.agent import ProposedAgent
from simulator import Simulator
import json

# map = Env.Grid.GridMapLoader().load_map("Dyna Q Test")
# env = Env.Grid.GridEnv(map)

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


for planning_num in range(0, 101, 10):
    args_no_planning = {
    "planning_num":planning_num,
    "save_path":Path(f"./result/planning/{planning_num}.json")
}