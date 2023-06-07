// import {FrozenLakeEnvViewerObject, CellAgentViewer, GridCellViewer} from "./MLView.js"
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
        this.onDoubleClickCallback = new Callback_2()
        
        this.element.addEventListener("click", (e) => {
            if(e.ctrlKey){
                this.ctrl_click_callback.invoke(this.x, this.y)
            }else{
                this.click_callback.invoke(this.x, this.y)
            }
        })
        this.element.ondblclick = () => this.onDoubleClickCallback.invoke(this.x, this.y)
            
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


class GridEnvironmentView{
    constructor(width, height, cellSize){
        this.selected_cell = null
        this.width = width;
        this.height = height;

        [this.element, this.cellMap] = this.createElement(width, height)

        this.resizeCell(cellSize)

        this.click_callback = new Callback_2()
        this.ctrl_click_callback = new Callback_2()
        this.onDoubleClickCallback = new Callback_2()

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
                gridCell.onDoubleClickCallback.add((x, y) => this.onDoubleClickCallback.invoke(x, y))
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

        // this.q_value_table = new ActionValueModel (states, actions, this.q_default_value, this.q_step_size, this.q_gamma)
        // this.q_value_model = new ActionRewardModel(states, actions, this.q_model_mean, this.q_model_variance, this.q_model_step_size)

        // this.e_value_table = new ActionValueModel (states, actions, this.e_default_value, this.e_step_size, this.e_gamma)
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
        return false
        var p_value = this.p_value(value)
        this.mean_p_value += 0.3*(p_value - this.mean_p_value)
        // console.log("mean_p_value", this.mean_p_value)
        // console.log("stable", this.stable)
        // console.log("value", value)
        // console.log("p_value", p_value)

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



class ActionValueModel{
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
                console.log("state, action", state, action)
                console.log(this.value_table[state][action])
                console.log(this.value_table[state][action].step_size)
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
        return new GausianModel(this.mean, this.variance, this.step_size, false)
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
class ActionRewardModel{

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
        return new GausianModel(this.mean, this.variance, this.step_size, true)
    }
    reset(state, action, next_state){
        for(var a=0 ; a<this.actions.length ; a++){
            this.reward_model_table[state][a] = this.create_gausian_model()
        }

        // for(var action=0 ; action<actions.length ; action++){
        //     this.reward_model_table[next_state][action] = new GausianModel(this.mean, this.variance, this.update_ratio, this.no_variance)
        // }
        var new_samples = []
        for(var i=this.samples.length-1 ; i>=0 ; i--){
            var _state, _action, _next_state, finished
            [_state, _action, next_state, finished] = this.samples[i]
            if((state != _state || action != _action) && (state != _next_state)){
                new_samples.push(this.samples[i])
            }
            // this.reward_model_table[state][action].mean = 0
            // this.reward_model_table[state][action].variance = 0
        }
        console.log("Deleted", this.samples.length - new_samples.length)
        this.samples = new_samples
    }

    update(state, action, reward, next_state, finished){
        this.reward_model_table[state][action].update(reward)
        if (this.max_size < this.samples.length){
            this.samples.shift()
        }
        this.samples.push([state, action, next_state, finished])
    }

    p_value(state, action, reward){
        return this.reward_model_table[state][action].p_value(reward)
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

        this.value_table = new ActionValueModel(states, actions, this.q_value_mean, this.q_value_variance, this.q_value_step_size, this.discounting_factor)
        this.reward_model = new ActionRewardModel(states, actions, this.reward_mean, this.reward_variance, this.reward_step_size, {no_variance : false}) 
        
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
            this.value_table.update(state, action, reward, next_state, finished)
            this.after_action_value_update_callback.invoke(state, action)            
        }
    }

    reset(state, action, next_state){
        this.value_table.reset(state, action, next_state)
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

class Policy{
    constructor(agent, epsilon = 0.03, kappa = 0.000){
        this.agent = agent
        this.epsilon = epsilon
        this.kappa = kappa // tau weight (kappa)
    }


    getTValueForState(state){
        var tau = this.agent.get_tau_value_table().value_table[state]
        tau = util.vSquare([...tau], 0.5)
        return tau
    }
    getQValueForState(state){
        return this.agent.q_manager.get_values_for_state(state)
    }
    getValueForState(state){
        var qValue = this.getQValueForState(state)
        var tValue = this.getTValueForState(state)
        tValue = util.vConstMul(tValue, this.kappa)
        return util.vAdd(qValue, tValue)
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

class Agent{
    constructor(states, actions){

        // group & sharing option
        this.group = null        
        this.q_sharing = false

        this.tau_value_table_sharing = false
        
        this.policy_sharing = false
        this.reward_policy_sharing = false
    
        this.memory_sharing = false

        // reward
        this.default_reward = -0.01
        this.curiosity_reward = 0.001
        this.repeat_penalty = -0.01

        // basic element
        this.states = states
        this.actions = actions
        this.past_state = null
        this.past_action = null
        
        this.finished = true

        this.use_oblivion = false



        this._memory = new Memory(states, actions)

        // Policy
        this._policy = new Policy(this)
        // this.policy = new SoftMaxPolicy(this, this.epsilon, this.kappa)
        this.epsilon = 0.01
        this.kappa = 0.00001

        
        var q_value_manager_args = {
            q_value_mean : 0,
            q_value_variance : 1,
            q_value_step_size : 0.3,

            discounting_factor : 0.99,
            reward_mean : 0,
            reward_variance : 0,
            reward_step_size : 0.5,
            planning_num : 100,
        }


        this._q_manager = new ValueManager(states, actions, q_value_manager_args)
        this._q_manager.after_action_value_update_callback.add((state, action) => this.after_action_value_update_callback.invoke(state, action))

        this.tau_value_table = new ActionTauTable(states, actions)

        this.after_action_value_update_callback = new Callback_2() // state, action

        this.after_step_callback = new Callback_0()
        this.goal_callback = new Callback_0()
        this.hall_callback = new Callback_0()
        this.first_state = new Callback_1()
        this.first_state_action = new Callback_2()
        
        this.total_step = 0

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
        this.q_manager.gamma = value
    }
    get gamma(){
        return this.q_manager.gamma
    }
    set step_size(value){
        this.q_manager.step_size = value
    }
    get step_size(){
        return this.q_manager.step_size
    }

    reset_all(){
        this.reset_all_value()    
        this.reset_all_model()
    }

    reset_all_value(){
        this.q_manager.reset_all_value()
    }

    reset_all_model(){
        this.q_manager.reset_all_model()
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
    get policy() {
        return (this.group != null && this.policy_sharing) ? this.group._policy : this._policy
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
        reward += this.default_reward
        var distribution_changed = this.q_manager.update(this.past_state, this.past_action, reward, state, finished)
        if(this.use_oblivion && distribution_changed == true){
            this.q_manager.reset(this.past_state, this.past_action, state)
        }

        this.memory.count_state_action_and_check_first(this.past_state, this.past_action)

        this.q_manager.planning()

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

    new_map(){
        this.map = this.generateRandomMap(this.map_size, this.frozen_ratio)
    }
}



class ReinforcementLearningDemo{
    constructor(map_size, agent_num, frozen_ratio){
        this.element = document.createElement("div");
        this.element.innerHTML = `
        <div class="buttons"></div>
        <hbox>
            <div class="env_view"></div>
            <div>
                <div class="sliders"></div>
                <div class="check_box_list"></div>
                <div class="information_view"></div>
            </div>        
        </hbox>

        `
        this.selected_cell = 0
        this.selected_agent_idx = 0
        this.agent_num = agent_num
        this.map_size = map_size
        
        this.speed = 100

        this.buttonListDom = new ButtonListObect(["New Map", "Reset Value", "Reset Model", "One Step", "One Episode", "Continue"])
        this.element.getElementsByClassName("buttons")[0].appendChild(this.buttonListDom.getElement())

        this.checkBoxListDom = new CheckBoxList(["Oblivion", "Test"])
        this.element.getElementsByClassName("check_box_list")[0].appendChild(this.checkBoxListDom.getElement())

        this.grid_env_view = new GridEnvironmentView(map_size, map_size, 50);
        this.element.getElementsByClassName("env_view")[0].appendChild(this.grid_env_view.getElement())

        this.sliderListDom = new SliderListObject(["Speed", "Epsilon", "Kappa", "Gamma", "Step Size"])
        this.element.getElementsByClassName("sliders")[0].appendChild(this.sliderListDom.getElement())
        
        this.informationViewer = new InformationViewer();
        this.element.getElementsByClassName("information_view")[0].appendChild(this.informationViewer.getElement())
        
        this.cell_infor_view = new CellInforViewerObject()
        this.element.appendChild(this.cell_infor_view.getElement())

        this.env = new FrozenLake(map_size, frozen_ratio)

        // agentGroup
        this.agentGroup = new AgentGrupe(this.env.getStates(), this.env.getActions())

        this.agentGroup.goal_callback.add(() => this.informationViewer.goal += 1)
        this.agentGroup.hall_callback.add(() => this.informationViewer.hall += 1)
        this.agentGroup.after_step_callback.add(() => this.informationViewer.step += 1)
        this.agentGroup.first_state.add((state) => {this.informationViewer.state += 1})
        this.agentGroup.first_state_action.add((state, action) => this.informationViewer.state_action += 1)
        this.agentGroup.after_action_value_update_callback.add((state, action) => {
            this.update_grid_env_view_cell_value(state)
        })

        this.agents = []
        for(var i=0 ; i<this.agent_num ; i++){
            var agent = new Agent(this.env.getStates(), this.env.getActions())
            this.agents.push(agent)
            this.agentGroup.addAgent(agent)
        }     
        

        this.buttonListDom.objects["New Map"].OnClickCallback.add(() => {
            this.env.new_map()
            this.grid_env_view.setStateMap(this.env.getMap())
        })
        this.buttonListDom.objects["Reset Value"].OnClickCallback.add(() => {
            this.get_selected_agent().reset_all_value()
            this.update_grid_env_view_call_value_all()
        })


        this.buttonListDom.objects["Reset Model"].OnClickCallback.add(() => {this.get_selected_agent().reset_all_model()})
        this.buttonListDom.objects["One Step"].OnClickCallback.add(() => {this.all_agent_one_step()})
        this.buttonListDom.objects["One Episode"].OnClickCallback.add(() => {this.all_agent_one_episode()})
        this.buttonListDom.objects["Continue"].OnClickCallback.add(() => {this.all_agent_infinite_step()})

        this.sliderListDom.objects["Speed"].OnInputCallback.add((value) => this.speed = (1000**(1-value)))
        this.sliderListDom.objects["Epsilon"].OnInputCallback.add((value) => this.get_selected_agent().epsilon = value)
        this.sliderListDom.objects["Kappa"].OnInputCallback.add((value) => this.get_selected_agent().kappa = value*0.001)
        this.sliderListDom.objects["Gamma"].OnInputCallback.add((value) => this.get_selected_agent().gamma = value)
        this.sliderListDom.objects["Step Size"].OnInputCallback.add((value) => this.get_selected_agent().step_size = value)
        
        this.checkBoxListDom.objects["Oblivion"].onChangedCallBack.add((checked) => this.get_selected_agent().use_oblivion = checked)
        this.checkBoxListDom.objects["Test"].onChangedCallBack.add((checked) => console.log(checked))


        this.grid_env_view.ctrl_click_callback.add((x, y) => this.change_map_cell(x, y))
        this.grid_env_view.onDoubleClickCallback.add((x, y) => this.change_map_cell(x, y))
        this.grid_env_view.click_callback.add((x, y) => {this.selected_cell = this.env.coordinate_to_state(x, y)})
        this.grid_env_view.setStateMap(this.env.getMap())
        // this.env_view.setValueMap(this.agentGroup.agents[0].policy.getStateValueMap())
        this.grid_env_view.setRewardMap(this.env.getRewardMap())



    }
    change_map_cell(x, y){
        var state = this.env.coordinate_to_state(x, y)
        var type = this.env.get_type(state)
        type = (type == "H")? "F" : "H"
        var success = this.env.modify(state, type)
        if(success){
            this.grid_env_view.setState(x, y, this.env.getMap()[y][x])
            this.grid_env_view.setReward(x, y, this.env.getRewardMap()[y][x])
        }
        // this.env_view.setArrowsMap(this.agentGroup)/
    }
    
    update_grid_env_view_cell_value(state){
        var x, y
        [x, y] = this.env.state_to_coordinate(state)
        var state_value = this.agentGroup.agents[0].get_policy().getStateValue(state)
        var action_value = this.agentGroup.agents[0].get_policy().getValueForState(state)
        this.grid_env_view.setValue(x, y,  Math.floor(state_value*100)/100)
        this.grid_env_view.setArrows(x, y, action_value)
    }
    update_grid_env_view_call_value_all(){
        for(var state of this.env.state_list){
            this.update_grid_env_view_cell_value(state)
        }
    }

    getElement(){
        return this.element
    }

    get_selected_agent(){
        return this.agents[this.selected_agent_idx]
    }


    update_cell_view(state){
        this.cell_infor_view.q_value = this.agents[0].q_manager.get_values_for_state(state)
        this.cell_infor_view.q_mean = this.agents[0].q_manager.get_reward_means_for_state(state)
        this.cell_infor_view.q_std = this.agents[0].q_manager.get_reward_standard_deviations_for_state(state)
        this.cell_infor_view.tau = this.agents[0].tau_value_table.get_taus_for_state(state)
    }

    one_step(agent_idx){
        // agent 지우기 
        var agent = this.agents[agent_idx]
        if(agent.finished){
            this.initAgent(agent_idx)
            let x, y
            [x, y] = this.env.state_to_coordinate(agent.past_state)
            this.grid_env_view.showAgent(x, y, agent_idx, true)
        }else{
            let x, y
            [x, y] = this.env.state_to_coordinate(agent.past_state)
            this.grid_env_view.showAgent(x, y, agent_idx, false)
            
        
            // agent 액션 수행
            let state, reward, done
            [state, reward, done] = this.env.step(agent.past_state, agent.past_action)
            
            // agent 그리기
            let nx, ny
            [nx, ny] = this.env.state_to_coordinate(state)
            this.grid_env_view.showAgent(nx, ny, agent_idx, true)
            

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

    async one_episode(agent_idx){
        this.initAgent(agent_idx)
        
        while(true){
            var end = this.one_step(agent_idx)
            if(end){
                break;
            }
            await wait(this.speed)
        }
    }
    
    initAgent(agent_idx){
        let x, y
        [x, y] = this.env.state_to_coordinate(this.agents[agent_idx].past_state)
        this.grid_env_view.showAgent(x, y, agent_idx, false)

        this.agents[agent_idx].start(0)
        this.grid_env_view.showAgent(0, 0, agent_idx, true)
    }

    async all_agent_one_step(){
        for(var i=0 ; i<this.agent_num ; i++){
            await this.one_step(i)
            this.update_cell_view(this.selected_cell)
            await wait(this.speed)
        }
    }
    async all_agent_one_episode(){
        while(true){
            await this.all_agent_one_step()
        }
    }
    async all_agent_infinite_step(){
        while(true){
            await this.all_agent_one_step()
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

class ButtonListObect{
    constructor(names){
        this.element = this.createElement()
        this.objects = {}
        for(var name of names){
            this.objects[name] =  new ButtonObject(name)
            this.element.appendChild(this.objects[name].getElement())   
        }
    }
    createElement(){
        return document.createElement("div");
    }
    getElement(){
        return this.element
    }
}

class ButtonObject{
    constructor(name){
        this.element = this.createElement()
        this.element.innerHTML = name

        this.OnClickCallback = new Callback_0()
        this.element.onclick = () => {this.OnClickCallback.invoke()}
    }
    getElement(){
        return this.element
    }
    createElement(){
        var element = document.createElement("button");
        element.className="btn btn-outline-dark"
        return element
    }
}

class SliderListObject{
    constructor(names){
        this.element = this.createElement()
        this.objects = {}
        for(var name of names){
            this.objects[name] =  new SliderObject(name)
            this.element.appendChild(this.objects[name].getElement())   
        }
    }

    createElement(){
        return document.createElement("div");
    }
    getElement(){
        return this.element
    }
}
class SliderObject{
    constructor(name="name", value = 0){
        [this.element, this._name, this._value, this.slider] = this.createElement()
        this.OnInputCallback = new Callback_1() 
        this.name = name
        this.value = value
        this.OnInputCallback.add((value) => this.value=value)
        this.slider.value = value
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
        
        slider.oninput = () => {this.OnInputCallback.invoke(slider.value)}
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

class CellInforViewerObject{
    constructor(){
        this.element = this.createElement()

        this._q_value = [0, 0, 0, 0]
        this._q_mean = [0, 0, 0, 0]
        this._q_std = [0, 0, 0, 0]

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

                <div>Tau: ${this.tau[i]}</div>
            </div>
        `
        }
        
    }
}


class CheckBoxList{
    constructor(names){
        this.element = this.createElement()
        this.objects = {}
        for(var name of names){
            this.objects[name] =  new CheckBox(name)
            this.element.appendChild(this.objects[name].getElement())   
        }
    }

    createElement(){
        return document.createElement("div");
    }
    getElement(){
        return this.element
    }
}

class CheckBox{
    constructor(name="name"){
        this.element = document.createElement("div");
        this.element.innerHTML = `
            <label><input type="checkbox" name="color" value="blue"> ${name}</label>
        `
        this.checkBox = this.element.getElementsByTagName("input")[0]
        
        this.onChangedCallBack = new Callback_1()
        this.checkBox.onchange = (event) => this.onChangedCallBack.invoke(event.currentTarget.checked)
    }

    getElement(){
        return this.element
    }
}


    

operator = new ReinforcementLearningDemo(10, 1, 0.7)
document.body.appendChild(operator.getElement())


