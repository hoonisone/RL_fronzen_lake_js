import numpy as np

class ActionTauTable:
    """
        state, action 쌍에 대한 tau값 관리
    """
    def __init__(self, states, actions):
        self.value_table = np.zeros((len(states), len(actions)), dtype=int)

    def update(self, state, action):
        # 전체 경우의 수에 값을 1씩 더하고 인자로 받은 케이스는 0으로 초기화
        self.value_table = self.value_table+1
        self.value_table[state, action] = 0

    def get_taus_for_state(self, state):
        """
            state에 대한 액션 별 tau 값 반환
        """
        return self.value_table[state]