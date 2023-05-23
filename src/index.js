// import {FrozenLakeEnvViewer, CellAgentViewer, GridCellViewer} from "./MLView.js"
// import {FrozenLake, Agent} from "./ML.js"

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
class util{
    array_functions = []
    static argMax(array) {
        return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
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
        for(var i=0 ; i<v.length; i++){
            v[i] += c
        }
        return v
    }
    static vConstMul(v, c){
        for(var i=0 ; i<v.length; i++){
            v[i] *= c
        }
        return v
    }
    static vSquare(v, x){
        for(var i=0 ; i<v.length; i++){
            v[i] **= x
        }
        return v
    }

}




var label = ["open", "start", "hall", "wall", "goal"]
class CellAgentViewer{
    constructor(){
        this.element = this.createElement()
        this.setType("explorer");
    }
    createElement(){
        var element = document.createElement("div");
        element.className = "agent";
        return element
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
        this.element.style.visibility = flag? "":"hidden"
    }
}
class GridCellViewer{


    constructor(){
        [this.element, this.agents] = this.createNode()
        this.setState("open")
        this.showAllAgent(false)
    }

    createNode(){
        var element = document.createElement("div");
        element.className = "grid_cell"
        element.innerHTML = `   <div class = "inner_item">
                                    <div class="value">0.0</div>
                                    <div class="reward">r=0.0</div>
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
            }
        }
        return [element, agents];
    }
    setValue(value){
        this.element.getElementsByClassName("value")[0].innerHTML = `${value}`
        if(this.type == "F"){
            this.element.style.backgroundColor = [255, 1, 1];
        }
    }
    setReward(reward){
        this.element.getElementsByClassName("reward")[0].innerHTML = `r=${reward}`
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
    showAllAgent(flag){
        this.agents.forEach((agent) => agent.show(flag));
    }
    showAgent(idx, flag){
        this.agents[idx].show(flag);
    }
}


class FrozenLakeEnvViewer{
    constructor(width, height, cellSize){
        this.width = width;
        this.height = height;

        [this.element, this.cellMap] = this.createElement(width, height)

        this.resizeCell(cellSize)
         
    }

    resizeCell(size){
        this.element.style.gridTemplateColumns = `${size}px `.repeat(this.width);
        this.element.style.gridTemplateRows = `${size}px `.repeat(this.height);
    }
    getElement(){
        return this.element;
    }

    createElement(width, height){
        var element = document.createElement("div");
        element.className = "grid_map"

        var map = Array.from(Array(height), () => new Array(width))
        for (var y=0 ; y<height ; y++){
            for (var x=0 ; x<width ; x++){
                var gridCell = new GridCellViewer()
                element.appendChild(gridCell.getElement())     
                map[y][x] = gridCell;
            }    
        }
        return [element, map]; 
    }
    applyMap(map){
        for (var y=0 ; y<this.height ; y++){
            for (var x=0 ; x<this.width ; x++){
                this.cellMap[y][x].setState(map[y][x]);
            }    
        }
    }
    showAgent(x, y, agent_idx, flag){
        this.cellMap[y][x].showAgent(agent_idx, flag)
    }
    setValue(x, y, value){
        this.cellMap[y][x].setValue(value)
    }
    setReward(x, y, reward){
        this.cellMap[y][x].setReward(reward)
    }
    setRewardMap(rewardMap){
        for (var y=0 ; y<this.height ; y++){
            for (var x=0 ; x<this.width ; x++){
                this.cellMap[y][x].setReward(rewardMap[y][x])
            }    
        }
    }
}

class Agent{
    static tau = []
    static share_model = []
    // static share_q_values = {}
    constructor(states, actions, epsilon = 0.1, step_size = 0.1, gamma = 0.95, kappa = 0.001){
        this.states = states
        this.actions = actions
        this.epsilon = epsilon
        this.step_size = step_size
        this.gamma = gamma
        this.q_values = util.zeros([states.length, actions.length])
        this.past_state = null
        this.past_action = null
        this.kappa = kappa
        this.tau = util.zeros([states.length, actions.length])
        this.use_curiosity = true
        this.visit_state = []
        this.curiosity_reward = 0.01
        this.group = null
        this.model = []

        // if(this.null != null){

        //     if(! (this.group in Agent.share_q_values)){
        //         Agent.share_q_values[this.group] = util.zeros([states.length, actions.length])
        //     }
        // }
    }
    report(state, action, reward, next_state){
        share_model.push([state, action, reward, next_state])

    }

    getQValueForState(state){
        // return this.q_values[state]

        var tau = [...this.tau[state]]
        tau = util.vSquare(tau, 0.5)
        tau = util.vConstMul(tau, this.kappa)
        return util.vAdd(this.q_values[state], tau)
    }
    getValueMap(){
        let valueMap = []
        for(var i=0 ; i<this.states.length; i++){
            // var qValues = this.q_values[this.states[i]]
            var qValues  = this.getQValueForState(this.states[i])
            var maxQValues = Math.max(...qValues)
            valueMap.push(Math.floor(maxQValues*100)/100)
        }
        return valueMap
    }
    choose_action(state, mode = "weight"){
        if (Math.random() < this.epsilon){
            console.log("epsilon")
            return util.randomChoice(this.actions)
        }else{
            switch(mode){
            case "gridy":
                var values = this.getQValueForState(state)
                console.log("values: ", values)
                var max_value = Math.max(...values)
                var max_index_list = []
                for(var i=0 ; i<values.length ; i++){
                    if (values[i] == max_value){
                        max_index_list.push(i)
                    } 
                }
                var index = util.randomChoice(max_index_list)
                return this.actions[index]
            case "weight":
                var values = this.getQValueForState(state)
                var min_value = Math.min(...values)
                values = util.vConstAdd(values, min_value)

                
                var sum = values.reduce((a, b) => a+b, 0)
                if(sum == 0){
                    return util.randomChoice(this.actions)
                }
                values = util.vConstMul(values, 1/sum)
                var p = Math.random()
                console.log(state, values)
                for(var i=0 ; i<values.length ; i++){
                    if(p < values[i]){
                        return this.actions[i]
                    }else{
                        p -= values[i]
                    }
                }
                console.log("선택 못함")
                return 0
            }

        }
    }


    
    start(state){
        this.past_state = state;
        this.past_action = this.choose_action(state);
        return this.past_action;
    }
    
    step(state, reward){
        this.update_model(this.past_state, this.past_action, reward, state)
        this.planning(100)

        if(this.use_curiosity){
            var query = `${state}, ${this.past_action}`
            if(! (query in this.visit_state)){
                reward += this.curiosity_reward
                this.visit_state.push(query)
            }
        }

        // update value
        this.update_q(this.past_state, this.past_action, reward, state)

        // select action
        var action = this.choose_action(state)



        // memorize state, action
        this.past_state = state
        this.past_action = action

        // update tau
        this.updateTau(this.past_state, this.past_action)

        // return action
        return this.past_action
    }

    updateTau(state, action){
        for(var i=0 ; i<this.tau.length ; i++){
            this.tau[i] = util.vAdd(this.tau[i], util.ones([this.tau[i].length]))
        }
        this.tau[state][action] = 0
    }
    
    update_q(state, action, reward, next_state){
        var next_return = (next_state == -1) ? 0 : this.gamma*Math.max(...this.q_values[next_state])
        var cur_return = reward + next_return
        var cur_value = this.q_values[state][action]
        var delta = cur_return - cur_value
        this.q_values[state][action] += delta
    }

    end(reward, state){
        this.update_q(this.past_state, this.past_action, reward, state)
        this.past_state = state
        // this.updateTau(this.past_state, this.past_action)
    }

    update_model(state, action, reward, next_state){
        this.model.push([state, action, reward, next_state])
    }

    planning(step_num){
        for(var i=0 ; i<step_num ; i++){
            var state, action, reward, next_state
            [state, action, reward, next_state] = util.randomChoice(this.model)
            this.update_q(state, action, reward, next_state)
        }
        
    }
}

class FrozenLake{
    constructor(map_size){
        this.map_size = map_size
        this.state_list = util.range(0, map_size*map_size)
        this.action_list = util.range(0, 4)
        
        this.frozen_ratio = 0.9
        this.map = this.generateRandomMap(this.map_size, this.frozen_ratio)
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
        var reward = this.reward(next_state)
        return [next_state, reward, this.is_done(next_state)]
    }
    
    is_done(state){
        let x, y
        [x, y] = this.state_to_coordinate(state)
        return (this.map[y][x] == "G") || (this.map[y][x] == "H")
    }
        
    
    get_next_state(state, action){
        `
            state에서 action을 수행했을 때의 다음 스테이트와 보상을 반환
        `
        let action_move = {0:[-1, 0], 1:[0, 1], 2:[1, 0], 3:[0, -1]}
        
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
        var state_reward = {"S": 0, "F":0, "H":-1, "G":1}
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
    constructor(map_size){
        this.agent_num = 9
        this.body = document.body;
        this.map_size = map_size
        this.env = new FrozenLake(map_size)
        this.agents = []
        for(var i=0 ; i<this.agent_num ; i++){
            this.agents.push(new Agent(this.env.getStates(), this.env.getActions()))
        }        
        this.env_view = new FrozenLakeEnvViewer(map_size, map_size, 100);
        this.env_view.applyMap(this.env.getMap())
        this.env_view.setRewardMap(this.env.getRewardMap())
        this.body.appendChild(this.env_view.getElement())
    }

    one_step(agent_idx){
        // agent 지우기
        let x, y
        [x, y] = this.env.state_to_coordinate(this.agents[agent_idx].past_state)
        this.env_view.showAgent(x, y, agent_idx, false)
        
    
        // agent 액션 수행
        let state, reward, done
        [state, reward, done] = this.env.step(this.agents[agent_idx].past_state, this.agents[agent_idx].past_action)
    
        // agent 그리기
        let nx, ny
        [nx, ny] = this.env.state_to_coordinate(state)
        this.env_view.showAgent(nx, ny, agent_idx, true)
        
        
        var valueMap = this.agents[agent_idx].getValueMap()
        for(var i=0 ; i<valueMap.length ; i++){
            let x, y
            [x, y] = this.env.state_to_coordinate(i)
            this.env_view.setValue(x, y, valueMap[i])
        }

        // 끝난 경우
        if (done == true){
            this.agents[agent_idx].end(reward, state)
            return true
        }else{
            this.agents[agent_idx].step(state, reward)
            return false
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

let operator = new Operator(20)
operator.do()

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

document.getElementById("one_episode_button").addEventListener('click',() => {operator.initAgent(0)
    operator.one_episode(1000)});

