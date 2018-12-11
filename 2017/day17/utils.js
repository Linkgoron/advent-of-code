module.exports = class LinkedList {
    constructor(initial) {
        this.head = { value: initial, next: null };
        this.head.next = this.head;
        this.pos = this.head;
    }


    add(value) {
        const toAdd = { value, next: this.pos.next };
        this.pos.next = toAdd;
        this.pos = toAdd;
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