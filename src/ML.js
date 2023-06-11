// import {util} from "./utils.js"

// export class Agent{
//     static tau = []
//     constructor(states, actions, epsilon = 0.15, step_size = 0.1, gamma = 0.95, kappa = 0.1){
//         this.states = states
//         this.actions = actions
//         this.epsilon = epsilon
//         this.step_size = step_size
//         this.gamma = gamma
//         this.q_values = util.zeros([states.length, actions.length])
//         this.past_state = null
//         this.past_action = null
//         this.kappa = kappa
//         this.tau = util.zeros([states.length, actions.length])
//     }

//     choose_action(state){
//         if (Math.random() < this.epsilon){
//             return util.randomChoice(this.actions)
//         }else{
//             var tau = this.tau[state]
//             tau = util.vSquare(tau, 0.5)
//             tau = util.vConstMul(tau, this.kappa)
//             var values = util.vAdd(this.q_values[state], tau)
//             var index = util.argMax(values)
//             return this.actions[index]
//         }
//     }
    
//     start(state){
//         this.past_state = state;
//         this.past_action = this.choose_action(state);
//         return this.past_action;
//     }
    
//     step(state, reward){
//         // update value
//         this.update_q(this.past_state, this.past_action, state, reward)

//         // select action
//         var action = this.choose_action(state)

//         // memorize state, action
//         this.past_state = state
//         this.past_action = action

//         // update tau
//         this.updateTau(this.past_state, this.past_action)

//         // return action
//         return this.past_action
//     }

//     updateTau(state, action){
//         for(var i=0 ; i<this.tau.length ; i++){
//             this.tau[i] = util.vAdd(this.tau[i], util.ones([this.tau.length]))
//         }
//         this.tau[state][action] = 0
//     }
    
//     update_q(state, action, reward, next_state){
//         var next_return = (next_state == -1) ? 0 : this.gamma*Math.max(this.q_values[next_state])
//         var cur_return = reward + next_return
//         var cur_value = this.q_values[state][action]
//         var delta = cur_return - cur_value
//         this.q_values[state][action] += delta
//     }

//     end(reward){
//         this.update_q(this.past_state, this.past_action, reward, -1)

//         this.past_state = -1
//         this.past_action = -1

//         // this.updateTau(this.past_state, this.past_action)
//     }
// }

// export class FrozenLake{
//     constructor(map_size){
//         this.map_size = map_size
//         this.state_list = util.range(0, map_size*map_size)
//         this.action_list = util.range(0, 4)
//         this.map = this.generateRandomMap(map_size)
//     }

//     getMap(){
//         return this.map
//     }
//     getStates(){
//         return this.state_list
//     }
//     getActions(){
//         return this.action_list
//     }
//     generateRandomMap(size = 10, p = 0.8){
//         `Generates a random valid map (one that has a path from start to goal)

//         Args:
//             size: size of each side of the grid
//             p: probability that a tile is frozen

//         Returns:
//             A random valid map
//         `
//         var valid = false
//         var board = []

//         while (! valid){
//             board = util.ndarray([size, size], " ")
//             for(var y=0 ; y<size ; y++){
//                 for(var x=0 ; x<size ; x++){
//                     board[y][x] = (Math.random() < p) ? "F" : "H";
//                 }
//             }
//             board[0][0] = "S"

//             board[size-1][size-1] = "G"
//             valid = this.isValid(board, size)
//         }
//         return board
//     }
//     isValid(board, max_size){
//         var frontier = []
//         var discovered = new Set()

//         frontier.push([0, 0])
        
//         while (0 < frontier.length){
            
//             var r, c
//             [r, c] = frontier.pop()
//             var pos = `${r},${c}`
//             if (!discovered.has(pos)){
//                 discovered.add(pos)
//                 // console.log(discovered)
//                 var directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]
//                 for(var i =0 ; i<directions.length; i++){ 
//                     var x, y
//                     [x, y] = directions[i]
//                     var r_new = r + x
//                     var c_new = c + y
//                     if ((r_new < 0) || (r_new >= max_size) || (c_new < 0) || (c_new >= max_size)){
//                         continue
//                     }else if (board[r_new][c_new] == "G"){
//                         return true
//                     }else if(board[r_new][c_new] != "H"){
//                         frontier.push([r_new, c_new])
//                     }
//                 }
//             }
//         }
//         return false
//     }
    
//     step(state, action){
//         var next_state = this.get_next_state(state, action)
//         var reward = this.reward(next_state)
//         return [next_state, reward, this.is_done(next_state)]
//     }
    
//     is_done(state){
//         return state == this.map_size * this.map_size -1
//     }
        
    
//     get_next_state(state, action){
//         `
//             state에서 action을 수행했을 때의 다음 스테이트와 보상을 반환
//         `
//         var action_move = {0:[-1, 0], 1:[0, 1], 2:[1, 0], 3:[0, -1]}
//         var x, y
//         [x, y] = this.state_to_coordinate(state)
//         var move = action_move[action]
//         var next_x = x + move[0]
//         var next_y = y + move[1]
        
//         if (this.is_out(next_x, next_y)){
//             return state
//         }else if(this.map[y][x] == "H"){
//             return 0
//         }else{
//             return this.coordinate_to_state(next_x, next_y)
//         }
//     }
        
//     state_to_coordinate(state){
//         var y = Math.floor( state / this.map_size)
//         var x = state%this.map_size
//         return [x, y]
//     }
    
//     coordinate_to_state(x, y){
//         return this.map_size*y + x
//     }
    
//     is_out(x, y){
//         return ! ((0 <= x && x < this.map_size) && (0 <= y && y < this.map_size))
//     }
    
//     reward(state){
//         var state_reward = {"S": 0, "F":0, "H":-1, "G":1}
//         var x, y
//         if (state == -1){
//             return 0
//         }
//         [x, y] = this.state_to_coordinate(state)
//         state = this.map[y][x]
//         return state_reward[state]
//     }

// }
// // var agent = new Agent(10, 10)
// // var action = agent.start(0)
// // console.log(action)
// // for(var i=0 ; i<100 ; i++){
// //     action = agent.step(1, 10)    
// //     console.log(action)
// // }
// // agent.end(0)

// // var map = util.ones([10, 10])
// // map[0][0] = "a"
// var env = new FrozenLake(10)

// // var x = new Set()
// // x.add([1, 2])
// // x.add([1, 3])
// // x.add([1, 4])
// // x.add([1, 2])

// // console.log(x)
// // console.log(x.has([1, 2]))
