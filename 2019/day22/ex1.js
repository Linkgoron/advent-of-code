require('fs').readFile('./ex.input', (err, data) => {
    const commands = data.toString().split('\n')
        .map(x => x.trim().split(' ')).map(row => {
            console.log(row);
            if (row[0] === 'cut') {
                return {
                    command: 'cut',
                    count: Number(row[1])
                }
            }
            if (row[1] === 'with') {
                return {
                    command: 'increment',
                    count: Number(row[3])
                }
            }

            return {
                command: 'new'
            }
        });

    const list = new LinkedList(0);
    for (let i = 1; i < 1007; i++) {
        list.add(i);
    }
    for (const command of commands) {
        list.hasDup();
        if (command.command === 'cut') {
            list.cut(command.count);
        }
        if (command.command === 'increment') {
            list.increment(command.count);
        }
        if (command.command === 'new') {
            list.newStack();
        }
        console.log(command);
        list.print();

    }
    list.print();
    list.printVal(9);
});

class LinkedNode {
    constructor(value) {
        this.next = null;
        this.prev = null;
        this.value = value;
    }
}

class LinkedList {
    constructor(initial) {
        this.head = new LinkedNode(initial)
        this.head.next = this.head;
        this.head.prev = this.head;
        this.count = 1;
    }

    add(value) {
        this.count++;
        const toAdd = new LinkedNode(value);
        const curLast = this.head.prev;
        toAdd.next = this.head;
        toAdd.prev = curLast;
        curLast.next = toAdd
        this.head.prev = toAdd;
    }

    newStack() {
        let cur = this.head.next;
        while (cur !== this.head) {
            const curNext = cur.next;
            const curPrev = cur.prev
            cur.next = curPrev;
            cur.prev = curNext;
            cur = curNext;
        }
        const curHeadPrev = this.head.prev;
        this.head.prev = this.head.next;
        this.head.next = curHeadPrev;
        this.head = curHeadPrev
    }

    cut(val) {
        if (val >= 0) {
            let newStart = this.head;
            for (let i = 0; i < val; i++) {
                newStart = newStart.next;
            }
            this.head = newStart;
        } else {
            let newStart = this.head;
            for (let i = 0; i < Math.abs(val); i++) {
                newStart = newStart.prev;
            }
            this.head = newStart;
        }
    }

    increment(inc) {
        let pos = this.head;
        // head stays in place.
        const curValues = this.orderedValues();
        pos.value = curValues[0];
        for (let i = 1; i < this.count; i++) {
            for (let j = 0; j < inc; j++) {
                pos = pos.next;
            }
            pos.value = curValues[i];
        }
    }

    orderedValues() {
        const values = [];
        values.push(this.head.value);
        let next = this.head.next;
        while (next !== this.head) {
            values.push(next.value);
            next = next.next;
        }
        return values;
    }

    print() {
        const values = [];
        values.push(this.head.value)
        let next = this.head.next;
        while (next !== this.head) {
            values.push(next.value);
            next = next.next;
        }
        console.log(values);
    }

    hasDup() {
        const values = new Map();
        values.set(this.head.value, 0)
        let cur = this.head.next;
        let i = 1;
        while (cur !== this.head) {
            if (values.has(cur.value)) {
                console.log("ERR", cur.value, i, values.get(cur.value));
                throw new Error();
            }
            i++
            values.set(cur.value, i);
            cur = cur.next;
        }
    }

    printVal(index) {
        let next = this.head;
        for (let curIndex = 0; curIndex < index; curIndex++) {
            next = next.next;
        }
        console.log(next.value)
    }
}