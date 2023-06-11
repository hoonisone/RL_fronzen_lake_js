// const { AsyncDependenciesBlock } = require("webpack")/

class ShortTermSampleModel{
    constructor(max_buffer_size = 10){
        this.buffer = []
        this.max_buffer_size = max_buffer_size
    }

    update(sample){
        this.buffer.push(sample)
        return  (this.max_buffer_size < this.buffer.length) ? this.buffer.shift() : null
    }

    get_sample(){
        return (this.buffer.length == this.max_buffer_size) ? list_util.mean(this.buffer) : null
    }
}

class LongTermDistributionModel{
    static MIN_STD = 0.0000001
    constructor(mean=0, variance=1, min_step_size = 0.03){
        this.mean = mean
        this.variance = variance
        console.log("AdaptableModel",this.mean, this.variance)
        this.size = 0
        this.min_step_size = min_step_size
    }

    update(sample){
        this.size += 1
        var step_size = Math.max(1/this.size, this.min_step_size)
        this.variance += step_size*((sample-this.mean)**2 - this.variance)
        this.mean += step_size*(sample-this.mean)
    }

    get_z(sample){
        return (sample-this.mean)/Math.max(this.variance**(0.5), LongTermDistributionModel.MIN_STD) 
    }

    forget(forget_ratio){
        this.size = parseInt(this.size*(1-forget_ratio))
    }
}

class AdaptableModel{
    constructor(temp, mean=0, variance=1, forget_ratio=0.5, buffer_size=10, z_threshold = 2.33){ // 2.33
        
        this.ltdm = new LongTermDistributionModel(mean, variance)
        this.stsm = new ShortTermSampleModel(buffer_size)
        this.stsm_planning = new ShortTermSampleModel(buffer_size)
        this.forget_ratio = forget_ratio
        this.z_threshold = z_threshold // 2.33 = p_value 0.01
    }

    update(sample){
        var changed = this.check_distribution_change()
        if(changed){
            this.ltdm.forget(this.forget_ratio)
            console.log("forget")
        }
        var front = this.stsm.update(sample)
        if(front != null){
            this.ltdm.update(front)
        }
        return changed
    }

    update_planning(){
        var changed = this.check_distribution_change()
        if(changed){
            this.ltdm.forget(this.forget_ratio)
            console.log("forget")
        }
        var front = this.stsm.update(sample)
        if(front != null){
            this.ltdm.update(front)
        }
        return changed
    }
    update_ltdm_directly(sample){
        this.ltdm.update(sample)
    } 

    check_distribution_change(){
        var sample_mean = this.stsm.get_sample()
        if(sample_mean == null){
            return false
        }
        var z = Math.abs(this.ltdm.get_z(sample_mean))
        return this.z_threshold < z
    }
    get step_size(){
        
        return this.ltdm.min_step_size
    }
    set step_size(value){
        console.log("step_size: ", value)
        this.ltdm.step_size = value
    }

    get mean(){
        return this.ltdm.mean
    }

    get variance(){
        return this.ltdm.variance
    }

    get std(){
        return this.ltdm.variance**(0.5)
    }
}

function gaussianRandom() {
    var v1, v2, s;
  
    do {
      v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
      v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
      s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s == 0);
  
    s = Math.sqrt( (-2 * Math.log(s)) / s );
  
    return v1 * s;
}


class GausianModel{
    static MIN_VARIANCE = 0.0000000000000000000001 // 최소 분산 (to avoid zero divide)
    constructor(mean, variance, step_size=0.1, no_variance = false){
        this.mean = mean;
        this.variance = variance; 
        this.step_size = step_size
        this.n = 0
        this.no_variance = no_variance

        this.stable = false
        this.mean_p_value = 0
    }   

    update(value){
        var distribution_changed = this.update_stable(value)
        
        this.n += 1
        var step_size = Math.max((1/this.n), this.step_size)
        this.mean += step_size*(value - this.mean)
        this.variance += step_size*((value - this.mean)**2 - this.variance)
        this.variance = Math.max(this.variance, GausianModel.MIN_VARIANCE)

        return distribution_changed
    }

    update_stable(value){
        var p_value = this.p_value(value)
        this.mean_p_value += 0.3*(p_value - this.mean_p_value)

        if((this.stable == true) && (p_value < 0.05)){
            this.stable = false
            this.mean_p_value = 0
            return true
        }
        if(this.stable == false && this.mean_p_value > 0.9){
            this.stable = true
        }
        return false
    }

    get_value(){
        if(this.no_variance){
            return this.mean
        }else{
            return this.mean + util.gaussianRandom()*this.variance**(0.5);
        }
        
        
        // gaussian은 나중에 library로 사용(일단은 편차가 없으니깐..)
        // this.mean + this.update_ratio
    }

    p_value(value){
        var z = Math.abs(value-this.mean)/(this.variance**(0.5))
        return Math.exp(-z)
    }

    get_mean(){
        return this.mean
    }

    get_variance(){
        return this.variance
    }

    get_standard_deviation(){
        return this.variance**(1/2)
    }
}

class ModelFactory{
    static make(adaptable){
        if(adaptable){
            return new AdaptableModel({mean:0, variance:1, forget_ratio:0.5, buffer_size:10})
        }
        else{
            return new GausianModel(0, 1, 0.03, true)
        }
    }   
}

class Memory{
    constructor(states, actions){
        this.state_count_table = util.zeros([states.length])
        this.state_action_count_table = util.zeros([states.length, actions.length])
        this.visit_state_num = 0;
        this.visit_state_action_num = 0

    }

    count_state_and_check_first(state){
        this.state_count_table[state] += 1
        if(this.state_count_table[state] == 1){
            this.visit_state_num += 1
            return true
        }else{
            return false
        }
        
    }
    count_state_action_and_check_first(state, action){
        this.state_action_count_table[state][action] += 1
        if(this.state_action_count_table[state][action] == 1){
            this.visit_state_action_num += 1
            return true
        }else{
            return false
        }
    }

    get_state_action_num(state, action){
        return this.state_action_count_table[state][action]
    }

    get_state_num(state){
        return this.state_count_table[state]
    }
}


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



class StateActionValueModel{
    constructor(states, actions, mean, variance, step_size = 0.1, gamma = 0.99){
        
        this.states = states
        this.actions = actions
        this.state_num = states.length
        this.action_num = actions.length
        this.mean = mean
        this._step_size = step_size
        
        this.variance = variance
        this.gamma = gamma
        this.value_table = this.create_value_table()
    }


    set step_size(value){
        this._step_size = value
        for(var state=0 ; state<this.states.length ; state++){
            for(var action=0 ; action<this.actions.length ; action++){
                this.value_table[state][action].step_size = value
            }
        }
    }

    create_value_table(){
        var value_table =  util.ndarray([this.state_num, this.action_num], 0)
        for(var state=0 ; state<this.state_num ; state++){
            for(var action=0 ; action<this.action_num ; action++){
                value_table[state][action] = this.create_gausian_model()
            }
        }
        return value_table
    }

    get step_size(){
        return this._step_size
    }

    reset_all(){
        this.value_table = this.create_value_table()
    }

    create_gausian_model(){
        return ModelFactory.make(true)
    }

    reset(state, action ,next_state){
        // this.value_table[state][action] = this.create_gausian_model()

        // for(var action=0 ; action<actions.length ; action++){
        //     this.value_table[next_state][action] = new GausianModel(0, 1, step_size, false)
        // }
    }

    update(state, action, reward, next_state, finished){
        var next_return = (finished == true) ? 0 : this.gamma*Math.max(...this.get_values_for_state(next_state))
        var cur_return = reward + next_return

        var distribution_changed = this.value_table[state][action].update(cur_return)
        return distribution_changed
    }

    update_ltdm_directly(state, action, reward, next_state, finished){
        var next_return = (finished == true) ? 0 : this.gamma*Math.max(...this.get_values_for_state(next_state))
        var cur_return = reward + next_return

        var distribution_changed = this.value_table[state][action].update_ltdm_directly(cur_return)
        return distribution_changed
    }

    getValueMap(){
        let valueMap = []
        for(var i=0 ; i<this.states.length; i++){
            var qValues  = []
            for(var x in this.value_table[this.states[i]]){
                aValue.push(x.mean)
            }
            
            var maxQValues = Math.max(...qValues)
            valueMap.push(Math.floor(maxQValues*100)/100)
        }
        return valueMap
    }

    get_values_for_state(state){
        var qValues  = []
        for(var x of this.value_table[state]){
            qValues.push(x.mean)
        }
        return qValues
    }



}
class StateActionRewardModel{

    constructor(states, actions, mean, variance, step_size, no_variance = false){
        this.max_size = 10000
        this.samples = []
        
        this.mean = mean
        this.variance = variance
        this.step_size = step_size
        this.no_variance = no_variance
        
        this.states = states
        this.actions = actions
        this.state_num = states.length
        this.action_num = actions.length

        this.reward_model_table = this.create_reward_model_table()
    }

    reset_all(){
        this.reward_model_table = this.create_reward_model_table()
        this.samples = []
    }
    create_reward_model_table(){
        var reward_model_table = util.ndarray([this.state_num, this.action_num], 0)
        for(var state=0 ; state<this.state_num ; state++){
            for(var action=0 ; action<this.action_num ; action++){
                reward_model_table[state][action] = this.create_gausian_model()
            }
        }
        return reward_model_table
    }

    create_gausian_model(){
        return ModelFactory.make(false)
    }
    reset(state, action, next_state){
        for(var a=0 ; a<this.actions.length ; a++){
            this.reward_model_table[state][a] = this.create_gausian_model()
        }

        // for(var action=0 ; action<actions.length ; action++){
        //     this.reward_model_table[next_state][action] = new GausianModel(this.mean, this.variance, this.update_ratio, this.no_variance)
        // }
        // var new_samples = []
        // for(var i=this.samples.length-1 ; i>=0 ; i--){
        //     var _state, _action, _next_state, finished
        //     [_state, _action, next_state, finished] = this.samples[i]
        //     if((state != _state || action != _action) && (state != _next_state)){
        //         new_samples.push(this.samples[i])
        //     }
        //     // this.reward_model_table[state][action].mean = 0
        //     // this.reward_model_table[state][action].variance = 0
        // }
        // this.samples = new_samples

        for(var i=0 ; i<this.samples.length ; i++){
            var _state, _action, _next_state, finished
            [_state, _action, next_state, finished] = this.samples[i]
            if(_state == state && _action == action){
                if(Math.random() < 0.5)
                    this.samples.splice(i, 1)
            }
        }

    }

    update(state, action, reward, next_state, finished){
        this.reward_model_table[state][action].update(reward)
        if (this.max_size < this.samples.length){
            this.samples.shift()
        }
        this.samples.push([state, action, reward, next_state, finished])
    }

    p_value(state, action, reward){
        return this.reward_model_table[state][action].p_value(reward)
    }

    get_sample(){
        if(this.samples.length == 0){
            return null
        }
        
        var idx = Math.floor(Math.random()*this.samples.length)
        var state, action, reward, next_state, finished
        [state, action, reward, next_state, finished] = this.samples[idx]
        // if(Math.random() < 0.0001){
        //     this.samples.splice(idx, 1)
        // }
        // reward = this.reward_model_table[state][action].get_value()/
        return [state, action, reward, next_state, finished]
    }

    get_means_for_state(state){
        var means = []
        this.reward_model_table[state].forEach(model => means.push(model.get_mean()))
        return means
    }

    get_variances_for_state(state){
        var variances = []
        this.reward_model_table[state].forEach(model => variances.push(model.get_variance()))
        return variances
    }

    get_standard_deviations_for_state(state){
        var standard_deviations = []
        this.reward_model_table[state].forEach(model => standard_deviations.push(model.get_standard_deviation()))
        return standard_deviations
    }
}

class ValueManager{
    constructor(states, actions, ...args){
        // value table
        this.q_value_mean = 0
        this.q_value_variance = 1
        this.q_value_step_size = 0.1
        this.discounting_factor = 0.99

        // reward model
        this.reward_mean = 0
        this.reward_variance = 0
        this.reward_step_size = 0.1

        // planning
        this.planning_num = 100

        this.seg_arg(args[0])

        this.value_table = new StateActionValueModel(states, actions, this.q_value_mean, this.q_value_variance, this.q_value_step_size, this.discounting_factor)
        this.reward_model = new StateActionRewardModel(states, actions, this.reward_mean, this.reward_variance, this.reward_step_size, {no_variance : false})
        
        this.after_action_value_update_callback = new Callback_2() // state, action
    }

    get gamma(){
        return this.value_table.gamma
    }
    set gamma(value){
        this.value_table.gamma = value
    }

    get step_size(){
        return this.value_table.step_size
    }
    set step_size(value){
        return this.value_table.step_size = value
    }


    seg_arg(args){
        // value model
        this.q_value_mean = (args.q_value_mean != null)?args.q_value_mean:this.q_value_mean
        this.q_value_variance = (args.q_value_variance != null)?args.q_value_variance:this.q_value_variance
        this.q_value_step_size = (args.q_value_step_size != null)?args.q_value_step_size:this.q_value_step_size
        this.discounting_factor = (args.discounting_factor != null)?args.discounting_factor:this.discounting_factor

        // reward model
        this.reward_mean = (args.reward_mean != null)?args.reward_mean:this.reward_mean
        this.reward_variance = (args.reward_variance != null)?args.reward_variance:this.reward_variance
        this.reward_step_size = (args.reward_step_size != null)?args.reward_step_size:this.reward_step_size

        // planning
        this.planning_num = (args.planning_num != null)?args.planning_num:this.planning_num

        // check arg
        console.log("args", args)

        console.log(args.q_value_mean != null)
        console.log(args.q_value_variance != null)
        console.log(args.q_value_step_size != null)
        console.log(args.discounting_factor != null)

        console.log(args.reward_mean != null)
        console.log(args.reward_variance != null)
        console.log(args.reward_step_size != null)

        console.log(args.planning_num != null)

        // check setting value
        console.log(this.q_value_mean)
        console.log(this.q_value_variance)
        console.log(this.q_value_step_size)
        console.log(this.discounting_factor)

        console.log(this.reward_mean)
        console.log(this.reward_variance)
        console.log(this.reward_step_size)

        console.log(this.planning_num)
    }
    reset_all(){
        this.reset_all_value()    
        this.reset_all_model()
    }

    reset_all_value(){
        this.value_table.reset_all()
    }

    reset_all_model(){
        this.reward_model.reset_all()
    }

    update(state, action, reward, next_state){
        var distribution_changed = this.value_table.update(state, action, reward, next_state)
        this.reward_model.update(state, action, reward, next_state)
        this.after_action_value_update_callback.invoke(state, action)
        return distribution_changed
    }

    planning(){
        for(var i=0 ; i<this.planning_num ; i++){
            
            var sample = this.reward_model.get_sample()
            if(sample == null) {
                break;
            }
            var state, action, reward, next_state, finished
            [state, action, reward, next_state, finished] = sample
            this.value_table.update_ltdm_directly(state, action, reward, next_state, finished)
            this.after_action_value_update_callback.invoke(state, action)            
        }
    }

    reset(state, action, next_state){
        // this.value_table.reset(state, action, next_state)
        this.reward_model.reset(state, action, next_state)
    }

    getValueMap(){
        return this.value_table.getValueMap()
    }


    get_values_for_state(state){
        return this.value_table.get_values_for_state(state)
    }

    get_reward_means_for_state(state){
        return this.reward_model.get_means_for_state(state)
    }

    get_reward_variations_for_state(state){
        return this.reward_model.get_variations_for_state(state)
    }

    get_reward_standard_deviations_for_state(state){
        return this.reward_model.get_standard_deviations_for_state(state)
    }

    p_value(state, action, reward){
        return this.reward_model.p_value(state, action, reward)
    }

}

// class GaussianModel2{
//     constructor{
//         this.mean = 0
//         this.variance = 1
//     }
// }


// m = ModelFactory.make()
// console.log("Distribution 1")
// for(var i=0 ; i<1000 ; i++){
//     if(m.update(gaussianRandom()*0.1)){
//         console.log("forget", 1)
//     }
// }
// console.log("Distribution 2")
// for(var i=0 ; i<1000 ; i++){
//     if(m.update(gaussianRandom()*0.1+0.3)){
//         console.log("forget", 1)
//     }
// }
