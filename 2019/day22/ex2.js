require('fs').readFile('./ex.input', (err, data) => {
    const commands = data.toString().split('\n')
        .map(x => x.trim().split(' ')).map(row => {
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

    let init = 0;
    let deckSize = 119315717514047;
    let steps = 101741582076661;
    // const forw = new SingleStack(init, deckSize);
    // execute(forw, commands);
    const back = new SingleStack(init, deckSize);
    const reverseCommands = commands.reverse();
    execute(back, reverseCommands);
    for (let trn = 0; trn < steps; trn++) {
        if (trn % 100000 === 0) {
            console.log(trn, steps - trn);
        }
        if (back.currentPosition === 2020) {
            console.log("OMGGGGGGGGGGGGGGGGG", trn)
        }
        execute(back, reverseCommands);
    }
    console.log('hi');
});

function execute(stack, commands) {
    for (const command of commands) {
        if (command.command === 'cut') {
            stack.cut(command.count);
        }
        if (command.command === 'increment') {
            stack.increment(command.count);
        }
        if (command.command === 'new') {
            stack.newStack();
        }
    }
    return stack;
}

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
        val = val < 0 ? (this.total + val) : val;
        const move = val % this.total;
        if (this.currentPosition < move) {
            const staying = this.total - move;
            this.currentPosition = staying + this.currentPosition;
        } else {
            this.currentPosition = this.currentPosition - move;
        }
    }

    increment(inc) {
        const newPos = (inc * this.currentPosition) % this.total;
        this.currentPosition = newPos;
    }
}

class OppositeStack {
    constructor(toFollow, total) {
        this.toFollow = toFollow;
        this.currentPosition = toFollow;
        this.total = total;
    }

    newStack() {
        this.currentPosition = this.total - this.currentPosition - 1;
    }

    cut(val) {
        val = -1 * val;
        val = val < 0 ? (this.total + val) : val;
        const move = val % this.total;
        if (this.currentPosition < move) {
            const staying = this.total - move;
            this.currentPosition = staying + this.currentPosition;
        } else {
            this.currentPosition = this.currentPosition - move;
        }
    }

    increment(delta) {
        let pos = 0;
        let i = 0;
        const toMul = Math.ceil(this.total / delta);
        while (pos !== this.currentPosition) {
            const diff = this.currentPosition - pos;
            if (diff % delta === 0) {
                const stepDelta = diff / delta;
                this.currentPosition = i + stepDelta;
                return;
            }
            pos = (pos + delta * toMul) % this.total;
            i += toMul;
        }
        this.currentPosition = i;
    }
}

this.init + this.diff*(other.diff*x+other.init)
= this.init+other.init*this.diff+
this.diff*other.diff * x