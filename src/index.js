// import {FrozenLakeEnvViewer, CellAgentViewer, GridCellViewer} from "./MLView.js"
// import {FrozenLake, Agent} from "./ML.js"

// import { random } from "numjs";

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
class util{
    array_functions = []
    static argMax(array, all=false) {
        if(all == false){
            return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
        }else{
            var max_value = Math.max(...array)
            var max_index_list = []
            for(var i=0 ; i<array.length ; i++){
                if (array[i] == max_value){
                    max_index_list.push(i)
                } 
            }
            return max_index_list
        }
    }

    static listComp(list1, list2){
        return JSON.stringify(list1) === JSON.stringify(list2)
    }

    static zeros(dims){
        if (dims.length == 1){
            return Array(dims[0]).fill(0);
        }
        else{
            var arr = []
            for(var i=0 ; i<dims[0] ; i++){
                arr.push(util.zeros(dims.slice(1)));
                // arr.push(util.array(args.slice(1)));
            }
            return arr;
        }
    }
    static ones(dims){
        if (dims.length == 1){
            return Array(dims[0]).fill(1);
        }
        else{
            var arr = []
            for(var i=0 ; i<dims[0] ; i++){
                arr.push(util.ones(dims.slice(1)));
                // arr.push(util.array(args.slice(1)));
            }
            return arr;
        }
    }
    static ndarray(dims, value){
        
        if (dims.length == 1){
            return Array(dims[0]).fill(value);
        }
        else{
            var arr = []
            for(var i=0 ; i<dims[0] ; i++){
                arr.push(util.ndarray(dims.slice(1), value));
                // arr.push(util.array(args.slice(1)));
            }
            return arr;
        }
    }
    static sum(v){
        v = [...v]
        return v.reduce((a, b) => a+b, 0)
    }
    static argProbability(probabilities){
        var p = Math.random()
        for(var i=0 ; i<probabilities.length ; i++){
            if(p < probabilities[i]){
                return [i]
            }
            p -= probabilities[i]
        }
        return null
    }

    static randomChoice(items){
        var index = Math.floor(Math.random() * items.length);
        return items[index];
    }
    static range(start, end, step=1) {
        let array = [];
        for (let i = start; i < end; ++i) {
          if (!(i % step)) {
            array.push(i);
          }
        }
        return array;
    }
    static vAdd(arr1, arr2){
        var arr = []
        for(var i=0 ; i<arr1.length; i++){
            arr.push(arr1[i] + arr2[i])
        }
        return arr
    }
    static vSub(arr1, arr2){
        var arr = []
        for(var i=0 ; i<arr1.length; i++){
            arr.push(arr1[i] - arr2[i])
        }
        return arr
    }
    static vConstAdd(v, c){
        v = [...v]
        for(var i=0 ; i<v.length; i++){
            v[i] += c
        }
        return v
    }
    static vConstMul(v, c){
        v = [...v]
        for(var i=0 ; i<v.length; i++){
            v[i] *= c
        }
        return v
    }
    static vSquare(v, x){
        v = [...v]
        for(var i=0 ; i<v.length; i++){
            v[i] **= x
        }
        return v
    }

    static gaussianRandom() {
        var v1, v2, s;
      
        do {
          v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
          v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
          s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s == 0);
      
        s = Math.sqrt( (-2 * Math.log(s)) / s );
      
        return v1 * s;
      }
}

class Callback_0{
    constructor(){
        this.callbacks = []
    }

    add(callback){
        this.callbacks.push(callback)
    }

    invoke(){
        for(var i=0 ; i<this.callbacks.length ; i++){
            this.callbacks[i]()
        }
    }
}
class Callback_1{
    constructor(){
        this.callbacks = []
    }

    add(callback){
        this.callbacks.push(callback)
    }

    invoke(a){
        for(var i=0 ; i<this.callbacks.length ; i++){
            this.callbacks[i](a)
        }
    }
}
class Callback_2{
    constructor(){
        this.callbacks = []
    }

    add(callback){
        this.callbacks.push(callback)
    }

    invoke(a, b){
        for(var i=0 ; i<this.callbacks.length ; i++){
            this.callbacks[i](a, b)
        }
    }
}
class Callback_3{
    constructor(){
        this.callbacks = []
    }

    add(callback){
        this.callbacks.push(callback)
    }

    invoke(a, b, c){
        for(var i=0 ; i<this.callbacks.length ; i++){
            this.callbacks[i](a, b, c)
        }
    }
}

var label = ["open", "start", "hall", "wall", "goal"]
class CellAgentViewer{
    constructor(){
        this.mode = "background_color_change"
        this.element = this.createElement()
        this.setType("explorer");

        this.mode_init(this.mode)
        this.AgentShowDelegator = AgentShowDelegatorFactory.make(this)
        
    }
    mode_init(){

    }
    createElement(mode = "circle"){
        switch(mode){
        case "circle":
            var element = document.createElement("div");
            element.className = "agent";
            return element
        case "mouse":
            var element = document.createElement("div");
            element.className = "agent";
            element.innerHTML = `<img class = "agent_img" src = "./static/image/mouse.png">`
            return element
        }
    }
    setType(type){
        switch(type){
        case "exploitater":
            this.element.style.backgroundColor = "Crimson";
            break;
        case "explorer":
            this.element.style.backgroundColor = "Darkcyan";
            break;
        }
    }
    getElement(){
        return this.element;
    }
    show(flag){
        this.AgentShowDelegator.show(flag)
    }

}

class AgentShowDelegator{
    constructor(agentView){
        this.agentView = agentView
    }
    show(flag){
        console.log("미구현")
    }
}

class AgentShowDelegatorFactory{
    static make(agentElement){
        // return new AgentShowByVisibility(agentElement)
        return new AgentShowByColor(agentElement)
    }
}

class AgentShowByVisibility extends AgentShowDelegator{
    constructor(agentView){
        super(agentView)
    }
    show(flag){
        this.agentView.element.style.visibility = flag? "":"hidden"
        this.agentView.element.style.backgroundColor = "transparent"
    }
}
class AgentShowByColor extends AgentShowDelegator{
    constructor(agentView){
        super(agentView)
        this.backgroundColor = "transparent"
        this.showColor = "Darkcyan"
    }
    show(flag){
        
        this.agentView.element.style.backgroundColor = flag ? this.showColor:this.backgroundColor;
        
    }
}

class GridCellViewer{

    static BASIT_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    static CIRCLE_ORDER = [4, 1, 3, 5, 7, 0, 2, 6, 8]
    static MAX_AGENT_NUM = 9
    constructor(x, y){

        [this.element, this.agents] = this.createNode()
        this.x = x
        this.y = y
        this.setState("open")
        // this.showAllAgent(false)
        this.agentNum = 0;


        this.order = GridCellViewer.CIRCLE_ORDER

        this.click_callback = new Callback_2()
        this.ctrl_click_callback = new Callback_2()

        
        this.element.addEventListener("click", (e) => {
            if(e.ctrlKey){
                this.ctrl_click_callback.invoke(this.x, this.y)
            }else{
                this.click_callback.invoke(this.x, this.y)
            }
        })
            
        this.setArrow("up", 0.5)
        this.setArrow("down", 0.5)
        this.setArrow("left", 0.5)
        this.setArrow("right", 0.5)
        
    }
    select(flag){
        if(flag){
            this.element.style.borderWidth = "thick";
        }else{
            this.element.style.borderWidth = "thin";
        }
    }

    createNode(){
        var element = document.createElement("div");
        element.className = "grid_cell"
        element.innerHTML = `   <div class = "inner_item">
                                    <div class="value">0.0</div>
                                    <div class="reward">r=0.0</div>
                                    <div class="left_arrow"></div>
                                    <div class="right_arrow"></div>
                                    <div class="up_arrow"></div>
                                    <div class="down_arrow"></div>
                                <div>`;

        var innerItem = element.getElementsByClassName("inner_item")[0];
        var agents = [] 
        var position = [20, 50, 80]
        for (var y=0 ; y<3 ; y++){
            for (var x=0 ; x<3 ; x++){
                var agent = new CellAgentViewer();
                agent.getElement().style.top = `${position[y]}%`
                agent.getElement().style.left = `${position[x]}%`
                agents.push(agent);
                innerItem.insertBefore(agent.getElement(), innerItem.firstChild)
                agent.show(false)
            }
        }
        // for (var y=0 ; y<3 ; y++){
        //     for (var x=0 ; x<3 ; x++){
        //         var agent = new CellAgentViewer();
        //         agent.getElement().style.top = `${position[y]}%`
        //         agent.getElement().style.left = `${position[x]}%`
        //         agents.push(agent);
        //         innerItem.insertBefore(agent.getElement(), innerItem.firstChild)
        //     }
        // }
        // for (var y=0 ; y<3 ; y++){
        //     for (var x=0 ; x<3 ; x++){
        //         var agent = new CellAgentViewer();
        //         agent.getElement().style.top = `${position[y]}%`
        //         agent.getElement().style.left = `${position[x]}%`
        //         agents.push(agent);
        //         innerItem.insertBefore(agent.getElement(), innerItem.firstChild)
        //     }
        // }
        return [element, agents];
    }
    setValue(value){
        this.element.getElementsByClassName("value")[0].innerHTML = `${value}`
        if(this.type == "F"){
            // this.element.style.backgroundColor = [255, 1, 1];
            
            if(0 < value){
                value = Math.max(Math.floor(100*(value**(1/2))), 0)

                var r = (255-value).toString(16)
                var g = (255).toString(16)
                var b = (255-value).toString(16)
            }else{
                value = Math.max(Math.floor(-100*value), 0)

                var r = (255).toString(16)
                var g = (255-value).toString(16)
                var b = (255-value).toString(16)
            }
            this.element.style.backgroundColor = `#${r}${g}${b}`
        }
    }
    setReward(reward){
        this.element.getElementsByClassName("reward")[0].innerHTML = `r=${reward}`
    }

    setArrows(q_value){
        
        var min = Math.min(...q_value)
        
        q_value = util.vSub(q_value, util.ndarray([q_value.length], min))
        

        q_value = util.vSquare(q_value, 5)

        var sum = q_value.reduce((a, b) => a+b, 0)

        if(sum == 0){
            q_value = [0, 0, 0, 0]
        }else{
            q_value = util.vConstMul([...q_value], (1/sum))
        }

        this.setArrow("up", q_value[0])
        this.setArrow("down", q_value[1])
        this.setArrow("left", q_value[2])
        this.setArrow("right", q_value[3])
    }

    setArrow(direction, ratio){


        switch(direction){
        case "up":
            this.element.getElementsByClassName("up_arrow")[0].style.top = `${50*(1-ratio)}%`
            this.element.getElementsByClassName("up_arrow")[0].style.height = `${50*ratio}%`
            break;
        case "down":
            this.element.getElementsByClassName("down_arrow")[0].style.height = `${50*ratio}%`
            break;
        case "left":
            this.element.getElementsByClassName("left_arrow")[0].style.left = `${50*(1-ratio)}%`
            this.element.getElementsByClassName("left_arrow")[0].style.width = `${50*ratio}%`
            break;
        case "right":
            this.element.getElementsByClassName("right_arrow")[0].style.width = `${50*(ratio)}%`
            break;
        }
        
    }

    getElement(){
        return this.element;
    }

    setState(type){
        this.type = type
        switch(type){
        case "S":
            this.element.style.backgroundColor = "Cyan";
            break;
        case "F":
            this.element.style.backgroundColor = "white";
            break;
        // case "wall":
        //     this.element.style.backgroundColor = "grey";
        //     break;
        case "H":
            this.element.style.backgroundColor = "Lightblue";
            break;

        case "G":
            this.element.style.backgroundColor = "Chartreuse";
            break;

        }
    }
    // showAllAgent(flag){
    //     this.agents.forEach((agent) => agent.show(flag));
    // }
    // showAgent(idx, flag){
    //     this.agents[idx].show(flag);
    // }

    getAgent(idx){
        return this.agents[this.order[idx]]
    }
    agentEnter(){
        this.agentNum += 1
        
        if(this.agentNum <= GridCellViewer.MAX_AGENT_NUM){
            this.getAgent(this.agentNum-1).show(true)
        }
    }
    agentExit(){
        this.agentNum -= 1
        if(this.agentNum < 0){
            this.agentNum = 0
        }
        if(this.agentNum < GridCellViewer.MAX_AGENT_NUM){
            this.getAgent(this.agentNum).show(false)
        }
    }

}


class FrozenLakeEnvViewer{
    constructor(width, height, cellSize){
        this.selected_cell = null
        this.width = width;
        this.height = height;

        [this.element, this.cellMap] = this.createElement(width, height)

        this.resizeCell(cellSize)

        this.click_callback = new Callback_2()
        this.ctrl_click_callback = new Callback_2()

        this.click_callback.add((x, y) => this.select(x, y))
    }

    resizeCell(size){
        this.element.style.gridTemplateColumns = `${size}px `.repeat(this.width);
        this.element.style.gridTemplateRows = `${size}px `.repeat(this.height);
    }
    getElement(){
        return this.element;
    }

    select(x, y){
        if(this.selected_cell != null){
            this.selected_cell.select(false)
        }
        this.selected_cell = this.cellMap[y][x]
        this.selected_cell.select(true)
    }

    createElement(width, height){
        var element = document.createElement("div");
        element.className = "grid_map"

        var map = Array.from(Array(height), () => new Array(width))
        for (var y=0 ; y<height ; y++){
            for (var x=0 ; x<width ; x++){
                var gridCell = new GridCellViewer(x, y)
                gridCell.click_callback.add((x, y) => this.click_callback.invoke(x, y))
                gridCell.ctrl_click_callback.add((x, y) => this.ctrl_click_callback.invoke(x, y))       
                element.appendChild(gridCell.getElement())     
                map[y][x] = gridCell;
            }    
        }
        return [element, map]; 
    }
    setState(x, y, state){
        this.cellMap[y][x].setState(state)
    }
    setStateMap(stateMap){
        for (var y=0 ; y<this.height ; y++){
            for (var x=0 ; x<this.width ; x++){
                this.setState(x, y, stateMap[y][x])
            }    
        }
    }
    setValue(x, y, value){
        this.cellMap[y][x].setValue(value)
    }
    setValueMap(valueMap){
        for (var y=0 ; y<this.height ; y++){
            for (var x=0 ; x<this.width ; x++){
                this.setValue(x, y, valueMap[y][x])
            }    
        }
    }

    setArrows(x, y, arrows_ratio){
        this.cellMap[y][x].setArrows(arrows_ratio)
    }
    setArrowsMap(arrows_ratio_map){
        for (var y=0 ; y<this.height ; y++){
            for (var x=0 ; x<this.width ; x++){
                this.setArrows(x, y, arrows_ratio_map[y][x])
            }    
        }
    }
    
    
    setReward(x, y, reward){
        this.cellMap[y][x].setReward(reward)
    }
    setRewardMap(rewardMap){
        for (var y=0 ; y<this.height ; y++){
            for (var x=0 ; x<this.width ; x++){
                this.setReward(x, y, rewardMap[y][x])
            }    
        }
    }


    showAgent(x, y, agent_idx, flag){
    
        if(flag == true){
            this.cellMap[y][x].agentEnter()
        }else{
            this.cellMap[y][x].agentExit()
        }
        // showAgent(agent_idx, flag)
    }
}
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

        // this.q_value_table = new ActionValueTable(states, actions, this.q_default_value, this.q_step_size, this.q_gamma)
        // this.q_value_model = new ActionRewardModel(states, actions, this.q_model_mean, this.q_model_variance, this.q_model_step_size)

        // this.e_value_table = new ActionValueTable(states, actions, this.e_default_value, this.e_step_size, this.e_gamma)
        // this.e_value_model = new ActionRewardModel(states, actions, this.e_model_mean, this.e_model_variance, this.e_model_step_size, false)

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
class GausianModel{
    static MIN_VARIANCE = 0.0000000000000000000001 // 최소 분산 (to avoid zero divide)
    constructor(mean, variance, update_ratio=0.1, no_variance = false){
        this.mean = 0;
        this.variance = GausianModel.MIN_VARIANCE; 
        this.update_ratio = update_ratio
        this.n = 0
        this.no_variance = no_variance
    }   

    update(value){
        this.n += 1
        var update_ratio = Math.max((1/this.n), this.update_ratio)
        this.mean += update_ratio*(value - this.mean)
        this.variance += update_ratio*((value - this.mean)**2 - this.variance)
        this.variance = Math.max(this.variance, GausianModel.MIN_VARIANCE)
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

    is_mutation(value){
        var z = Math.abs(value-this.mean)/(this.variance**(0.5))
        console.log("z", z)
        console.log("value", value)
        console.log("mean", this.mean)
        console.log("variance", this.variance)
        console.log("@@@@@@@@@", (1-Math.exp(-(z)))**10)
        return (1-Math.exp(-(z)))**10
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

class Policy{
    constructor(agent, epsilon = 0.03, qw = 1, ew = 0.01, bw = 0.01, tw = 0.000){
        this.agent = agent

        this.epsilon = epsilon
        this.qw = qw // real value weight
        this.ew = ew // exploration value weight
        this.bw = bw
        this.tw = tw // tau weight (kappa)
    }

    getTValueForState(state){
        var tau = this.agent.get_tau_value_table().value_table[state]

        tau = util.vSquare([...tau], 0.5)
        return tau
    }
    getQValueForState(state){
        return this.agent.q_manager.get_values_for_state(state)
    }
    getEValueForState(state){ 
        return this.agent.e_manager.get_values_for_state(state)
    }
    getBValueForState(state){
        return this.agent.b_manager.get_values_for_state(state)
    }
    getValueForState(state){
        var qValue = this.getQValueForState(state)
        var eValue = this.getEValueForState(state)
        var bValue = this.getBValueForState(state)
        var tValue = this.getTValueForState(state)
        qValue = util.vConstMul(qValue, this.qw)
        eValue = util.vConstMul(eValue, this.ew)
        bValue = util.vConstMul(bValue, this.bw)
        tValue = util.vConstMul(tValue, this.tw)
        
        return util.vAdd(util.vAdd(qValue, eValue), util.vAdd(bValue, tValue))
    }

    choose_action(state){
        var values = this.getValueForState(state)
        if (Math.random() < this.epsilon){
            return util.randomChoice(this.agent.actions)            
        }else{
            var max_index_list = util.argMax(values, {all:true})
            var index = util.randomChoice(max_index_list)
            return this.agent.actions[index]
        }
    }

    getStateValue(state){
        var qValues = this.getValueForState(state)
        return Math.max(...qValues)
    }

    getStateValueMap(){
        let valueMap = []
        for(var i=0 ; i<this.agent.states.length; i++){
            valueMap.push(this.getStateValue(this.agent.states[i]))
        }
        return valueMap
    }
}

class SoftMaxPolicy extends Policy{
    constructor(agent, epsilon = 0.03, qw = 1, ew = 0.01, bw = 0.01, tw = 0.000){
        super(agent, epsilon, qw, ew, bw, tw)
    }

        choose_action(state){
            var values = this.getValueForState(state)
            for(var i=0 ; i<values.length ; i++){
                values[i] = Math.exp(values[i])
            }
            var sum = util.sum(values)
            values = util.vConstMul(values, 1/sum)
            return this.agent.actions[util.argProbability(values)]
        }
}


class WeightPolicy extends Policy{
    constructor(agent, epsilon = 0.03, qw = 1, ew = 0.01, bw = 0.01, tw = 0.000){
        super(agent, epsilon, qw, ew, bw, tw)
    }

        choose_action(state){
            var qValue = this.getQValueForState(state)
            var eValue = this.getEValueForState(state)
            var bValue = this.getBValueForState(state)
            var tValue = this.getTValueForState(state)
            qValue = util.vConstMul(qValue, this.qw)
            eValue = util.vConstMul(eValue, this.ew)
            bValue = util.vConstMul(bValue, this.bw)
            tValue = util.vConstMul(tValue, this.tw)

            eValue = util.vAdd(util.vAdd(eValue, bValue), tValue)
            var values = (Math.max(...eValue) < Math.max(...qValue)) ? qValue : eValue
            
            var max_index_list = util.argMax(values, {all:true})
            var index = util.randomChoice(max_index_list)
            return this.agent.actions[index]

        }
}


class ActionValueTable{
    constructor(states, actions, default_value = 0, step_size = 0.1, gamma = 0.99){
        this.states = states
        this.actions = actions
        this.default_value = default_value
        this.step_size = step_size
        this.gamma = gamma
        this.value_table = util.ndarray([states.length, actions.length], this.default_value)

        
    }

    update(state, action, reward, next_state, finished){
        // console.log(state, action, reward, next_state, finished)
        var next_return = (finished) ? 0 : this.gamma*Math.max(...this.value_table[next_state])
        var cur_return = reward + next_return
        var cur_value = this.value_table[state][action]
        var delta = cur_return - cur_value
        this.value_table[state][action] += this.step_size*delta
    }
    getValueMap(){
        let valueMap = []
        for(var i=0 ; i<this.states.length; i++){
            var qValues  = this.value_table[this.states[i]]
            var maxQValues = Math.max(...qValues)
            valueMap.push(Math.floor(maxQValues*100)/100)
        }
        return valueMap
    }

    get_values_for_state(state){
        return this.value_table[state]
    }

}
class ActionRewardModel{

    constructor(states, actions, mean, variance, update_ratio, no_variance = false){
        this.max_size = 10000
        this.samples = []
        this.reward_model_table = util.ndarray([states.length, actions.length], 0)
        for(var state=0 ; state<states.length ; state++){
            for(var action=0 ; action<actions.length ; action++){
                this.reward_model_table[state][action] = new GausianModel(mean, variance, update_ratio, no_variance)
            }
        }
    }

    reset(state, action){
        for(var i=samples.length-1 ; i>=0 ; i--){
            var _state, _action, next_state, finished
            [_state, _action, next_state, finished] = samples[i]
            if(state == _state){
                delete samples[i]
            }
            else if(state == _state && action == _action){
                delete samples[i]
            }
            // this.reward_model_table[state][action].mean = 0
            // this.reward_model_table[state][action].variance = 0
        }
    }

    update(state, action, reward, next_state, finished){
        this.reward_model_table[state][action].update(reward)
        if (this.max_size < this.samples.length){
            this.samples.shift()
        }
        this.samples.push([state, action, next_state, finished])
    }

    is_mutation(state, action, reward){
    `발생하기 어려운 케이스인가?`
        return this.reward_model_table[state][action].is_mutation(reward)
    }

    get_sample(){
        if(this.samples.length == 0){
            return null
        }
        var state, action, reward, next_state, finished
        [state, action, next_state, finished] = util.randomChoice(this.samples)
        reward = this.reward_model_table[state][action].get_value()
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

class RewardManager{
    constructor(states, actions, ...args){
        // value table
        this.default_value = 0
        this.value_update_ratio = 0.1
        this.discounting_factor = 0.99

        // reward model
        this.mean = 0
        this.variance = 0
        this.model_update_ratio = 0.1

        // planning
        this.planning_num = 100

        this.seg_arg(args[0])

        this.value_table = new ActionValueTable(states, actions, this.default_value, this.value_update_ratio, this.discounting_factor)
        this.reward_model = new ActionRewardModel(states, actions, this.mean, this.variance, this.model_update_ratio, {no_variance : false}) 
        
        this.after_action_value_update_callback = new Callback_2() // state, action
    }

    seg_arg(args){
        // value table
        this.default_value = (args.default_value != null)?args.default_value:this.default_value
        this.value_update_ratio = (args.value_update_ratio != null)?args.value_update_ratio:this.value_update_ratio
        this.discounting_factor = (args.discounting_factor != null)?args.discounting_factor:this.discounting_factor

        // reward model
        this.mean = (args.mean != null)?args.mean:this.mean
        this.variance = (args.variance != null)?args.variance:this.variance
        this.model_update_ratio = (args.model_update_ratio != null)?args.model_update_ratio:this.model_update_ratio

        // planning
        this.planning_num = (args.planning_num != null)?args.planning_num:this.planning_num

        console.log("args", args)

        console.log(args.default_value != null)
        console.log(args.value_update_ratio != null)
        console.log(args.discounting_factor != null)

        console.log(args.mean != null)
        console.log(args.variance != null)
        console.log(args.model_update_ratio != null)

        console.log(args.planning_num != null)

        console.log(this.default_value)
        console.log(this.value_update_ratio)
        console.log(this.discounting_factor)

        console.log(this.mean)
        console.log(this.variance)
        console.log(this.model_update_ratio)

        console.log(this.planning_num)
   
    }

    recaculate_reward(state, action, reward, next_state){
        `배정된 욕구에 대한 리워드를 다시 계한`
        return reward
    }

    update(state, action, reward, next_state){
        reward = this.recaculate_reward(state, action, reward, next_state)
        this.value_table.update(state, action, reward, next_state)
        this.reward_model.update(state, action, reward, next_state)
        this.after_action_value_update_callback.invoke(state, action)

    }

    planning(){
        for(var i=0 ; i<this.planning_num ; i++){
            
            var sample = this.reward_model.get_sample()
            if(sample == null) {
                break;
            }
            var state, action, reward, next_state, finished
            [state, action, reward, next_state, finished] = sample
            this.value_table.update(state, action, reward, next_state, finished)
            this.after_action_value_update_callback.invoke(state, action)            
        }
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

    is_mutation(state, action, reward){
        return this.reward_model.is_mutation(state, action, reward)
    }

}

class Agent{
    constructor(states, actions){

        // group & sharing option
        this.group = null        
        this.q_sharing = false
        this.e_sharing = false
        this.b_sharing = false

        this.tau_value_table_sharing = false
        
        this.policy_sharing = false
        this.reward_policy_sharing = false
        
    
        this.memory_sharing = false

        // policy 
        this.qw = 1
        this.ew = 1
        this.bw = 1
        this.tw = 0.0001

        // reward
        this.default_reward = -0.01
        this.curiosity_reward = 0.001
        this.repeat_penalty = -0.01

        this.epsilon = 0.01

        // basic element
        this.states = states
        this.actions = actions
        this.past_state = null
        this.past_action = null
        
        this.finished = true

        this._memory = new Memory(states, actions)

        this.policy = new Policy(this, this.epsilon, this.qw, this.ew, this.bw, this.tw)
        // this.policy = new SoftMaxPolicy(this, this.epsilon, this.qw, this.ew, this.bw, this.tw)
        
        var q_value_manager_args = {
            default_value : 0,
            value_update_ratio : 0.3,
            discounting_factor : 0.99,
            mean : 0,
            variance : 0,
            model_update_ratio : 0.5,
            planning_num : 100,
        }
        this._q_manager = new RewardManager(states, actions, q_value_manager_args)
        var e_value_manager_args = {
            default_value : 0,
            value_update_ratio : 0.9,
            discounting_factor : 0.9,
            mean : 0,
            variance : 0,
            model_update_ratio : 0.9,
            planning_num : 100,
        }
        this._e_manager = new RewardManager(states, actions, e_value_manager_args)

        var b_value_manager_args = {
            default_value : 0,
            value_update_ratio : 0.5,
            discounting_factor : 0.99,
            mean : 0,
            variance : 0,
            model_update_ratio : 0.1,
            planning_num : 100,
        }
        this._b_manager = new RewardManager(states, actions, b_value_manager_args)

        this.q_manager.after_action_value_update_callback.add((state, action) => this.after_action_value_update_callback.invoke(state, action))
        this.e_manager.after_action_value_update_callback.add((state, action) => this.after_action_value_update_callback.invoke(state, action))
        this.b_manager.after_action_value_update_callback.add((state, action) => this.after_action_value_update_callback.invoke(state, action))

        this.tau_value_table = new ActionTauTable(states, actions)

        this.after_action_value_update_callback = new Callback_2() // state, action

        this.after_step_callback = new Callback_0()
        this.goal_callback = new Callback_0()
        this.hall_callback = new Callback_0()
        this.first_state = new Callback_1()
        this.first_state_action = new Callback_2()
        
        this.total_step = 0

    }

    set_group(group){
        this.group = group
    }

    get_policy(){
        if(this.group != null && this.policy_sharing){
            return this.group.policy
        }else{
            return this.policy
        }
    }

    get_tau_value_table(){
        if(this.group != null && this.tau_value_table_sharing){
            return this.group.tau_value_table
        }else{
            return this.tau_value_table
        }
    }

    get q_manager() {
        return (this.group != null && this.q_sharing) ? this.group._q_manager : this._q_manager
    }

    get e_manager() {
        return (this.group != null && this.e_sharing) ? this.group._e_manager : this._e_manager
    }
    get b_manager(){
        return (this.group != null && this.b_sharing) ? this.group._b_manager : this._b_manager
    }

    get memory(){
        return (this.group != null && this.memory_sharing) ? this.group._memory : this._memory
    }
    
    start(state){
        this.finished = false
        this.past_state = state;
        this.past_action = this.policy.choose_action(state);
        return this.past_action;
    }

    step(reward, state, finished){
        if(finished == true){
            console.log("finished")
        }

        reward += this.default_reward
        var count = this.memory.state_action_count_table[this.past_state][this.past_action]
        
        if(3 < count){
            var e_reward = this.q_manager.is_mutation(this.past_state, this.past_action, reward)
            console.log("e_reward", e_reward)
            e_reward = Math.max(0, e_reward-0.1)
            if(e_reward < 0.01){
                e_reward = 0
            }else{
                this.q_manager.reset(this.past_state, this.past_action)
                this.e_manager.reset(this.past_state, this.past_action)
                this.b_manager.reset(this.past_state, this.past_action)
                console.log("삭제")
            }
            this.e_manager.update(this.past_state, this.past_action, e_reward, state, finished)
        }
        


        this.q_manager.update(this.past_state, this.past_action, reward, state, finished)

        var boring_reward = 0
        if(this.memory.count_state_action_and_check_first(this.past_state, this.past_action)){
            // boring_reward += this.curiosity_reward*(1 + this.memory.get_state_action_num(this.past_state, this.past_action)**(1/100))
            boring_reward += this.curiosity_reward
        }
        if(this.memory.count_state_and_check_first(state)){
               
        }   


        this.memory.count_state_action_and_check_first(state, action)
        boring_reward += this.repeat_penalty*(this.memory.get_state_action_num(this.past_state, this.past_action))**(1/2)

        
        this.b_manager.update(this.past_state, this.past_action, boring_reward, state, finished)

        // planning
        this.q_manager.planning()
        this.e_manager.planning()
        this.b_manager.planning()
        
        // select action
        var action = this.get_policy().choose_action(state)
        
        // memorize state, action
        this.past_state = state
        this.past_action = action

        // update tau
        this.get_tau_value_table().update(this.past_state, this.past_action)

        this.total_step += 1
        this.after_step_callback.invoke()
        // return action

        this.finished = finished
        return this.past_action
    }

}

class FrozenLake{
    constructor(map_size, frozen_ratio){
        this.map_size = map_size
        this.state_list = util.range(0, map_size*map_size)
        this.action_list = util.range(0, 4)
        
        this.frozen_ratio = frozen_ratio
        this.map = this.generateRandomMap(this.map_size, this.frozen_ratio)
    }

    get_type(state){
        var x, y
        [x, y] = this.state_to_coordinate(state)
        return this.map[y][x]
    }
    modify(state, type){
        if(!["H", "F"].includes(type)){
            console.log(`${type} is invalid state type`)
            return false
        }else{
            
            var x, y
            [x, y] = this.state_to_coordinate(state)
            
            var origin_type = this.map[y][x]
            this.map[y][x] = type

            if(this.isValid(this.map, this.map_size)){
                return true
            }else{
                this.map[y][x] = origin_type
                console.log(`${type} 적용시 유효한 길 없음`)
                return false
            }
        }
        
    }

    getMap(){
        return this.map
    }
    getRewardMap(){ 
        let rewardMap = util.ones([this.map_size, this.map_size])
        for(var y=0 ; y<this.map_size; y++){
            for(var x=0 ; x<this.map_size; x++){
                let state = this.coordinate_to_state(x, y)
                rewardMap[y][x] = this.reward(state)
            }    
        }
        return rewardMap
    }
    getStates(){
        return this.state_list
    }
    getActions(){
        return this.action_list
    }
    generateRandomMap(size = 10, p = 0.8){
        `Generates a random valid map (one that has a path from start to goal)

        Args:
            size: size of each side of the grid
            p: probability that a tile is frozen

        Returns:
            A random valid map
        `
        var valid = false
        var board = []

        while (! valid){
            board = util.ndarray([size, size], " ")
            for(var y=0 ; y<size ; y++){
                for(var x=0 ; x<size ; x++){
                    board[y][x] = (Math.random() < p) ? "F" : "H";
                }
            }
            board[0][0] = "S"

            board[size-1][size-1] = "G"
            valid = this.isValid(board, size)
        }
        return board
    }
    isValid(board, max_size){
        var frontier = []
        var discovered = new Set()

        frontier.push([0, 0])
        
        while (0 < frontier.length){
            
            var r, c
            [r, c] = frontier.pop()
            var pos = `${r},${c}`
            if (!discovered.has(pos)){
                discovered.add(pos)
                var directions = [[0, 1], [0, -1], [-1, 0], [1, 0]]
                for(var i =0 ; i<directions.length; i++){ 
                    var x, y
                    [x, y] = directions[i]
                    var r_new = r + x
                    var c_new = c + y
                    if ((r_new < 0) || (r_new >= max_size) || (c_new < 0) || (c_new >= max_size)){
                        continue
                    }else if (board[r_new][c_new] == "G"){
                        return true
                    }else if(board[r_new][c_new] != "H"){
                        frontier.push([r_new, c_new])
                    }
                }
            }
        }
        return false
    }
    
    step(state, action){
        var next_state = this.get_next_state(state, action)
        if(this.get_type(next_state) == "H"){
            next_state = 0
        }

        var reward = this.reward(next_state)
        var finished = this.is_done(next_state)
        return [next_state, reward, this.is_done(next_state)]
    }
    
    is_done(state){
        let x, y
        [x, y] = this.state_to_coordinate(state)
        return (this.map[y][x] == "G")
        // return (this.map[y][x] == "G") || (this.map[y][x] == "H")
    }
        
    
    get_next_state(state, action){
        `
            state에서 action을 수행했을 때의 다음 스테이트와 보상을 반환
        `
        let action_move = {0:[0, -1], 1:[0, 1], 2:[-1, 0], 3:[1, 0]}
        
        let x, y
        [x, y] = this.state_to_coordinate(state)
        let move = action_move[action]
        let next_x = x + move[0]
        let next_y = y + move[1]
        
        if (this.is_out(next_x, next_y)){
            return state
        }else{
            return this.coordinate_to_state(next_x, next_y)
        }
    }
        
    state_to_coordinate(state){
        let y = Math.floor( state / this.map_size)
        let x = state%this.map_size
        
        return [x, y]
    }
    
    coordinate_to_state(x, y){
        return this.map_size*y + x
    }
    
    is_out(x, y){
        return ! ((0 <= x && x < this.map_size) && (0 <= y && y < this.map_size))
    }
    
    reward(state){
        var state_reward = {"S": 0, "F":0, "H":0, "G":1}
        var x, y
        if (state == -1){
            return 0
        }
        [x, y] = this.state_to_coordinate(state)
        state = this.map[y][x]
        return state_reward[state]
    }

}



class Operator{
    constructor(map_size, agent_num, frozen_ratio){
        this.selected_cell = 0
        this.agent_num = agent_num
        this.body = document.body;
        this.map_size = map_size
        this.env = new FrozenLake(map_size, frozen_ratio)
        this.informationViewer = new InformationViewer();

        this.cellInforView = new CellInforView()
        // agentGroup
        this.agentGroup = new AgentGrupe(this.env.getStates(), this.env.getActions())
        this.agentGroup.goal_callback.add(() => this.informationViewer.goal += 1)
        this.agentGroup.hall_callback.add(() => this.informationViewer.hall += 1)
        this.agentGroup.after_step_callback.add(() => this.informationViewer.step += 1)
        this.agentGroup.first_state.add((state) => {this.informationViewer.state += 1
        })
        this.agentGroup.first_state_action.add((state, action) => this.informationViewer.state_action += 1)
        this.agentGroup.after_action_value_update_callback.add((state, action) => {
            var x, y
            [x, y] = this.env.state_to_coordinate(state)
            var state_value = this.agentGroup.agents[0].get_policy().getStateValue(state)
            var action_value = this.agentGroup.agents[0].get_policy().getValueForState(state)
            this.env_view.setValue(x, y,  Math.floor(state_value*100)/100)
            this.env_view.setArrows(x, y, action_value)
        })

        this.agents = []
        for(var i=0 ; i<this.agent_num ; i++){
            var agent = new Agent(this.env.getStates(), this.env.getActions())
            this.agents.push(agent)
            this.agentGroup.addAgent(agent)
        }        
        this.env_view = new FrozenLakeEnvViewer(map_size, map_size, 50);
        this.env_view.ctrl_click_callback.add((x, y) => {
            
            var state = this.env.coordinate_to_state(x, y)
            var type = this.env.get_type(state)
            type = (type == "H")? "F" : "H"
            var success = this.env.modify(state, type)
            if(success){
                // this.env_view.setStateMap(this.env.getMap())
                // this.env_view.setRewardMap(this.env.getRewardMap())
                this.env_view.setState(x, y, this.env.getMap()[y][x])
                this.env_view.setReward(x, y, this.env.getRewardMap()[y][x])
                // this.env_view.setValueMap(this.agentGroup.agents[0].policy.getStateValueMap())
            }
            // this.env_view.setArrowsMap(this.agentGroup)/
        })
        this.env_view.click_callback.add((x, y) => {this.selected_cell = this.env.coordinate_to_state(x, y)})
        this.env_view.setStateMap(this.env.getMap())
        // this.env_view.setValueMap(this.agentGroup.agents[0].policy.getStateValueMap())
        this.env_view.setRewardMap(this.env.getRewardMap())
        this.body.appendChild(this.env_view.getElement())
        this.body.appendChild(this.informationViewer.getElement())
        this.body.appendChild(this.cellInforView.getElement())
    }

    update_cell_view(state){
        this.cellInforView.q_value = this.agents[0].q_manager.get_values_for_state(state)
        this.cellInforView.q_mean = this.agents[0].q_manager.get_reward_means_for_state(state)
        this.cellInforView.q_std = this.agents[0].q_manager.get_reward_standard_deviations_for_state(state)

        this.cellInforView.e_value = this.agents[0].e_manager.get_values_for_state(state)
        this.cellInforView.e_mean = this.agents[0].e_manager.get_reward_means_for_state(state)
        this.cellInforView.e_std = this.agents[0].e_manager.get_reward_standard_deviations_for_state(state)

        this.cellInforView.b_value = this.agents[0].b_manager.get_values_for_state(state)
        this.cellInforView.b_mean = this.agents[0].b_manager.get_reward_means_for_state(state)
        this.cellInforView.b_std = this.agents[0].b_manager.get_reward_standard_deviations_for_state(state)

        this.cellInforView.tau = this.agents[0].tau_value_table.get_taus_for_state(state)
    }

    one_step(agent_idx){
        // agent 지우기 
        var agent = this.agents[agent_idx]
        if(agent.finished){
            this.initAgent(agent_idx)
            let x, y
            [x, y] = this.env.state_to_coordinate(agent.past_state)
            this.env_view.showAgent(x, y, agent_idx, true)
        }else{
            let x, y
            [x, y] = this.env.state_to_coordinate(agent.past_state)
            this.env_view.showAgent(x, y, agent_idx, false)
            
        
            // agent 액션 수행
            let state, reward, done
            [state, reward, done] = this.env.step(agent.past_state, agent.past_action)
            
            // agent 그리기
            let nx, ny
            [nx, ny] = this.env.state_to_coordinate(state)
            this.env_view.showAgent(nx, ny, agent_idx, true)
            
            // var valueMap = agent.getQValueMap()
            // for(var i=0 ; i<valueMap.length ; i++){
            //     let x, y
            //     [x, y] = this.env.state_to_coordinate(i)
            //     this.env_view.setValue(x, y, valueMap[i])
            // }
            // 끝난 경우
            if (done == true){
                if(state == this.map_size**2-1){
                    this.informationViewer.goal += 1
                }else{
                    this.informationViewer.hall += 1
                }
                agent.step(reward, state, true)
                return true
            }else{
                agent.step(reward, state, false)
                return false
            }
        }
        
    }

    async one_episode(agent_idx, freq){
        await setTimeout(() => {
            let end = this.one_step(agent_idx)
            if(end == false){
                this.one_episode(agent_idx, freq)
            }
        }, freq);
    }
    
    async one_episode2(agent_idx, freq){
        operator.initAgent(agent_idx)
        while(true){
            let end = this.one_step(agent_idx)
            await wait(freq)
            if(end == true){
                return
            }
        }
    }

    async n_episode(agent_idx, freq, n){
        for(var i=0 ; i<n ; i++){
            await this.one_episode2(agent_idx, freq)
        }
    }
    
    initAgent(agent_idx){
        let x, y
        [x, y] = this.env.state_to_coordinate(this.agents[agent_idx].past_state)
        this.env_view.showAgent(x, y, agent_idx, false)

        this.agents[agent_idx].start(0)
        this.env_view.showAgent(0, 0, agent_idx, true)
    }

    async all_agent_step(freq){
        while(true){
            // for(var i=0 ; i<this.agent_num ; i++){
            for(var i=0 ; i<this.agent_num ; i++){
                await this.one_step(i)
                this.update_cell_view(this.selected_cell)
                await wait(freq)
                // break
            }
            
        }
    }
    async do(){
        while(true){
            await this.n_episode(5, 0, 1)
            continue
            for(var i=0 ; i<this.agent_num ; i++){
                await this.n_episode(i, 1, 1)
            }
            
        }

    }
}

// async function test(){
//     console.log("hello")
//     await wait(1000)
//     console.log("hello2")
// }
// test()
// wait(1000).then(() => console.log("hello2"))




// async function test(){
//     operator.initAgent(0)
//     await operator.one_episode2(1)
//     operator.initAgent(0)
//     await operator.one_episode2(1)
// }
// await test()


// while(true){
//     operator.initAgent(0)
//     await operator.one_episode2(1)
// }

// while(true){
//     operator.initAgent(0)
//     await operator.one_episode(1)
// }
class Slider{
    constructor(name="name", value = 0){
        [this.element, this._name, this._value, this.slider] = this.createElement()
        this.OnInputCallback = new Callback_1()
        this.OnInputCallback.add((a) => console.log(a.value)) 
        this.name = name
        this.value = value
    }
    getElement(){
        return this.element
    }
    createElement(name){
        var element = document.createElement("div");
        element.innerHTML = `
        <div><span></span>:<span></span></div>
        <div><input type="range" name="points" min="0" max="1.0" step="0.01" value="0"></div>
        `
        var name = element.getElementsByTagName("span")[0]
        var value = element.getElementsByTagName("span")[1]

        var slider = element.getElementsByTagName("input")[0]
        
        slider.oninput = () => {value.innerHTML=slider.value}
        slider.onchange = (value) => this.OnInputCallback.invoke(value)
        return [element, name, value, slider]
    }
    get name(){
        return this._name.innerHTML
    }
    set name(value){
        this._name.innerHTML = value
    }

    get value(){
        return this._value.innerHTML
    }
    set value(v){
        this._value.innerHTML = v
    }
}
// slider = new Slider()
// document.body.appendChild(slider.getElement())

// class ControlView{
//     constructor(){
//         this.element = this.createElement()
//         this.element
//     }

//     getElement(){
//         return this.element
//     }
//     createElement(){
        
//         var element = document.createElement("div");
//         element.className = "controlView"
//         this.element.innerHTML = `
            
        
//     `
//     }
// }

class InformationViewer{
    constructor(){
        
        this.element = this.createElement()

        this._goal = 0
        this._hall = 0
        this._step = 0
        this._state = 0
        this._state_action = 0
        this.update()
    }

    getElement(){
        return this.element
    }

    get step(){return this._step}
    set step(value){
        this._step = value
        this.update()
    }
    
    get hall(){return this._hall}
    set hall(value){
        this._hall = value
        this.update()
    }

    get goal(){return this._goal}
    set goal(value){
        this._goal = value
        this.update()
        if(value == 1){
            console.log(`first goal in step ${this.step}`)
        }
    }

    get state(){return this._state}
    set state(value){
        this._state = value
        this.update()
    }

    get state_action(){return this._state_action}
    set state_action(value){
        this._state_action = value
        this.update()
    }

    update(){
        this.element.innerHTML = `
        <div>Step: ${this.step}</div>
        <div>Goal: ${this.goal}</div>
        <div>Hall: ${this.hall}</div>
        <div>State: ${this.state}</div>
        <div>State-Action: ${this.state_action}</div>
    `
    }

    createElement(){
        var element = document.createElement("div");
        return element}
}



var operator
document.getElementById("initialize_button").addEventListener('click',() => {
    if(operator != null){
        operator.env_view.element.remove()
        operator.informationViewer.element.remove()
    }
    operator = new Operator(5, 1, 0.9)
})


document.getElementById("continue_button").addEventListener('click',() => {
    operator.all_agent_step(0.0001)
})

document.getElementById("one_episode_button").addEventListener('click',() => {operator.initAgent(0)
    operator.one_episode(1000)});


class CellInforView{
    constructor(){
        this.element = this.createElement()

        this._q_value = [0, 0, 0, 0]
        this._q_mean = [0, 0, 0, 0]
        this._q_std = [0, 0, 0, 0]

        this._e_value = [0, 0, 0, 0]
        this._e_mean = [0, 0, 0, 0]
        this._e_std = [0, 0, 0, 0]

        this._b_value = [0, 0, 0, 0]
        this._b_mean = [0, 0, 0, 0]
        this._b_std = [0, 0, 0, 0]

        this._tau = [0, 0, 0, 0]

        this.update()
    }
    
    getElement(){
        return this.element
    }
    createElement(){
        var element = document.createElement("div");
        return element
    }

    get q_value(){return this._q_value}
    set q_value(value){
        this._q_value = value
        this.update()
    }

    get q_mean(){return this._q_mean}
    set q_mean(value){
        this._q_mean = value
        this.update()
    }

    get q_std(){return this._q_std}
    set q_std(value){
        this._q_std = value
        this.update()
    }
    
    get e_value(){return this._e_value}
    set e_value(value){
        this._e_value = value
        this.update()
    }

    get e_mean(){return this._e_mean}
    set e_mean(value){
        this._e_mean = value
        this.update()
    }

    get e_std(){return this._e_std}
    set e_std(value){
        this._e_std = value
        this.update()
    }
    get b_value(){return this._b_value}
    set b_value(value){
        this._b_value = value
        this.update()
    }

    get b_mean(){return this._b_mean}
    set b_mean(value){
        this._b_mean = value
        this.update()
    }

    get b_std(){return this._b_std}
    set b_std(value){
        this._b_std = value
        this.update()
    }
    get tau(){return this._tau}
    set tau(value){
        this._tau = value
        this.update()
    }

    update(){
        this.element.innerHTML = ""
        var labels = ["TOP", "BOTTOM", "LEFT", "RIGHT"]
        for(var i=0 ; i<4 ; i++){
            this.element.innerHTML += `
            <div style="display: inline-block; border_color:black;">
                <div>${labels[i]}</div>
                <div>Q_value: ${Math.floor(this.q_value[i]*100)/100}</div>
                <div>Q_mean: ${Math.floor(this.q_mean[i]*100)/100}</div>
                <div>Q_std: ${Math.floor(this.q_std[i]*100)/100}</div>

                <div>E_value: ${Math.floor(this.e_value[i]*100)/100}</div>
                <div>E_mean: ${Math.floor(this.e_mean[i]*100)/100}</div>
                <div>E_std: ${Math.floor(this.e_std[i]*100)/100}</div>

                <div>B_value: ${Math.floor(this.b_value[i]*100)/100}</div>
                <div>B_mean: ${Math.floor(this.b_mean[i]*100)/100}</div>
                <div>B_std: ${Math.floor(this.b_std[i]*100)/100}</div>

                <div>Tau: ${this.tau[i]}</div>
            </div>
        `
        }
        
    }
}