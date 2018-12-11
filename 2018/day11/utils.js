class LinkedNode {
    constructor(value) {
        this.next = null;
        this.prev = null;
        this.value = value;
    }
}

module.exports = class LinkedList {
    constructor(initial) {
        this.head = new LinkedNode(initial)
        this.head.next = this.head;
        this.head.prev = this.head;
        this.pos = this.head;
    }

    remove() {
        const toRemove = this.pos;
        toRemove.prev.next = toRemove.next;
        toRemove.next.prev = toRemove.prev;
        this.pos = toRemove.next;
        if (toRemove === this.head) {
            this.head = this.pos;
        }
        
        return toRemove.value;
    }

    add(value) {
        const toAdd = new LinkedNode(value);
        const prevNext = this.pos.next;
        const current = this.pos;
        prevNext.prev = toAdd;
        current.next = toAdd;
        toAdd.prev = current;
        toAdd.next = prevNext;
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
        const values = [];
        values.push(this.head.value.toString())
        let next = this.head.next;
        while (next !== this.head) {
            if (next === this.pos) {
                values.push('(' + next.value + ')')
            } else {
                values.push(next.value.toString())
            }
            next = next.next;
        }
        console.log(values.join(' '));
    }
}