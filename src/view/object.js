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
        element.className = "module"
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
        <div><span></span>: <span></span></div>
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
        this.slider.value = v
    }
}