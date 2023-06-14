class AgentGrupe{
    
    constructor(states, actions){
        this.states = states
        this.actions = actions
        this.agents = []
        this.total_step = 0

        // // policy
        // this.qw = 0
        // this.ew = 1
        // this.tw = 0.000

        // // reward
        // this.default_reward = -0.01
        // this.curiosity_reward = 0.1

        // // q_value
        // this.q_default_value = 0, 
        // this.q_step_size = 0.05, 
        // this.q_gamma = 0.99

        // this.q_model_mean = this.default_reward
        // this.q_model_variance = 0
        // this.q_model_step_size = 0.05

        // // e_value
        // this.e_default_value = 0.1, 
        // this.e_step_size = 0.05,
        // this.e_gamma = 0.9
        
        // this.e_model_mean = 0
        // this.e_model_variance = 0
        // this.e_model_step_size = 0.05


        // this.epsilon = 0.03

        // this.policy = new Policy(this, this.epsilon, this.qw, this.ew, this.tw)

        // this.q_value_table = new StateActionValueModel (states, actions, this.q_default_value, this.q_step_size, this.q_gamma)
        // this.q_value_model = new ActionRewardModel(states, actions, this.q_model_mean, this.q_model_variance, this.Stateq_model_step_size)

        // this.e_value_table = new StateActionValueModel (states, actions, this.e_default_value, this.e_step_size, this.e_gamma)
        // this.e_value_model = new ActionRewardModel(states, actions, this.e_model_mean, this.e_model_variance, this.e_modelState_step_size, false)

        // this.tau_value_table = new ActionTauTable(states, actions)

        // this.memory = new Memory(states, actions)



        this.after_action_value_update_callback = new Callback_2() // state, action
        this.after_step_callback = new Callback_0()
        this.goal_callback = new Callback_0()
        this.hall_callback = new Callback_0()
        this.first_state = new Callback_1()
        this.first_state_action = new Callback_2()
    }

    isValidAgnet(agent){
        return util.listComp(agent.states, this.states) && util.listComp(agent.actions, this.actions) 
    }

    addAgent(agent){
        if(this.isValidAgnet(agent)){
            agent.set_group(this) // 꼼수.. agent랑 동일한 값들을 따로 정의하기 귀찮
            this.agents.push(agent)
            agent.after_step_callback.add(() => this.after_step_callback.invoke())
            agent.goal_callback.add(() => this.goal_callback.invoke())
            agent.hall_callback.add(() => this.hall_callback.invoke())
            agent.first_state_action.add((state, action) => this.first_state_action.invoke(state, action))
            agent.first_state.add((state) => this.first_state.invoke(state))
            agent.after_action_value_update_callback.add((state, action) => this.after_action_value_update_callback.invoke(state, action))
        }else{
            throw "invalid agent!!! check the states and actions"
        }
    }

    getAgent(idx){
        return this.agents[idx]
    }

    get_memory(){
        return this.memory
    }
}

class Agent{
    constructor(states, actions){
        // reward
        this.default_reward = -0.03
        this.curiosity_reward = 0.001
        this.repeat_penalty = -0.01

        // basic element
        this.states = states
        this.actions = actions

        this.past_state = null
        this.past_action = null
        
        this.finished = true

        // Policy
        this.policy = new Policy(0, 0)
        
        // var q_value_manager_args = {
        //     q_value_mean : 0,
        //     q_value_variance : 1,
        //     q_value_step_size : 0.3,

        //     discounting_factor : 0.95,
        //     reward_mean : 0,
        //     reward_variance : 0,
        //     reward_step_size : 0.5,
        //     planning_num : 1000,
        // }
        // this.q_manager = new ValueManager(states, actions, q_value_manager_args)
        this.action_state_value_manager = new ActionStateValueModelTable(states, actions)
        this.action_state_value_manager.after_action_value_update_callback.add((state, action) => this.after_action_value_update_callback.invoke(state, action))

        this.tau_value_table = new ActionTauTable(states, actions)

        this.after_action_value_update_callback = new Callback_2() // state, action

        this.after_step_callback = new Callback_0()
        this.goal_callback = new Callback_0()
        this.hall_callback = new Callback_0()
        this.first_state = new Callback_1()
        this.first_state_action = new Callback_2()
        this.total_step = 0

    }

    set use_forget(value){
        this.action_state_value_manager.use_forget = value
    }
    
    set epsilon(value){
        this.policy.epsilon = value
    }
    get epsilon(){
        return this.policy.epsilon
    }

    set kappa(value){
        this.policy.kappa = value
    }
    get kappa(){
        return this.policy.kappa
    }
    set gamma(value){
        this.action_state_value_manager.gamma = value
    }
    get gamma(){
        return this.action_state_value_manager.gamma
    }
    set step_size(value){
        this.action_state_value_manager.step_size = value
    }
    get step_size(){
        return this.action_state_value_manager.step_size
    }

    get_state_e_value(state){
        return this.action_state_value_manager.getStateValue(state) 
    }

    reset_all(){
        this.reset_all_value()    
        this.reset_all_model()
    }

    reset_all_value(){
        this.action_state_value_manager.reset_all_value()
    }

    reset_all_model(){
        this.action_state_value_manager.reset_all_model()
    }

    set_group(group){
        this.group = group
    }
    
    start(state){
        this.finished = false
        this.past_state = state;        
        this.past_action = this.choose_action(state)
        return this.past_action;
    }

    step(reward, state, finished){
        
        reward += this.default_reward
        var env_changed = this.action_state_value_manager.update(this.past_state, this.past_action, reward, state, finished)
        if(env_changed){
            console.log("env_changed")
        }
        console.log(env_changed)

        if(state == this.past_state){
            if(Math.random() < 0.1){
                env_changed = true
            }

        }
        this.policy.update_parameter(env_changed) 

        this.action_state_value_manager.planning()

        this.past_state = state
        this.past_action = this.choose_action(this.past_state)

        // update tau
        this.tau_value_table.update(this.past_state, this.past_action)

        this.total_step += 1

        this.after_step_callback.invoke()
        
        
        // return action
        this.finished = finished
        return this.past_action
    }

    choose_action(state){
        var qValue = this.get_q_values_for_state(state)
        var tau = this.get_tau_values_for_state(state)
        return this.policy.choose_action(this.actions, qValue, tau)
    }

    get_q_values_for_state(state){
        return this.action_state_value_manager.get_values_for_state(state)
    }
    get_tau_values_for_state(state){
        return this.tau_value_table.value_table[state]
    }

    get_state_value(state){
        var qValues = this.get_q_values_for_state(state)
        return Math.max(...qValues)
    }

    getStateValueMap(){
        let valueMap = []
        for(var i=0 ; i<this.agent.states.length; i++){
            valueMap.push(this.get_state_value(this.agent.states[i]))
        }
        return valueMap
    }
}

