function object_ndarray(dims, generator){
    if (dims.length == 1){
        var arr = Array(dims[0]);
        for(var i=0 ; i<arr.length ; i++){
            arr[i] = generator()
        }
        return arr
    }
    else{
        var arr = []
        for(var i=0 ; i<dims[0] ; i++){
            arr.push(object_ndarray(dims.slice(1), generator));
        }
        return arr;
    }
}

var i=0
var x = object_ndarray([10, 20], () => {
    i+=1
    return i
})
console.log(x)