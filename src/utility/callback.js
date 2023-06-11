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