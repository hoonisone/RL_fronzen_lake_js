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
}

var h = new Heap()

h.push([1, "sdlkg1"])
h.push([4, "sdlkg2"])
h.push([2, "sdlkg3"])
h.push([3, "sdlkg4"])

while(!h.is_empty()){
    console.log(h.pop())
}