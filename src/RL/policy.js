
class EnvChangeRatioChecker{
    constructor(max_buffer_size = 1000){
        this.buffer = []
        this.count = 0
        this.max_buffer_size = max_buffer_size
    }

    update(changed){
        this.count += changed ? 1 : 0
        this.buffer.push(changed)

        if(this.max_buffer_size < this.buffer.length){
            this.count -= this.buffer.shift() ? 1 : 0
        }
    }

    get_ratio(){
        return this.count/this.buffer.length
    }
}

class PolicyParameterManager{
    constructor(initial_epsilon, initial_kappa){
        // epsilon

        this.min_epsilon = 0.01
        this.max_epsilon = 1
        this._epsilon = initial_epsilon

        // kappa

        this.max_kappa = 0.01
        this.min_kappa = 0.0001
        this._kappa = initial_kappa

        this.env_change_checker = new EnvChangeRatioChecker(300)
    }

    update(env_changed){
        this.env_change_checker.update(env_changed)
        var env_change_ratio = this.env_change_checker.get_ratio()

        this._epsilon = Math.max(env_change_ratio*this.max_epsilon, this.min_epsilon)
        this._kappa = Math.max(env_change_ratio*this.max_kappa, this.min_kappa)
    }

    get epsilon(){return this._epsilon}
    set epsilon(value){
        if(this.use_auto_epsilon == false){
            this._epsilon = value
        }
    }

    get kappa(){return this._kappa}
    set kappa(value){
        if(this.use_auto_kappa == false){
            this._kappa = value
        }
    }
}

class Policy{
    constructor(epsilon = 0.05, kappa = 0.000, use_auto_epsilon = false, use_auto_kappa = false){
        this.epsilon = epsilon
        this.kappa = kappa // tau weight (kappa)

        this.use_auto_epsilon = use_auto_epsilon
        this.use_auto_kappa = use_auto_kappa
        this.parameter_manager = new PolicyParameterManager(epsilon, kappa)
    }

    update_parameter(env_changed){
        '환경 변화 여부에 따라 탐색 파라미터 갱신'
        this.parameter_manager.update(env_changed)
        this.epsilon = this.use_auto_epsilon ? this.parameter_manager.epsilon : this.epsilon
        this.kappa = this.use_auto_kappa ? this.parameter_manager.kappa : this.kappa   
    }

    greedy_choose(actions, values){
        var max_index_list = util.argMax(values, {all:true})
        var index = util.randomChoice(max_index_list)
        return actions[index]
    }

    random_choose(actions){
        return util.randomChoice(actions)
    }

    epsilon_greedy_choose(actions, values){
        if (Math.random() < this.epsilon){
            return this.random_choose(actions)            
        }else{
            return this.greedy_choose(actions, values)
        }
    }

    recalculate_value(q_values, tau){
        console.log('미구현 abstract function')
    }

    choose_action(actions, q_values, tau){
        var action_values = this.recalculate_value(q_values, tau)
        return this.epsilon_greedy_choose(actions, action_values)
    } 
    

}

class AdaptablePolicy extends Policy{
    constructor(epsilon = 0.05, kappa = 0.000){super(epsilon, kappa, true, true)}

    recalculate_value(q_values, tau){
        var tau_values = util.vSquare([...tau], 0.5)

        tau_values = util.vConstMul(tau_values, this.kappa)
        return util.vAdd(q_values, tau_values)
    }
}

class StationaryPolicy extends Policy{
    constructor(epsilon = 0.05, kappa = 0.000){super(epsilon, kappa, false, false)}
}

class ExploitationPolicy extends StationaryPolicy{
    recalculate_value(q_values, tau){
        var tau_values = util.vSquare([...tau], 0.5)

        tau_values = util.vConstMul(tau_values, this.kappa)
        return util.vAdd(q_values, tau_values)
    }
}

// class ExplorationPolicy extends StationaryPolicy{
//     recalculate_value(q_values, tau){
//         var tValue = util.vSquare([...tau], 0.5)

//         tValue = util.vConstMul(tValue, this.kappa)
//         return util.vAdd(eqValue, tValue)
//     }
// }

const PolicyMode = {
    Exploration: "exploration",
    Exploitation: "exploitation"
}

