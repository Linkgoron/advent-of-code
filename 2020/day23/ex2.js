const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const cups = data.toString().trim().split('').map(Number);
    const max = Math.max(...cups);
    for (let i = max + 1; i <= 1_000_000; i++) {
        cups.push(i);
    }
    const ring = new Ring(cups, 1, 1_000_000);
    for (let i = 0; i < 10_000_000; i++) {
        ring.doMove();
    }
    console.log(ring.score());
});

class Ring {
    constructor(numbers, min, max) {
        const list = numbers.map(x => ({
            number: x
        }));
        list.forEach((x, i) => {
            x.next = list[(i + 1) % list.length];
        })
        this.current = list[0];
        this.items = new Map(list.map(x => [x.number, x]));
        this.min = min;
        this.max = max;
    }

    doMove() {
        const item = this.current;
        let next = item;
        const firstRemove = item.next;
        const removedNums = []
        for (let i = 0; i < 3; i++) {
            next = next.next;
            removedNums.push(next.number);
        }
        const lastRemove = next;
        let nextCup = this.current.number === this.min ? this.max : this.current.number - 1;
        while (removedNums.includes(nextCup)) {
            nextCup = nextCup > this.min ? nextCup - 1 : this.max;
        }
        const destination = this.items.get(nextCup);
        if (destination === undefined) {
            console.log(destination, nextCup, this.current.number, this.min);
        }
        item.next = lastRemove.next;
        const newNext = destination.next;
        destination.next = firstRemove;
        lastRemove.next = newNext
        this.current = this.current.next;
    }

    print() {
        const start = this.current;
        const item = [start.number];
        let next = start.next;
        while (next !== start) {
            item.push(next.number);
            next = next.next;
        }
        return { items: item.join(' '), current: this.current.number };
    }

    label() {
        const start = this.items.get(1).next;
        const item = [start.number];
        let next = start.next;
        while (next.next !== start) {
            item.push(next.number);
            next = next.next;
        }
        return item.join('');
    }

    score() {
        const start = this.items.get(1).next;
        const left = start.number;
        const right = start.next.number;
        return left * right;
    }
}
