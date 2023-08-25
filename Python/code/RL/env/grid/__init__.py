import random
from pathlib import Path
import numpy as np
import pandas as pd

from enum import Enum
import numpy as np
import os
from rl.env import Env

class StateType(Enum):
    START = "S"
    GOAL = "G"
    Obstacle = "O"
    Empty = ""

class GridEnv(Env):
    action_to_direction_dict = {0: [0, -1], 1: [0, 1], 2: [-1, 0], 3: [1, 0]} # 상, 하, 좌, 우

    def __init__(self, map, reward_function = None, trasition_function = None):
        if GridEnv.check_map_validation(map) == False:
            raise Exception("invalid map")
        
        self.map = map
        
        states = np.arange(0, map.size)
        actions = np.arange(0, 4)

        if reward_function != None:
            self.get_reward = reward_function

        if trasition_function != None:
            self.get_next_state = trasition_function

        super().__init__(states, actions)

    def get_next_state(self, state, action):
        dx, dy = GridEnv.action_to_direction_dict[action]
        x, y = self.state_to_coordinate(state)
        (next_x, next_y) = (x+dx, y+dy)

        if self.is_out(next_x, next_y):
            return state
        else:
            if self.map[next_y][next_x] == StateType.Obstacle:
                return state
            return self.coordinate_to_state(next_x, next_y)

    def get_reward(self, state, action):
        next_state = self.get_next_state(state, action)
        x, y = self.state_to_coordinate(next_state)
        return 1 if self.map[y][x] == StateType.GOAL else 0 # 목적지에 도착하면 1 아니면 0

    def is_out(self, x, y): # 좌표가 맵을 벗어났는지 체크
        return GridEnv.IS_OUT(self.map, x, y)

    def is_goal(self, state):
        (x, y) = self.state_to_coordinate(state)
        return self.map[y][x] == StateType.GOAL

    
    @staticmethod
    def IS_OUT(map, x, y):
        return not (0 <= y < map.shape[0] and 0 <= x < map.shape[1])
    
    def state_to_coordinate(self, state): # 좌표 -> 상태 변환
        y = state // self.height
        x = state % self.height
        return x, y

    def coordinate_to_state(self, x, y): # 상태 -> 좌표 변환
        return GridEnv.COORDINATE_TO_STATE(self.height, x, y)
    
    @staticmethod
    def COORDINATE_TO_STATE(height, x, y):
        return height * y + x
    
    @property
    def height(self):
        return self.map.shape[0]

    @property
    def width(self):
        return self.map.shape[1]
    
    @staticmethod
    def check_map_validation(board) -> bool:
        """
            board가 시작 상태에서 목표 상태로 도달 가능한지 체크  (DFS 탐색)
        """

        if len(board.shape) != 2:
            return False

        height, width = board.shape

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
                    if not (0 <= r_new < height and 0 <= c_new < width):
                        continue
                    elif board[r_new][c_new] == StateType.GOAL:
                        return True
                    elif board[r_new][c_new] != StateType.Obstacle:
                        frontier.append([r_new, c_new])
        return False
    

class RandomGridEnv(GridEnv):
    def __init__(self, size=10, obstacle_ratio=0.1, map_generate_function = None):
        
        # 맵 생성 함수 등록
        if self.map_generate_function != None: 
            self.generate_random_map = map_generate_function

        # 맵 생성
        map = RandomGridEnv.generate_random_map(size=10, obstacle_ratio=0.1)
        
        # 초기화
        super().__init__(map)

    @staticmethod
    def generate_random_map(size=10, obstacle_ratio=0.1):
        """
        Generates a random valid map (one that has a path from start to goal).

        Args:
            size: size of each side of the grid
            p: obstacle ratio 

        Returns:
            A random valid map
        """

        while True: # 유효한 맵을 생성 할 때 까지 랜덤 생성
            board = [[" "] * size for _ in range(size)]
            for y in range(size):
                for x in range(size):
                    board[y][x] = StateType.Obstacle if (random.random() < obstacle_ratio) else StateType.Empty
            board[0][0] = StateType.START
            board[size - 1][size - 1] = StateType.GOAL
            if GridEnv.check_map_validation(board): # 맵 유효성 검사 
                return np.array(board)

class GridMapLoader:
    file_path = Path(__file__).parent/"map"

    @staticmethod
    def load_map(map_name):
        df_map_dict =  pd.read_excel(GridMapLoader.file_path/f"{map_name}.xlsx", sheet_name=None,  header = None)
        df_map_list = df_map_dict.values()

        return np.array([GridMapLoader.preprocess_map(df) for df in df_map_list])
        
    @staticmethod
    def preprocess_map(df):
        df = df.copy()
        df.fillna(StateType.Empty, inplace = True)
        df.replace("S", StateType.START, inplace = True)
        df.replace("G", StateType.GOAL, inplace = True)
        df.replace("O", StateType.Obstacle, inplace = True)
        return df.to_numpy()
    
    def get_all_map_name(self):
        return [name.split(".")[0] for name in os.listdir(GridMapLoader.file_path)]


        # all_df = pd.read_excel(GridMapLoader.file_path, sheet_name=None)
        # return list(all_df.keys())
    
class ChangingGridEnv(GridEnv):
    def __init__(self, map_name = None, map_list = None):
        if map_list is not None:
            self.map_list = map_list
        elif map_name is not None:
            self.map_list = GridMapLoader().load_map(map_name = map_name)
        else:
            raise Exception("")

        super().__init__(self.map_list[0])
        self.map_idx = 0


    @property
    def map_num(self):
        return len(self.map_list)

    def next_map(self):
        self.map_idx += 1
        if self.map_idx == len(self.map_list):
            return False
        new_map = self.map_list[self.map_idx] 
        changed_state_action_pairs = ChangingGridEnv.get_changed_state_action_pair(self.map, new_map)
        self.map = new_map
        return (True, changed_state_action_pairs)
    
    def start_map(self):
        self.map_idx = 0
        self.map = self.map_list[self.map_idx]
    
    @property
    def map_num(self):
        return len(self.map_list)
    
    # @staticmethod
    # def load_map(map_name):
    #     df = pd.read_excel(data_dir/"map.xlsx", sheet_name=map_name, header = None)
    #     df.fillna("F", inplace = True)
    #     map_size = len(df.loc[0])
    #     map_num = int(len(df)/map_size)
    #     map_list = [df.loc[i*map_size:(i+1)*map_size-1].to_numpy() for i in range(map_num)]
    #     return map_list
    
    # @staticmethod
    # def get_all_map_name():
    #     all_df = pd.read_excel(data_dir/"map.xlsx", sheet_name=None)
    #     return list(all_df.keys())
    
    @staticmethod
    def get_changed_state_action_pair(map1, map2):
        '''
            두 맵의 차이를 비교하여 q_value의 transition probability의 변화가 있는 (state, action) 쌍 리스트를 반황
        '''
        cell_list = []
        changed_state_action_pairs = []
        for y in range(map1.shape[0]):
            for x in range(map1.shape[1]):
                if map1[y][x] != map2[y][x]:
                    cell_list.append((x, y))
        for (x, y) in cell_list:
            for action, [dx, dy] in ChangingGridEnv.action_to_direction_dict.items():
                if not GridEnv.IS_OUT(map1, x-dx, y-dy):
                    changed_state_action_pairs.append((ChangingGridEnv.COORDINATE_TO_STATE(map1.shape[0], x-dx, y-dy), action))
        return changed_state_action_pairs





if __name__ == "__main__":
    # map1 = np.array([[1, 2, 3]])
    # map2 = np.array([[1, 2, 4]])
    # print(ChangingFrozenLake.get_changed_state_action_pair(map1, map2))
    
    # print(GridMapLoader.load_map("10x10")[0])
    
    # map_list = GridMapLoader().load_map("6x6")
    a = ChangingGridEnv(map_name = "10x10").next_map()
    print(a)