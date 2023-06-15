// class Agent{
//     constructor(states, actions){
//         // reward
//         this.default_reward = -0.03
//         this.curiosity_reward = 0.001
//         this.repeat_penalty = -0.01

//         // basic element
//         this.states = states
//         this.actions = actions
//         this.state_num = states.length
//         this.action_num = actions.length

//         this.past_state = null
//         this.past_action = null
        
//         this.finished = true

//         // Policy
//         this.policy = new Policy(0.05, 0.0001)
        


//         // var mean = 0
//         // var variance = 1
//         var min_step_size = 0.05
//         var recent_buffer_size = 100
//         var old_buffer_size = 0


//         this.value = new StateActionValue({state_num:this.state_num, action_num:this.action_num, min_step_size:min_step_size})
//         this.recent_value = new StateActionValue({state_num:this.state_num, action_num:this.action_num, mean:mean, variance:variance, min_step_size:min_step_size})
//         this.old_value = new StateActionValue({state_num:this.state_num, action_num:this.action_num, mean:mean, variance:variance, min_step_size:min_step_size})
        
//         this.model = new SeperableStateActionModel({state_num:this.state_num, action_num:this.action_num, recent_buffer_size:recent_buffer_size, old_buffer_size:old_buffer_size})

//         this.tau_value_table = new ActionTauTable(states, actions)

//         this.after_action_value_update_callback = new Callback_2() // state, action

//         this.after_step_callback = new Callback_0()
//         this.goal_callback = new Callback_0()
//         this.hall_callback = new Callback_0()
//         this.first_state = new Callback_1()
//         this.first_state_action = new Callback_2()
//         this.total_step = 0


//         this.use_forget = false
//         this.planning_num = 100
//         this.heap = new Heap()
//         this.gamma = 0.95
//     }
    
//     set epsilon(value){
//         this.policy.epsilon = value
//     }
//     get epsilon(){
//         return this.policy.epsilon
//     }

//     set kappa(value){
//         this.policy.kappa = value
//     }
//     get kappa(){
//         return this.policy.kappa
//     }

//     set step_size(value){
//         this.action_state_value_manager.step_size = value
//     }
//     get step_size(){
//         return this.action_state_value_manager.step_size
//     }

//     get_state_e_value(state){
//         return this.action_state_value_manager.getStateValue(state) 
//     }

//     reset_all(){
//         this.reset_all_value()    
//         this.reset_all_model()
//     }

//     reset_all_value(){
//         this.action_state_value_manager.reset_all_value()
//     }

//     reset_all_model(){
//         this.action_state_value_manager.reset_all_model()
//     }

//     set_group(group){
//         this.group = group
//     }
    
//     start(state){
//         this.finished = false
//         this.past_state = state;        
//         this.past_action = this.choose_action(state)
//         return this.past_action;
//     }

//     check_recent_old_difference(state, action){
//         if(this.is_distribution_comparable(state, action)){
//             var recent_mean = this.recent_value.table[state][action].mean
//             var recent_varance = this.recent_value.table[state][action].variance
//             var old_mean = this.old_value.table[state][action].mean
//             var old_variance = this.old_value.table[state][action].variance

//             var recent_z = Math.abs(recent_mean-old_mean)/(old_variance**0.5)
//             var old_z = Math.abs(old_mean-recent_mean)/(recent_varance**0.5)

//             return Math.min(recent_z, old_z)
//         }
//         return 0
//     }

//     bootstrap_value(reward, next_state, finished){ // reward, next step, finished
//         var next_return = (finished) ? 0 : Math.max(...this.get_action_values_for_state(next_state))    
//         var cur_return = reward + this.gamma*next_return
//         return cur_return
//     }



//     pq_planning(){
//         var visited = new Set()
//         while(!this.heap.is_empty()){
//             var [state, action] = this.heap.pop()
//             var [type, [state, action, reward, next_state, finished]] = this.model.get_sample_with_state_action(state, action)
//             if(type == null){
//                 continue
//             }

//             visited.add(`${[state, action]}`)

//             var value = this.bootstrap_value(reward, next_state, finished)
//             this.value.update(state, action, value)
//             this.after_action_value_update_callback.invoke(state, action)


//             var next_state = state
//             var samples = this.model.get_all_samples_with_next_state(next_state)
//             for(var [type, [state, action, reward, next_state, finished]] of samples){
//                 if(visited.has(`${[state, action]}`)){
//                     continue
//                 }else{
//                 }
//                 value = this.bootstrap_value(reward, next_state, finished)
//                 var p = Math.abs(value - this.value.get_value(state, action))
//                 if(this.planning_value_threshold <= p){
//                     this.heap.push([p, ps, pa])
//                 }
//             }
//         }
//     }

//     planning(){
//         this.pq_planning()
//         for(var i=0 ; i<this.planning_num ; i++){
//             var [type, [state, action, reward, next_state, finished]] = this.model.get_sample()
//             if(type == null){
//                 continue
//             }

//             var value = this.bootstrap_value(reward, next_state, finished)
//             this.value.update(state, action, value)
//             if(type == "recent"){   
//                 this.recent_value.update(state, action, value)
//             }else if(type == "old"){
//                 this.old_value.update(state, action, value)
//             }
            
//             this.after_action_value_update_callback.invoke(state, action)
//         }
//     }

//     _step(state, action, reward, next_state, finished){
        
//         var value = this.bootstrap_value(reward, next_state, finished)


//         var p = value - this.value.get_value(state, action)
//         if(this.planning_value_threshold < p) {
//             this.heap.push([state, action])
//         }



//         this.value.update(state, action, value)
//         this.recent_value.update(state, action, value)
//         this.model.update(state, action, reward, next_state, finished)

//         var recent_old_difference = this.check_recent_old_difference(state, action)

//         if(this.use_forget){
//             this.forget_model(state, action, next_state, recent_old_difference)
//         }

//         var env_changeed = 1 < recent_old_difference
//         this.policy.update_parameter(env_changeed)

//         this.planning()
//     }

//     step(reward, state, finished){
        
//         reward += this.default_reward
        
//         this._step(this.past_state, this.past_action, reward, state, finished)

//         this.past_state = state
//         this.past_action = this.choose_action(this.past_state)

//         // update tau
//         this.tau_value_table.update(this.past_state, this.past_action)

//         this.total_step += 1

//         this.after_step_callback.invoke()
        
//         // return action
//         this.finished = finished
//         return this.past_action
//     }

//     choose_action(state){
//         var qValue = this.get_action_values_for_state(state)
//         var tau = this.get_tau_values_for_state(state)
//         return this.policy.choose_action(this.actions, qValue, tau)
//     }

//     get_action_values_for_state(state){
//         var arr = []
//         for(var action of this.actions){
//             arr.push(this.value.get_value(state, action))
//         }
//         return arr
//     }

//     get_tau_values_for_state(state){
//         return this.tau_value_table.value_table[state]
//     }

//     get_state_value(state){
//         var qValues = this.get_action_values_for_state(state)
//         return Math.max(...qValues)
//     }

//     getStateValueMap(){
//         let valueMap = []
//         for(var i=0 ; i<this.agent.states.length; i++){
//             valueMap.push(this.get_state_value(this.agent.states[i]))
//         }
//         return valueMap
//     }
//     is_distribution_comparable(state, action){ // 둘 다 어느정도 사이즈를 갖추었는가?
//         return (this.recent_value.get_size(state, action) > 10) && (this.old_value.get_size(state, action) > 10)
//     }


//     forget_model(state, action, next_state, model_difference){
//         if(2.3 < model_difference){
//             this.model.forget_by_state_action(state, action, 1)
//             // this.model.forget_by_state(next_state, 1)
//             console.log("forget")
//         }else if(1 < model_difference){
//             this.model.forget_by_state_action(state, action, 0.5)
//             // this.model.forget_by_state(next_state, 0.8)
//             console.log("forget")
//         }else if(0.8 < model_difference){
//             this.model.forget_by_state_action(state, action, 0.3)
//             // this.model.forget_by_state(next_state, 0.5)
//             console.log("forget")
//         }
//     }
// }
