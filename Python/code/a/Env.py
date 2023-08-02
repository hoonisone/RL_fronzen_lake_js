import random
from pathlib import Path
import numpy as np
import pandas as pd

class FrozenLake:
    type_to_reward_dict = {"S": 0, "F": 0, "H": 0, "G": 1}
    action_to_direction_dict = {0: [0, -1], 1: [0, 1], 2: [-1, 0], 3: [1, 0]}
    
    def __init__(self, map_size, frozen_ratio = 0.9, random_next_probability = 0.1):
        self.map_size = map_size
        self.frozen_ratio = frozen_ratio
        self.random_next_probability = random_next_probability
        
        self.state_list = np.arange(0, map_size * map_size)
        self.action_list = np.arange(0, 4)
        self.map = FrozenLake.generate_random_map(self.map_size, self.frozen_ratio)
        
    def get_type(self, state:int) -> str:
        """
        * state가 start, hall, frozen 등 어떤 상태인지 반환
        """
        x, y = self.state_to_coordinate(state)
        return self.map[y][x]

    def modify(self, state:int, _type:str)->None:
        """
            맵의 특정 스테이트를 원하는 타입으로 지정
            다만 변경 시 골을 찾을 수 없는 경우 적용 안됌
        """
        if _type not in ["H", "F"]:
            print(f"{_type} is an invalid state type")
            return False
        else:
            x, y = self.state_to_coordinate(state)
            origin_type = self.map[y][x]
            self.map[y][x] = _type

            if FrozenLake.is_valid(self.map):
                return True
            else:
                self.map[y][x] = origin_type
                print(f"Invalid path after applying {_type}")
                return False

    def get_reward_map(self):
        return FrozenLake.map_to_reward_map(self.map)
    


    def get_states(self):
        return self.state_list

    def get_actions(self):
        return self.action_list

    def step(self, state, action):
        if random.random() < self.random_next_probability:
            action = random.choice(self.action_list)

        next_state = self.get_next_state(state, action)
        if self.get_type(next_state) == "H":
            next_state = 0

        reward = self.state_to_reward(next_state)
        finished = self.is_done(next_state)
        return next_state, reward, finished

    def is_done(self, state):
        x, y = self.state_to_coordinate(state)
        return self.map[y][x] == "G"

    def get_next_state(self, state, action):
        move = FrozenLake.action_to_direction_dict[action]
        x, y = self.state_to_coordinate(state)
        next_x, next_y = x + move[0], y + move[1]
        if self.is_out(next_x, next_y):
            return state
        else:
            if self.map[next_y][next_x] == "H":
                return state
            return self.coordinate_to_state(next_x, next_y)

    def is_out(self, x, y):
        """
            좌표가 맵을 벗어났는지 체크
        """
        return not (0 <= x < self.map_size and 0 <= y < self.map_size)

    def state_to_type(self, state):
        x, y = self.state_to_coordinate(state)
        return self.map[y][x]
        
    def state_to_reward(self, state):
        _type = self.state_to_type(state)
        return FrozenLake.type_to_reward(_type)
        
    def new_map(self):
        self.map = FrozenLake.generate_random_map(self.map_size, self.frozen_ratio)
    
    
    def state_to_coordinate(self, state):
        y = state // self.map_size
        x = state % self.map_size
        return x, y

    def coordinate_to_state(self, x, y):
        return self.map_size * y + x
    
    @staticmethod
    def map_to_reward_map(map):
        reward_map = map.copy()
        for y in range(reward_map.shape[0]):
            for x in range(reward_map.shape[1]):
                reward_map[y][x] = FrozenLake.type_to_reward_dict[map[y][x]]
        return reward_map
    
    @staticmethod
    def type_to_reward(_type):
        return FrozenLake.type_to_reward_dict[_type]
        
    @staticmethod
    def generate_random_map(size=10, p=0.8):
        """
        Generates a random valid map (one that has a path from start to goal).

        Args:
            size: size of each side of the grid
            p: probability that a tile is frozen

        Returns:
            A random valid map
        """
        valid = False
        board = []

        while not valid:
            board = [[" "] * size for _ in range(size)]
            for y in range(size):
                for x in range(size):
                    board[y][x] = "F" if (random.random() < p) else "H"
            board[0][0] = "S"
            board[size - 1][size - 1] = "G"
            valid = FrozenLake.is_valid(board)

        return np.array(board)
    
    @staticmethod
    def is_valid(board) -> bool:
        """
            board가 시작 상태에서 목표 상태로 도달 가능한지 체크 
        """
        max_size = len(board)
        frontier = []
        discovered = set()

        frontier.append([0, 0])

        while frontier:
            r, c = frontier.pop()
            pos = f"{r},{c}"
            if pos not in discovered:
                discovered.add(pos)
                directions = [[0, 1], [0, -1], [-1, 0], [1, 0]]
                for x, y in directions:
                    r_new, c_new = r + x, c + y
                    if not (0 <= r_new < max_size and 0 <= c_new < max_size):
                        continue
                    elif board[r_new][c_new] == "G":
                        return True
                    elif board[r_new][c_new] != "H":
                        frontier.append([r_new, c_new])
        return False

env = FrozenLake(map_size = 5, frozen_ratio = 0.1, random_next_probability = 0.1)

data_dir = Path("./../../data")

class ChangingFrozenLake(FrozenLake):
    def __init__(self, map_name):
        super().__init__(5, 1)
        self.map_list = ChangingFrozenLake.load_map(map_name = map_name)
        self.start_map()

    def next_map(self):
        self.map_idx += 1
        if self.map_idx == len(self.map_list):
            return False
        self.map = self.map_list[self.map_idx]
        return True
    
    def start_map(self):
        self.map_idx = 0
        self.map = self.map_list[self.map_idx]
    
    @property
    def map_num(self):
        return len(self.map_list)
    
    @staticmethod
    def load_map(map_name):
        df = pd.read_excel(data_dir/"changing map.xlsx", sheet_name=map_name, header = None)
        df.fillna("F", inplace = True)
        map_size = len(df.loc[0])
        map_num = int(len(df)/map_size)
        map_list = [df.loc[i*map_size:(i+1)*map_size].to_numpy() for i in range(map_num)]
        return map_list
    
    @staticmethod
    def get_all_map_name():
        all_df = pd.read_excel(data_dir/"changing map.xlsx", sheet_name=None)
        return list(all_df.keys())