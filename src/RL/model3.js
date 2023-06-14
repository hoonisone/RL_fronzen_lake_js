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

class ActionStateValueModel{
    constructor({recent_buffer_size=10, old_buffer_size=100}){
        this.value = new GaussianDistributionModel({mean:0, variance:1, min_step_size:0.03})

        this.recent_value_distribution_model = new GaussianDistributionModel({mean:0, variance:1, min_step_size:0.1})
        this.old_value_distribution_model  = new GaussianDistributionModel({mean:0, variance:1, min_step_size:0.01})

        this.sample_model = new SeparableRewardStateModel({recent_buffer_size:recent_buffer_size, old_buffer_size:old_buffer_size})
        
        this.smd_threshold = 0.1
        this.sampling_num = 0
        this.forget_ratio = 0.8

        this.use_forget = false
    }
    update_model(reward, next_state, finished){
        this.sample_model.update(reward, next_state, finished)
    }

    get_reward_next_state_finished_sample(){
        return this.sample_model.get_reward_next_state_finished_sample()
    }

    get_reward_sample(next_step){
        return this.sample_model.get_reward_sample(next_step)
    }

    get_all_next_states(){
        return this.sample_model.get_all_next_states()
    }

    update_value(value, type="recent"){ // type: "recent", "old"
        
        var model_difference = this.check_model_difference()
        if(this.use_forget){
            if(2.3 < model_difference){
                this.forget_old(1)
                console.log("forget 1")
            }else if(2 < model_difference){
                this.forget_old(0.8)
                console.log("forget 0.8")
            }else if(1 < model_difference){
                this.forget_old(0.8)
                console.log("forget 0.5")
            }
        }
        // console.log("model_difference: ", model_difference)


        this.value.update(value)
        if(this.sample_model.is_separable()){
            switch(type){
            case "recent":
                this.recent_value_distribution_model.update(value)
                break;
            case "old":
                this.old_value_distribution_model.update(value)
                break;
            }
        }
        return 1 < model_difference
    }
    
    forget_old(forget_ratio){
        this.sample_model.forget_old_samples(forget_ratio)
        this.old_value_distribution_model.forget(1)
    }

    is_distribution_comparable(){ // 둘 다 어느정도 사이즈를 갖추었는가?
        return (this.recent_value_distribution_model.size > 10) && (this.old_value_distribution_model.size > 10)
    }

    
    check_model_difference(){
        if(this.is_distribution_comparable()){
            var recent_mean = this.recent_value_distribution_model.mean
            var recent_varance = this.recent_value_distribution_model.variance
            var old_mean = this.old_value_distribution_model.mean
            var old_variance = this.old_value_distribution_model.variance

            var recent_z = Math.abs(recent_mean-old_mean)/(old_variance**0.5)
            var old_z = Math.abs(old_mean-recent_mean)/(recent_varance**0.5)

            return Math.min(recent_z, old_z)
        }
        return 0
    }
    get_print(){
        return `
        value: ${this.value.mean}
        recent_size:${this.sample_model.recent_size}
        old_size:${this.sample_model.old_size}
        recent_mean:${this.recent_value_distribution_model.mean}
        old_mean:${this.old_value_distribution_model.mean}
        `
    }
}

class ActionStateValueModelTable{
    constructor(states, actions){        
        this.state_num = states.length
        this.action_num = actions.length

        this.table = this.create_action_state_model_table(this.state_num, this.action_num)

        this.gamma = 0.99
        this.planning_num = 1000

        this.after_action_value_update_callback = new Callback_2()

        this.heap = new Heap()
        this.planning_value_threshold = 0.05
        this.dict = {}

        this.recent_visit = []
    }

    set use_forget(value){
        for(var state=0 ; state<this.state_num ; state++){
            for(var action=0 ; action<this.action_num ; action++){
                this.table[state][action].use_forget = value
            }
        }
    }

    create_action_state_model_table(height, width){
        var table = util.ndarray([height, width], 0)
        for(var y=0 ; y<height ; y++){
            for(var x=0 ; x<width ; x++){
                table[y][x] = new ActionStateValueModel({recent_buffer_size:3, old_buffer_size:100})
            }
        }
        return table
    }

    update_value(s, a, r, ns, f){ // state, action, reward, next state, finished
        var value = this.bootstrap_value(r, ns, f)
        
        var p = Math.abs(value- this.table[s][a].value.mean)
        if(this.planning_value_threshold <p) {
            this.heap.push([p, s, a])
        }

        var env_change = this.table[s][a].update_value(value, "recent")
        if(env_change){
            var next_states = this.table[s][a].get_all_next_states()
            for(var next_state of next_states){
                delete this.dict[next_state]
            }
        }

        this.after_action_value_update_callback.invoke(s, a)

        this.recent_visit.unshift([s, a])
        if(10000 < this.recent_visit){
            this.recent_visit.pop()
        }
        return env_change
    }

    bootstrap_value(r, ns, f){ // reward, next step, finished
        var next_return = (f == true) ? 0 : Math.max(...this.get_values_for_state(ns))    
        var cur_return = r + this.gamma*next_return
        return cur_return
    }

    update_model(s, a, r, ns, f){
        this.table[s][a].update_model(r, ns, f)
    }

    update(s, a, r, ns, f){
        if(!(ns in this.dict)){
            this.dict[ns] = new Set()
        }
        this.dict[ns].add(JSON.stringify([s, a]))
        var env_change = this.update_value(s, a, r, ns, f)
        this.update_model(s, a, r, ns, f)

        return env_change
    }

    pq_planning(){
        var visited = new Set()
        while(!this.heap.is_empty()){

            
            var [_, state, action] = this.heap.pop()
            var [type, [reward, next_state, finished]] = this.table[state][action].get_reward_next_state_finished_sample()
            if(type == null){
                continue
            }

            visited.add(`${[state, action]}`)

            var value = this.bootstrap_value(reward, next_state, finished)
            this.table[state][action].update_value(value, type)
            this.after_action_value_update_callback.invoke(state, action)

            next_state = state
            if(!(next_state in this.dict))
                continue
            for(var x of this.dict[next_state]){
                var [ps, pa] = JSON.parse(x)
                if(visited.has(`${[ps, pa]}`)){
                    continue
                }else{
                }
                var [__, r] = this.table[ps][pa].get_reward_sample(next_state)
                if(r == null){
                    continue
                }
                value = this.bootstrap_value(r, next_state, finished)
                var p = Math.abs(value - this.table[ps][pa].value.mean)
                if(this.planning_value_threshold <= p){
                    this.heap.push([p, ps, pa])
                }
            }
        }

    }

    planning(){
        this.pq_planning()
        for(var i=0 ; i<this.planning_num ; i++){
            var[s, a] = random_util.randomChoice(this.recent_visit)
            var [type, [reward, next_state, finished]] = this.table[s][a].get_reward_next_state_finished_sample()
            if(reward == null){
                continue
            }

            var value = this.bootstrap_value(reward, next_state, finished)
            this.table[s][a].update_value(value, type)
            
            this.after_action_value_update_callback.invoke(s, a)
        }
    }

    getValueMap(){
        let valueMap = []
        for(var state of this.states){
            var q_values  = this.get_values_for_state(state)            
            var max_q_value = Math.max(...q_values)
            valueMap.push(Math.floor(max_q_value*100)/100)
        }
        return valueMap
    }

    get_values_for_state(state){
        var qValues  = []
        // console.log(state)
        // console.log(this.table[state])
        for(var x of this.table[state]){
            qValues.push(x.value.mean)
        }
        return qValues
    }

}

class StateActionModel{
    constructor(states, actions){        
        this.state_num = states.length
        this.action_num = actions.length

        this.table = this.create_action_state_model_table(this.state_num, this.action_num)

        this.gamma = 0.99
        this.planning_num = 1000

        this.after_action_value_update_callback = new Callback_2()

        this.heap = new Heap()
        this.planning_value_threshold = 0.05
        this.dict = {}

        this.recent_visit = []
    }
}

// var m = new AdaptableValueManager({recent_buffer_size:5, old_buffer_size:100})

// function gaussianRandom() {
//     var v1, v2, s;
  
//     do {
//       v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
//       v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
//       s = v1 * v1 + v2 * v2;
//     } while (s >= 1 || s == 0);
  
//     s = Math.sqrt( (-2 * Math.log(s)) / s );
  
//     return v1 * s;
// }

// for(var i=0 ; i<100 ; i++){
//     var value = gaussianRandom()
//     // console.log("value: ", value)
//     m.update_value(value)
//     // console.log(m.get_print())
//     m.update_model(value)
//     for(var j=0 ; j<30 ; j++){
//         var type, sample
//         [type, sample] = m.get_sample()
//         m.update_value(sample, type)
//     }
//     console.log(i, Math.abs(m.recent_value_distribution_model.mean-m.old_value_distribution_model.mean), m.is_distribution_comparable())
// }

// for(var i=0 ; i<100 ; i++){
//     var value = gaussianRandom()+3
//     // console.log("value: ", value)
//     m.update_value(value)
//     // console.log(m.get_print())
//     m.update_model(value)
//     for(var j=0 ; j<30 ; j++){
//         var type, sample
//         [type, sample] = m.get_sample()
//         m.update_value(sample, type)
//     }
//     console.log(i, Math.abs(m.recent_value_distribution_model.mean-m.old_value_distribution_model.mean), m.is_distribution_comparable())
// }

// for(var i=0 ; i<100 ; i++){
//     var value = gaussianRandom()/10+3
//     // console.log("value: ", value)
//     m.update_value(value)
//     // console.log(m.get_print())
//     m.update_model(value)
//     for(var j=0 ; j<30 ; j++){
//         var type, sample
//         [type, sample] = m.get_sample()
//         m.update_value(sample, type)
//     }
//     console.log(i, Math.abs(m.recent_value_distribution_model.mean-m.old_value_distribution_model.mean), m.is_distribution_comparable())
// }
// for(var i=0 ; i<100 ; i++){
//     var value = gaussianRandom()/10+3.3
//     // console.log("value: ", value)
//     m.update_value(value)
//     // console.log(m.get_print())
//     m.update_model(value)
//     for(var j=0 ; j<30 ; j++){
//         var type, sample
//         [type, sample] = m.get_sample()
//         m.update_value(sample, type)
//     }
//     console.log(i, Math.abs(m.recent_value_distribution_model.mean-m.old_value_distribution_model.mean), m.is_distribution_comparable())
// }