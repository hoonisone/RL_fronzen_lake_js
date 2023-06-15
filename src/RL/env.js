class FrozenLake{
    constructor(map_size, frozen_ratio){
        this.map_size = map_size
        this.state_list = util.range(0, map_size*map_size)
        this.action_list = util.range(0, 4)
        
        this.frozen_ratio = frozen_ratio
        this.map = this.generateRandomMap(this.map_size, this.frozen_ratio)
        this.random_next_probability = 0.3
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
        if(Math.random() < this.random_next_probability){
            action = util.randomChoice(this.action_list)
        }

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
            if(this.map[next_y][next_x] == "H")
                return state
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


class ChangingFrozenLake1 extends FrozenLake{
    constructor(){
        super(5, 1)
        this.map_list = [
        [["S", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "G"]],

        [["S", "F", "H", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["H", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "G"]],

        [["S", "F", "F", "F", "F"],
         ["F", "F", "H", "F", "F"],
         ["F", "H", "H", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "G"]],
        
        [["S", "F", "F", "H", "F"],
         ["F", "F", "F", "H", "F"],
         ["F", "F", "F", "F", "F"],
         ["H", "H", "F", "F", "F"],
         ["F", "F", "F", "F", "G"]],
        
        [["S", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "H", "H", "H", "F"],
         ["F", "F", "F", "F", "F"],
         ["F", "F", "F", "F", "G"]],         
        
        [["S", "F", "F", "F", "F"],
         ["F", "F", "H", "F", "F"],
         ["F", "F", "H", "F", "F"],
         ["F", "F", "H", "F", "F"],
         ["F", "F", "F", "F", "G"]],
        
        [["S", "F", "F", "F", "F"],
         ["F", "F", "F", "H", "F"],
         ["F", "F", "H", "F", "F"],
         ["F", "H", "F", "F", "F"],
         ["F", "F", "F", "F", "G"]]]

        this.map_idx = 0
        this.map = this.map_list[this.map_idx]
    }

    next_map(){
        this.map_idx += 1
        if(this.map_idx == this.map_list.length){
            return false
        }
        this.map = this.map_list[this.map_idx]
        return true
    }
}