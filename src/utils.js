export class util{
    array_functions = []
    static argMax(array) {
        return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }

    static zeros(dims){
        // console.log(args)
        if (dims.length == 1){
            return Array(dims[0]).fill(0);
        }
        else{
            var arr = []
            for(var i=0 ; i<dims[0] ; i++){
                // console.log(args.slice(1))
                arr.push(util.zeros(dims.slice(1)));
                // arr.push(util.array(args.slice(1)));
            }
            return arr;
        }
    }
    static ones(dims){
        // console.log(args)
        if (dims.length == 1){
            return Array(dims[0]).fill(1);
        }
        else{
            var arr = []
            for(var i=0 ; i<dims[0] ; i++){
                // console.log(args.slice(1))
                arr.push(util.ones(dims.slice(1)));
                // arr.push(util.array(args.slice(1)));
            }
            return arr;
        }
    }
    static ndarray(dims, value){
        // console.log(args)
        if (dims.length == 1){
            return Array(dims[0]).fill(value);
        }
        else{
            var arr = []
            for(var i=0 ; i<dims[0] ; i++){
                // console.log(args.slice(1))
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

    static print2D(x){
        let s = ""
        for(var i=0 ; i<x.length ; i++){
            for(var j=0 ; j<x[i].length ; j++){
                s += `${x[i][j]}, `
            }
            s += "\n"
        }
        console.log(s)
    }

}

// console.log(util.ndarray([10, 10], ""))
// console.log(util.vSquare([1, 2, 3], 3))

