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

    const list = new SingleStack(2020, 119315717514047);
    const seen = new Map();
    seen.set(2020, 0);
    let init = 0;
    let prev = 2020;
    for (let val = 1; val < 100000000; val++) {
        for (const command of commands) {
            if (command.command === 'cut') {
                list.cut(command.count);
            }
            if (command.command === 'increment') {
                list.increment(command.count);
            }
            if (command.command === 'new') {
                list.newStack();
            }
        }
        if (seen.has(list.currentPosition)) {
            console.log('duplicate');
            console.log(val, seen.get(val), seen.get(list.currentPosition) - val);
            return;
        } else {
            seen.set(list.currentPosition, val);
        }
        console.log(Math.abs(list.currentPosition - prev));
        prev = list.currentPosition;
    }
    console.log(list.currentPosition);
});

class SingleStack {
    constructor(toFollow, total) {
        this.toFollow = toFollow;
        this.currentPosition = toFollow;
        this.total = total;
    }

    newStack() {
        this.currentPosition = this.total - this.currentPosition - 1;
    }

    cut(val) {
        if (val > 0) {
            const move = val % this.total;
            if (this.currentPosition < move) {
                const staying = this.total - move;
                this.currentPosition = staying + this.currentPosition;
            } else {
                this.currentPosition = this.currentPosition - move;
            }
        }
        if (val < 0) {
            const newCut = (this.total + val) % this.total;
            this.cut(newCut % this.total);
        }
    }

    increment(inc) {
        const newPos = (inc * this.currentPosition) % this.total;
        this.currentPosition = newPos;
    }
}