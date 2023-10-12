import random
import numpy as np

from rl import util
from enum import IntEnum

class PolicyMode(IntEnum):
    RANDOM = 0
    GREEDY = 1
    EPSILON_GREEDY = 2

class Policy():
    # q_value를 이용한 action 선택 기능을 담당하는 객체
    # epsilon, kappa 값을 관리한다.

    # mode는 액션을 선택하는 방식을 나타내며 IntEnum으로 표현됨
    # Policy 객체에 mode를 업데이트 하면 그게 맞는 action_choose함수를 장착함
    def __init__(self, config):
        self.epsilon = config.epsilon
        self.kappa = config.kappa
        self.mode = config.mode # PolicyMode

    def choose_action(self, actions, q_values, tau):
        action_values = Policy.recalculate_value(q_values, tau, self.kappa)
        if self.mode == PolicyMode.RANDOM:
            return Policy.random_choose(actions)
        elif self.mode == PolicyMode.GREEDY:
            return Policy.greedy_choose(actions, action_values)
        elif self.mode == PolicyMode.EPSILON_GREEDY:
            return Policy.epsilon_greedy_choose(actions, action_values, self.epsilon)
        
        raise Exception(f"Mode({self.mode})에 맞는 행동 선택 함수가 없음")
    
    @staticmethod
    def get_config_format():
        return { "epsilon":0.1, "kappa":0.001, "mode":PolicyMode.Random }
    
    @staticmethod
    def random_choose(actions):
        return random.choice(actions)

    @staticmethod
    def greedy_choose(actions, values):
        max_idx = np.flatnonzero(values == values.max())[0]
        return actions[max_idx]

    @staticmethod
    def epsilon_greedy_choose(actions, values, epsilon):
        if random.random() < epsilon:
            return Policy.random_choose(actions)
        else:
            return Policy.greedy_choose(actions, values)

    @staticmethod
    def recalculate_value(q_values, tau, kappa):
        return q_values+(tau** 0.5)*kappa

class EnvChangeRatioChecker:
    """
    * 전체 업데이트 횟수 중 변경 사항의 비중을 체크
    """
    def __init__(self, max_buffer_size=1000):
        self.buffer = []
        self.count = 0
        self.max_buffer_size = max_buffer_size

    def update(self, changed):
        self.count += 1 if changed else 0
        self.buffer.append(changed)

        if len(self.buffer) > self.max_buffer_size:
            self.count -= 1 if self.buffer.pop(0) else 0

    def get_ratio(self):
        return self.count / len(self.buffer)


class PolicyParameterManager:
    def __init__(self, config):
        self.min_epsilon = config.min_epsilon
        self.max_epsilon = config.max_epsilon
        self._epsilon = config.initial_epsilon

        self.max_kappa = config.min_epsilon
        self.min_kappa = config.max_epsilon
        self._kappa = config.initial_kappa

        self.env_change_checker = EnvChangeRatioChecker(100)

    def update(self, env_changed):
        self.env_change_checker.update(env_changed)
        env_change_ratio = self.env_change_checker.get_ratio()
        self._epsilon = max(env_change_ratio ** 0.5 * self.max_epsilon, self.min_epsilon)
        self._kappa = max(env_change_ratio * self.max_kappa, self.min_kappa)

    @property
    def epsilon(self):
        return self._epsilon

    @epsilon.setter
    def epsilon(self, value):
        if not self.use_auto_epsilon:
            self._epsilon = value

    @property
    def kappa(self):
        return self._kappa

    @kappa.setter
    def kappa(self, value):
        if not self.use_auto_kappa:
            self._kappa = value

class DanamicParameterPolicy(Policy):
    # epsilon과 kappa를 상황에 따라 조절하는 Policy
    def __init__(self, config):
        super().__init__(config)
        self.use_auto_epsilon = config.use_auto_epsilon
        self.use_auto_kappa = config.use_auto_kappa
        self.parameter_manager = PolicyParameterManager(config.policy_parameter_manager)

    def update_parameter(self, env_changed):
        # PolicyParameterManager 객체를 이용하여 
        self.parameter_manager.update(env_changed)
        if self.use_auto_epsilon:
            self.epsilon = self.parameter_manager.epsilon
        if self.use_auto_kappa:
            self.kappa = self.parameter_manager.kappa

if __name__ == "__mane__":    
    p = Policy(epsilon=0.05, kappa=0.000, use_auto_epsilon=False, use_auto_kappa=False)
    p.choose_action([1, 2, 3], np.array([1, 2, 3]), np.array([3, 4, 5]))
