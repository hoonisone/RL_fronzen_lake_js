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

    get_sample(reward, next_state, finished){
        if(this.check(false, false, false, reward, next_state, finished)){
            if(this.sample_buffer.length == 0){
                return [null, null, null]
            }
            [next_state, finished] = random_util.randomChoice(this.sample_buffer)
            return this.get_sample(null, next_state, finished)
        }
        else if(this.check(false, true, true, reward, next_state, finished)){ // next_state, finished -> reward 만
            if(!(next_state in this.state_to_reward_model)){
                return [null, null, null]
            }
            reward = this.state_to_reward_model[next_state].mean
        }
        else if(this.check(false, true, false, reward, next_state, finished)){ // next_state, finished -> reward 만
            if(!(next_state in this.state_to_reward_model)){
                return [null, null, null]
            }
            finished = false
            for(var [ns, _f] of this.sample_buffer){
                if(ns == next_state){
                    finished = _f
                    break
                }
            }
            return this.get_sample(null, next_state, finished)
        }
        return [reward, next_state, finished]
    }

    check(a1, b1, c1, a2, b2, c2){
        return (a1 == (a2!=null) 
        && b1 == (b2 != null) 
        && c1 == (c2 != null))
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

    get_sample(type=null, reward=null, next_state=null, finished=null){
        if(type == null){
            var recent_ratio = this.recent_size/this.size
            var recent = (Math.random() <= recent_ratio)
            type = recent?"recent":"old"
            return this.get_sample(type, reward, next_state, finished)
        }else{
            
            var model = (type == "recent") ? this.recent_sample_model : this.old_sample_model
            var result = model.get_sample(null, null, null)
            var [reward, next_state, finished] = result
            if(reward == null)
                return [null, null, null, null]
            return [type, reward, next_state, finished]
        }
    }
    check(a1, b1, c1, d1, a2, b2, c2, d2){
        return (a1 == (a2!=null) 
        && b1 == (b2 != null) 
        && c1 == (c2 != null)
        && d1 == (d2 != null))
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

class SeperableStateActionModel extends ObjectTable{
    constructor({state_num, action_num, recent_buffer_size=10, old_buffer_size=100}){
        super({height:state_num, 
               width:action_num, 
               object_generator:() => new SeparableRewardStateModel({recent_buffer_size:recent_buffer_size, old_buffer_size:old_buffer_size})})
        this.recent_visit = new SampleModel(100000)
        this.state_to_pre_state_action = {}
    }

    update(state, action, reward, next_state, finished){
        this.recent_visit.update([state, action])

        this.table[state][action].update(reward, next_state, finished)

        if(!(next_state in this.state_to_pre_state_action)){
            this.state_to_pre_state_action[next_state] = new Set()
        }
        this.state_to_pre_state_action[next_state].add(JSON.stringify([state, action]))
    }

    get_sample(type = null, state=null, action=null, reward=null, next_state=null, finished=null){
        if(this.check([false, false, false, false, false, false], [type, state, action, reward, next_state, finished])){
            [state, action] = this.recent_visit.get_sample()
            if(state == null){
                return [null, null, null, null, null, null]
            }
            
            return this.get_sample(null, state, action, null, null, null)
        }
        else if(this.check([false, true, true, false, false, false], [type, state, action, reward, next_state, finished])){
            var [type, reward, next_state, finished] = this.table[state][action].get_sample(null, null, null, null)
            
            if(type == null){
                return [null, null, null, null, null, null]
            }
            return [type, state, action, reward, next_state, finished]
        }else if(this.check([false, true, true, false, true, false], [type, state, action, reward, next_state, finished])){
            var [type, reward, next_state, finished] = this.table[state][action].get_sample(null, null, next_state, null)
            return [type, state, action, reward, next_state, finished]
        }
        
        throw new Error("정의되지 않은 케이스");
    }

    get_all_samples(type=null, state=null, action=null, reward=null, next_state=null, finished=null){
        if(this.check([false, false, false, false, true, false], [type, state, action, reward, next_state, finished])){
            var arr = []
            for(var x of this.state_to_pre_state_action[next_state]){
                [state, action] = JSON.parse(x)
                var [type, state, action, reward, next_state, finished] = this.get_sample(null, state, action, null, next_state, null)
                if(type == null)
                    continue
                arr.push([type, state, action, reward, next_state, finished])
            }
            return arr
        }
    }
    check(flags, values){
        for(var i=0 ; i<values.length ; i++){
            if(flags[i] != (values[i] != null)){
                return false
            }
        }
        return true
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
        this.recent_visit.forget()
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
        // this.forget_pre_state_action_by_state(state, action, forget_ratio) // 이전에서 전이되는 정보 삭제
    }

    forget_pre_state_action_by_state(state, action, forget_ratio){
        var next_states = this.table[state][action].get_all_next_states()
        for(var next_state of next_states){
            if(Math.random() < forget_ratio)
            this.state_to_pre_state_action[next_state].delete(JSON.stringify([state, action]))
        }
    }
}

class SampleModel{
    constructor(buffer_size){
        this.buffer = []
        this.buffer_size = buffer_size
    }

    update(sample){
        this.buffer.unshift(sample)
        if(this.buffer_size < this.buffer.length){
            this.buffer.pop()
        }
    }

    get_sample(){
        if(this.buffer.length == 0){
            return [null, null, null, null, null, null]
        }
        return random_util.randomChoice(this.buffer)
    }

    forget(){
        this.buffer = []
    }
}

class SampleModel2{
    constructor(buffer_size){
        this.buffer = []
        this.buffer_size = buffer_size
    }

    update(state, action, reward, next_state, finished){
        this.buffer.unshift([state, action, reward, next_state, finished])
        if(this.buffer_size < this.buffer.length){
            this.buffer.pop()
        }
    }

    get_sample(){
        if(this.buffer.length == 0){
            return [null, null, null, null, null, null]
        }
        var [state, action, reward, next_state, finished] = random_util.randomChoice(this.buffer)

        return ["recent", state, action, reward, next_state, finished]
    }
}