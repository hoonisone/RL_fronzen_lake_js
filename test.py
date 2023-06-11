import gym
from gym.envs.registration import register
import readchar

#MACROS
LEFT = 0
DOWN = 1
RIGHT = 2
UP = 3

# Key mapping
arrow_keys = {
    'w' : UP,
    's' : DOWN,
    'd' : RIGHT,
    'a' : LEFT
}

# Register FrozenLake with is_slippery False
register(
    id='FrozenLake-v3',
    entry_point="gym.envs.toy_text:FrozenLakeEnv",
    kwargs={'map_name':'4x4','is_slippery':False}
)
 
env = gym.make("FrozenLake-v3")
env.reset()
env.render() 
 
while True:
    # Choose an action from keyboard
    key = readchar.readkey()  
 
    if key not in arrow_keys.keys():
        print("Game aborted!")
        break
 
    action = arrow_keys[key]
    print(arrow_keys[key])
    state, reward, done, info = env.step(action)
    env.render() # Show the board after action
    print("State:", state, "Action", action, "Reward:", reward, "Info:", info)
 
    if done: 
        print("Finished with reward", reward)
        break