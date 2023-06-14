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

class MainControllerView{
    constructor(){
        this.element = document.createElement("div")
        this.element.className = "module"

        this.sliderListDom = new SliderListObject(["Speed"])
        this.element.appendChild(this.sliderListDom.getElement())

        this.checkBoxListDom = new CheckBoxList(["use_oblivion"])
        this.element.appendChild(this.checkBoxListDom.getElement())
    }

    getElement(){
        return this.element
    }
}

class PolicyControllerView{
    constructor(name){
        this.element = document.createElement("div");
        this.element.className = "module"
        this.element.innerHTML = `
            <label><b>${name}</b></label>
            <hbox class="epsilon"></hbox>
            <hbox class="kappa"></hbox>
        `
        this.epsilon_slider = new SliderObject("epsilon")
        this.epsilon_check_box = new CheckBox("auto")
        this.kappa_slider = new SliderObject("kappa")
        this.kappa_check_box = new CheckBox("auto")

        this.element.getElementsByClassName("epsilon")[0].appendChild(this.epsilon_slider.getElement())
        this.element.getElementsByClassName("epsilon")[0].appendChild(this.epsilon_check_box.getElement())
        this.element.getElementsByClassName("kappa")[0].appendChild(this.kappa_slider.getElement())
        this.element.getElementsByClassName("kappa")[0].appendChild(this.kappa_check_box.getElement())
    }

    getElement(){
        return this.element
    }
}

class ValueControllerView{
    constructor(name){
        this.element = document.createElement("div");
        this.element.className = "module"
        this.element.innerHTML = `
            <div><label><b>${name}</b></label></div>
        `
        this.sliderListDom = new SliderListObject(["Gamma", "Step Size"])
        this.buttonDom = new ButtonObject("Show")

        this.element.appendChild(this.sliderListDom.getElement())        
        this.element.appendChild(this.buttonDom.getElement())
    }
    getElement(){
        return this.element
    }
}

class ControllerView{
    constructor(name){
        this.element = document.createElement("div")
        this.element.innerHTML = `
        <div>
            <div class="main_controller"></div>
            <div class="exploitation_policy"></div>
            <div class="exploitation_value"></div>
        </div>
        `
        
        this.main_controller_view = new MainControllerView()
        this.policy_controller_view = new PolicyControllerView("Policy")
        this.value_controller_view = new ValueControllerView("Value")

        this.element.getElementsByClassName("main_controller")[0].appendChild(this.main_controller_view.getElement())
        
        this.element.getElementsByClassName("exploitation_policy")[0].appendChild(this.policy_controller_view.getElement())
        this.element.getElementsByClassName("exploitation_value")[0].appendChild(this.value_controller_view.getElement())
    }

    getElement(){
        return this.element
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
        element.className = "module"
        return element}
}