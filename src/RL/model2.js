class ActionTauTable{
    constructor(states, actions){
        this.value_table = util.ndarray([states.length, actions.length], 0)
    }

    update(state, action){
        var value_table = this.value_table
        for(var i=0 ; i<value_table.length ; i++){
            value_table[i] = util.vAdd(value_table[i], util.ones([value_table[i].length]))
        }
        value_table[state][action] = 0
    }

    get_taus_for_state(state){
        return this.value_table[state]
    }
}

class GaussianDistributionModel{
    static MIN_STD = 0.0000001
    constructor({mean=0, variance=1, min_step_size = 0.05}){
        this.mean = mean
        this.variance = variance
        this.min_step_size = min_step_size
        this.size = 0
    }

    update(sample){
        this.size += 1
        var step_size = Math.max(1/this.size, this.min_step_size)
        // var step_size = this.min_step_size
        this.variance += step_size*((sample-this.mean)**2 - this.variance)
        this.mean += step_size*(sample-this.mean)
    }

    forget(ratio){
        this.size = Math.floor(this.size*(1-ratio))
    }
}
class RewardModel{
    constructor(){
        this.rewards= []
        this.sum = 0
    }
    
    add(reward){
        this.rewards.unshift(reward)
        this.sum += reward
    }

    pop(){
        var reward = this.rewards.pop()
        this.sum -= reward
        return reward
    }

    get mean(){return this.sum/this.rewards.length}

}

class RewardStateModel{
    constructor({buffer_size=10}){
        this.state_to_reward_model = {}
        this.sample_buffer = []
        this.buffer_size = buffer_size
    }

    update(reward, next_state, finished){
        if(!(next_state in this.state_to_reward_model)){
            this.state_to_reward_model[next_state] = new RewardModel()
        }
        this.sample_buffer.unshift([next_state, finished])
        this.state_to_reward_model[next_state].add(reward)
        if(this.buffer_size < this.sample_buffer.length){
            var [return_next_state, return_finished] = this.sample_buffer.pop()
            var return_reward = this.state_to_reward_model[return_next_state].pop()
            return [return_reward, return_next_state, return_finished]
        }
        return [null, null, null]
    }

    get_all_next_states(){
        return Object.keys(this.state_to_reward_model)
    }

    get_next_state_finished_sample(){
        if(this.sample_buffer.length == 0){
            return [null, null]
                        
        }
        return random_util.randomChoice(this.sample_buffer)
    }

    get_reward_next_state_finished_sample(){
        var [next_state, finished] = this.get_next_state_finished_sample()
        if(next_state == null){
            return [null, null, null]
            
        }
        
        var reward = this.get_reward_sample(next_state)
        return [reward, next_state, finished]
    }

    get_reward_sample(next_state){
        if(!(next_state in this.state_to_reward_model)){
            return null
        }
        return this.state_to_reward_model[next_state].mean
    }

    get_reward_finished_sample_with_next_state(next_state){
        if(!(next_state in this.state_to_reward_model)){
            return null
        }
        var f = false
        for(var [ns, _f] of this.sample_buffer){
            if(ns == next_state){
                f = _f
                break
            }
        }
        return [this.state_to_reward_model[next_state].mean, f]
    }

    get size(){return this.sample_buffer.length}

    forget(forget_ratio){
        var forget_num = Math.floor(this.size*forget_ratio)
        for(var i=0 ; i<forget_num ; i++){
            var [forget_next_state, forget_finished] = this.sample_buffer.pop()
            this.state_to_reward_model[forget_next_state].pop()
        }
    }
}

// class SampleModel{
//     constructor({buffer_size = 10}){
//         this.buffer = []
//         this.buffer_size = buffer_size
//     }

//     get size(){return this.buffer.length}

//     update(sample){
//         this.buffer.unshift(sample)
//         return  (this.buffer_size < this.buffer.length) ? this.buffer.pop() : null
//     }

//     get_sample(){
//         return (this.buffer.length == 0) ?  null : random_util.randomChoice(this.buffer)
//     }

//     forget(ratio){
//         var n = Math.floor(this.size*ratio)
//         this.buffer.splice(0, n)
//     }
// }

class SeparableRewardStateModel{
    constructor({recent_buffer_size=10, old_buffer_size=100}){
        this.recent_sample_model = new RewardStateModel({buffer_size:recent_buffer_size})
        this.old_sample_model = new RewardStateModel({buffer_size:old_buffer_size})
    }

    update(reward, next_state, finished){
        var [pop_state, pop_action, pop_finished] = this.recent_sample_model.update(reward, next_state, finished)
        if(pop_state != null){
            this.old_sample_model.update(pop_state, pop_action, pop_finished)
        }
    }

    get recent_size(){return this.recent_sample_model.size}
    get old_size(){return this.old_sample_model.size}
    get size(){
        return this.recent_size + this.old_size
    }
    get_all_next_states(){
        var arr1 = this.recent_sample_model.get_all_next_states()
        var arr2 = this.old_sample_model.get_all_next_states()
        return arr1.concat(arr2)
    }

    is_empty() {return this.size == 0}
    get_reward_next_state_finished_sample(){
        if(this.is_empty()){
             return [null, [null, null, null]]
        }
        var recent_ratio = this.recent_size/this.size
        var recent = (Math.random() <= recent_ratio)
        var type = recent?"recent":"old"
        var [reward, next_state, finished] = (recent? this.recent_sample_model : this.old_sample_model).get_reward_next_state_finished_sample()
        if(reward == null){
            return [null, [null, null, null]]
        }
        return [type, [reward, next_state, finished]]
    }

    get_reward_sample(next_step){
        if(this.is_empty()){
                return [null, null]
        }
        var recent_ratio = this.recent_size/this.size
        var recent = (Math.random() <= recent_ratio)
        var type = recent?"recent":"old"
        var reward = (recent? this.recent_sample_model : this.old_sample_model).get_reward_sample(next_step)
        if(recent == null){
            return [null, null]
        }
        return [type, reward]
    }

    get_reward_finished_sample_with_next_state(next_step){
        if(this.is_empty()){
            return [null, [null, null]]
        }
        var recent_ratio = this.recent_size/this.size
        var recent = (Math.random() <= recent_ratio)
        var type = recent?"recent":"old"
        var [reward, finished] = (recent? this.recent_sample_model : this.old_sample_model).get_reward_finished_sample_with_next_state(next_step)
        if(recent == null){
            return [null, [null, null]]
        }
        return [type, [reward, finished]]
    }

    forget_recent_samples(forget_ratio){
        this.recent_sample_model.forget(forget_ratio)
    }
    forget_old_samples(forget_ratio){
        this.old_sample_model.forget(forget_ratio)
    }

    is_separable(){
        return this.recent_sample_model.buffer_size<=this.old_sample_model.size
    }
}

class ObjectTable{
    constructor({height, width, object_generator}){
        this.table = tensor_util.object_ndarray([height, width], object_generator)
    }
}

class StateActionValue extends ObjectTable{
    constructor({state_num, action_num, mean=0, variance=1, min_step_size=0.05}){
        super({height:state_num, 
               width:action_num, 
               object_generator:() => new GaussianDistributionModel({mean:mean, variance:variance, min_step_size:min_step_size})})
    }

    update(state, action, value){
        this.table[state][action].update(value)
    }

    get_value(state, action){
        return this.table[state][action].mean
    }

    get_size(state, action){
        return this.table[state][action].size
    }
}

class StateActionModel extends ObjectTable{
    constructor({state_num, action_num, recent_buffer_size=10, old_buffer_size=100}){
        super({height:state_num, 
               width:action_num, 
               object_generator:() => new SeparableRewardStateModel({recent_buffer_size:recent_buffer_size, old_buffer_size:old_buffer_size})})
        this.recent_visit = []
        this.state_to_pre_state_action = {}
    }

    update(state, action, reward, next_state, finished){
        this.recent_visit.unshift([state, action])

        this.table[state][action].update(reward, next_state, finished)

        if(!(next_state in this.state_to_pre_state_action)){
            this.state_to_pre_state_action[next_state] = new Set()
        }
        this.state_to_pre_state_action[next_state].add(JSON.stringify([state, action]))
    }

    get_sample(){
        var[state, action] = random_util.randomChoice(this.recent_visit)
        return this.get_sample_with_state_action(state, action)
    }

    get_sample_with_state_action(state, action){
        this.table[state][action].get_reward_next_state_finished_sample()

        var [type, [reward, next_state, finished]] = this.table[state][action].get_reward_next_state_finished_sample()
        if(type == null){
            return [null, [null, null, null, null, null]]
        }
        return [type, [state, action, reward, next_state, finished]]
    }

    get_all_samples_with_next_state(next_state){
        var arr = []
        for(var [state, action] of this.state_to_pre_state_action[next_state]){
            var [type, [reward, finished]] = this.table[state][action].get_reward_finished_sample_with_next_state(next_state)
            if(type == null){
                continue
            }
            arr.push([type, [state, action, reward, next_state, finished]])
        }
        return arr
    }

    
    // forget_visit_list_by_state(state){
    //     var new_list = []
    //     for(var visit of this.recent_visit){
    //         if(visit[0] == state){
    //             continue
    //         }
    //         new_list.unshift()
    //     }
    //     this.recent_visit = new_list
    // }

    forget_visit_list_by_state_action(state, action){
        var new_list = []
        for(var visit of this.recent_visit){
            if(visit[0] == state && visit[1] == action){
                continue
            }
            new_list.unshift()
        }
        this.recent_visit = new_list
    }

    // forget_by_state(state, forget_ratio){
    //     this.forget_visit_list_by_state(state)
    //     for(var model of this.table[state]){
    //         model.forget_old_samples(forget_ratio)
    //     }
    // }

    forget_by_state_action(state, action, forget_ratio){
        // this.forget_visit_list_by_state_action(state, action)
        this.table[state][action].forget_old_samples(forget_ratio) // 다음으로 전이 되는 정보 삭제
        this.forget_pre_state_action_by_state(state, action) // 이전에서 전이되는 정보 삭제
    }

    forget_pre_state_action_by_state(state, action){
        var next_states = this.table[state][action].get_all_next_states()
        for(var next_state of next_states){
            this.state_to_pre_state_action[next_state].delete(JSON.stringify([state, action]))
        }
    }
}

//  
// class ActionStateValueModelTable{
//     constructor(states, actions){        
//         this.state_num = states.length
//         this.action_num = actions.length

//         this.table = this.create_action_state_model_table(this.state_num, this.action_num)

//         this.gamma = 0.99
//         this.planning_num = 1000

//         this.after_action_value_update_callback = new Callback_2()

//         this.heap = new Heap()
//         this.planning_value_threshold = 0.05
//         this.dict = {}

//         this.recent_visit = []
//     }

//     set use_forget(value){
//         for(var state=0 ; state<this.state_num ; state++){
//             for(var action=0 ; action<this.action_num ; action++){
//                 this.table[state][action].use_forget = value
//             }
//         }
//     }

//     create_action_state_model_table(height, width){
//         var table = util.ndarray([height, width], 0)
//         for(var y=0 ; y<height ; y++){
//             for(var x=0 ; x<width ; x++){
//                 table[y][x] = new ActionStateValueModel({recent_buffer_size:3, old_buffer_size:100})
//             }
//         }
//         return table
//     }

//     update_value(s, a, r, ns, f){ // state, action, reward, next state, finished
//         var value = this.bootstrap_value(r, ns, f)
        
//         var p = Math.abs(value- this.table[s][a].value.mean)
//         if(this.planning_value_threshold <p) {
//             this.heap.push([p, s, a])
//         }

//         var env_change = this.table[s][a].update_value(value, "recent")
//         if(env_change){
//             var next_states = this.table[s][a].get_all_next_states()
//             for(var next_state of next_states){
//                 delete this.dict[next_state]
//             }
//         }

//         this.after_action_value_update_callback.invoke(s, a)

//         this.recent_visit.unshift([s, a])
//         if(10000 < this.recent_visit){
//             this.recent_visit.pop()
//         }
//         return env_change
//     }

//     bootstrap_value(r, ns, f){ // reward, next step, finished
//         var next_return = (f == true) ? 0 : Math.max(...this.get_values_for_state(ns))    
//         var cur_return = r + this.gamma*next_return
//         return cur_return
//     }

//     update_model(s, a, r, ns, f){
//         this.table[s][a].update_model(r, ns, f)
//     }

//     update(s, a, r, ns, f){
//         if(!(ns in this.dict)){
//             this.dict[ns] = new Set()
//         }
//         this.dict[ns].add(JSON.stringify([s, a]))
//         var env_change = this.update_value(s, a, r, ns, f)
//         this.update_model(s, a, r, ns, f)

//         return env_change
//     }

//     pq_planning(){
//         var visited = new Set()
//         while(!this.heap.is_empty()){

            
//             var [_, state, action] = this.heap.pop()
//             var [type, [reward, next_state, finished]] = this.table[state][action].get_reward_next_state_finished_sample()
//             if(type == null){
//                 continue
//             }

//             visited.add(`${[state, action]}`)

//             var value = this.bootstrap_value(reward, next_state, finished)
//             this.table[state][action].update_value(value, type)
//             this.after_action_value_update_callback.invoke(state, action)

//             next_state = state
//             if(!(next_state in this.dict))
//                 continue
//             for(var x of this.dict[next_state]){
//                 var [ps, pa] = JSON.parse(x)
//                 if(visited.has(`${[ps, pa]}`)){
//                     continue
//                 }else{
//                 }
//                 var [__, r] = this.table[ps][pa].get_reward_sample(next_state)
//                 if(r == null){
//                     continue
//                 }
//                 value = this.bootstrap_value(r, next_state, finished)
//                 var p = Math.abs(value - this.table[ps][pa].value.mean)
//                 if(this.planning_value_threshold <= p){
//                     this.heap.push([p, ps, pa])
//                 }
//             }
//         }

//     }

//     planning(){
//         this.pq_planning()
//         for(var i=0 ; i<this.planning_num ; i++){
//             var[s, a] = random_util.randomChoice(this.recent_visit)
//             var [type, [reward, next_state, finished]] = this.table[s][a].get_reward_next_state_finished_sample()
//             if(reward == null){
//                 continue
//             }

//             var value = this.bootstrap_value(reward, next_state, finished)
//             this.table[s][a].update_value(value, type)
            
//             this.after_action_value_update_callback.invoke(s, a)
//         }
//     }

//     getValueMap(){
//         let valueMap = []
//         for(var state of this.states){
//             var q_values  = this.get_values_for_state(state)            
//             var max_q_value = Math.max(...q_values)
//             valueMap.push(Math.floor(max_q_value*100)/100)
//         }
//         return valueMap
//     }

//     get_values_for_state(state){
//         var qValues  = []
//         // console.log(state)
//         // console.log(this.table[state])
//         for(var x of this.table[state]){
//             qValues.push(x.value.mean)
//         }
//         return qValues
//     }

// }

// class StateActionModel{
//     constructor(states, actions){        
//         this.state_num = states.length
//         this.action_num = actions.length

//         this.table = this.create_action_state_model_table(this.state_num, this.action_num)

//         this.gamma = 0.99
//         this.planning_num = 1000

//         this.after_action_value_update_callback = new Callback_2()

//         this.heap = new Heap()
//         this.planning_value_threshold = 0.05
//         this.dict = {}

//         this.recent_visit = []
//     }
// }

