from RL import *


map = Env.Grid.GridMapLoader().load_map("Dyna Q Test")
env = Env.Grid.GridEnv(map)

for i in range(5):
    print(env.step(0, 0))
