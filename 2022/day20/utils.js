class LinkedNode {
    constructor(value) {
        this.next = null;
        this.prev = null;
        this.value = value;
    }
}

module.exports.IndexedLinkedList = class IndexedLinkedList {
    constructor(initial) {
        this.originalOrder = [];
        this.head = new LinkedNode(initial)
        this.head.next = this.head;
        this.head.prev = this.head;
        this.pos = this.head;
        this.originalOrder.push(this.head);
    }

    pointTo(originalIndex) {
        this.pos = this.originalOrder[originalIndex];
    }

    len() {
        return this.originalOrder.length;
    }

    move() {
        const toMove = this.pos;
        let moveBy = toMove.value;
        if (moveBy === 0) {
            return;
        }
        let endPos = toMove;
        if (moveBy > 0) {
            const finalMoveBy = moveBy % (this.originalOrder.length - 1);
            for (let j = 0; j < finalMoveBy; j++) {
                endPos = endPos.next;
                if (endPos === toMove) {
                    endPos = endPos.next;
                }
            }
            if (endPos === toMove) {
                console.log('wat');
                return;
            }
            if (endPos.next === toMove) {
                console.log('wat2');
                return;
            }
                        
            if (toMove === this.head) {
                this.head = toMove.next;
            }
            toMove.prev.next = toMove.next;
            toMove.next.prev = toMove.prev;        
         
            const endPointNext = endPos.next;
            const endPoint = endPos;        
            endPointNext.prev = toMove;
            endPoint.next = toMove;
            toMove.prev = endPoint;
            toMove.next = endPointNext;
        } else {
            const finalMoveBy = Math.abs(moveBy) % (this.originalOrder.length - 1);
            for (let j = 0; j < finalMoveBy; j++) {
                endPos = endPos.prev;
                if (endPos === toMove) {
                    endPos = endPos.prev;
                }
            }
            if (endPos === toMove) {
                console.log('wat');
                return;
            }
            if (endPos.prev === toMove) {
                console.log('wat3');
                return;
            }
            if (toMove === this.head) {
                this.head = toMove.prev;
            }
            toMove.prev.next = toMove.next;
            toMove.next.prev = toMove.prev;        
         
            const endPointPrev = endPos.prev;
            const endPoint = endPos;        
            endPoint.prev = toMove;
            endPointPrev.next = toMove;
            toMove.prev = endPointPrev;
            toMove.next = endPoint;
        }                       
    }

    add(value) {
        const toAdd = new LinkedNode(value);
        const prevNext = this.pos.next;
        const current = this.pos;
        prevNext.prev = toAdd;
        current.next = toAdd;
        toAdd.prev = current;
        toAdd.next = prevNext;
        this.originalOrder.push(toAdd);
        this.pos = toAdd;
    }

    goLeft(num) {
        for (let j = 0; j < num; j++) {
            this.pos = this.pos.prev;
        }
    }

    goRight(num) {
        for (let j = 0; j < num; j++) {
            this.pos = this.pos.next;
        }
    }

    print() {
        console.log(this.toString(' '));
    }
    toString(sep = '') {
        return this.toArray().map(val=> val >= 0 ? val : `(${val})`).join(sep);
    }

    toArray() {
        const values = [];
        values.push(this.head.value)
        let next = this.head.next;
        while (next !== this.head) {
            values.push(next.value)
            next = next.next;
        }
        return values;
    }

    toArrayReverse() {
        const values = [];
        values.push(this.head.value)
        let next = this.head.prev;
        while (next !== this.head) {
            values.push(next.value)
            next = next.prev;
        }
        return values;
    }

    currentValue() {
        return this.pos.value;
    }
}