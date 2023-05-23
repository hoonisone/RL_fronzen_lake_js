
var label = ["open", "start", "hall", "wall", "goal"]
export class CellAgentViewer{
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
export class GridCellViewer{


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

    getElement(){
        return this.element;
    }

    setState(type){
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


export class FrozenLakeEnvViewer{
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
}