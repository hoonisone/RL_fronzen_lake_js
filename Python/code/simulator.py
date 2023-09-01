class Simulator:
    def __init__(self, env, agent):
        self.env = env
        self.agent = agent
        self.verbose = False
        self.episode_num = 0
        self.step_num = 0

    def one_step(self, verbose=False):
            self.step_num += 1

            if self.agent.finished:
                self.agent.start(self.env.get_start_state())
        

            reward, state, done = self.env.step(self.agent.past_state, self.agent.past_action)

            result = {'state': int(self.agent.past_state),
                      'action': int(self.agent.past_state),
                      'reward': int(reward),
                      'next_state': int(state),
                      'done': done,
                      }        
                
            self.agent.step(reward, state, done)
            
            if verbose == True or (verbose == None and self.verbose):
                print(f"Step: {self.step_num}, State: {state}, Reward: {reward}, Done: {done}")
            return result

    def n_step(self, n, verbose = None):
            return [self.one_step(verbose) for i in range(n)]

    def one_episode(self, episode_verbose=None, step_verbose=None):
        self.episode_num += 1
        if episode_verbose == True or (episode_verbose == None and self.verbose):
            print("Episode: ", self.episode_num)
        
        results = []
        while True:
            result = self.one_step(verbose=step_verbose)
            results.append(results)
            if result["done"] == True:
                return results
            
    def n_episode(self, n, episode_verbose=None, step_verbose=None):
        return [self.one_episode(episode_verbose, step_verbose) for i in range(n)]
    

    # def repeat_test(self, test_num, change_period, verbose=False):
    #     return [self.one_test(change_period, verbose=verbose) for i in tqdm.tqdm(range(test_num))]
    
    # def test(self, verbose=False):
    #     return self.repeat_test(10, 30, verbose=verbose)
            
    def test_with_changing_map(self, episode_per_map, verbose = False):
        self.env.start_map()
        test_result = []
        for i in range(self.env.map_num*episode_per_map):

            result = self.one_episode(verbose=verbose)
            test_result.append(result)

            if i % episode_per_map == (episode_per_map-1):
                self.env.next_map()
        return test_result

