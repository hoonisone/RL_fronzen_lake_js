class Heap {
    constructor() {
        this.heap = [];
    }
    /**
    * @param {number} newValue
    */
    push(newValue) {
        const heap = this.heap;
        heap.push(newValue);
        let index = heap.length - 1, parent = Math.floor((index - 1) / 2);
        while(index > 0 && heap[parent] < heap[index]) {
            [heap[parent], heap[index]] = [heap[index], heap[parent]];
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }
    /**
    * @return {number}
    */
    pop() {
        const heap = this.heap;
        if(heap.length <= 1) return heap.pop();
        const ret = heap[0];
        heap[0] = heap.pop();
        let here = 0;
        while(1) {
            let left = here * 2 + 1, right = here * 2 + 2;
            // 리프에 도달
            if(left >= heap.length) break;
            // heap[here]가 내려갈 위치를 찾는다.
            let next = here;
            if (heap[next] < heap[left]) next = left;
            if (right < heap.length && heap[next] < heap[right]) next = right;
            if (next === here) break;
            [heap[here], heap[next]] = [heap[next], heap[here]];
            here = next;
        }
        return ret;
    }

    is_empty(){
        return this.heap.length == 0
    }

    clear(){
        this.heap = []
    }
}

class list_util{
    static sum(v){
        v = [...v]
        return v.reduce((a, b) => a+b, 0)
    }

    static mean(v){
        return list_util.sum(v)/v.length
    }
}

class math_util{
    static floor(x, n){
        var e = (10**n)
        return Math.floor(x*e)/e
    }
}

class random_util{
    static randomChoice(items){
        var index = Math.floor(Math.random() * items.length);
        return items[index];
    }
}

class tensor_util{
    static object_ndarray(dims, generator){
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
                arr.push(tensor_util.object_ndarray(dims.slice(1), generator));
            }
            return arr;
        }
    }
}

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
    static object_ndarray(dims, generator){
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