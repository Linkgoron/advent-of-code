require('fs').readFile('./ex.input', (err, data) => {
    const commands = data.toString().split('\n')
        .map(x => x.trim().split(' ')).map(row => {
            if (row[0] === 'cut') {
                return {
                    command: 'cut',
                    count: BigInt(row[1])
                }
            }
            if (row[1] === 'with') {
                return {
                    command: 'increment',
                    count: BigInt(row[3])
                }
            }

            return {
                command: 'new'
            }
        });
    let deckSize = 119315717514047n;
    let locStart = 111543024099186n;
    let locAmount = 5n;
    const forw = new SingleStack(locStart, deckSize);
    const forw2 = new SingleStack(locStart + 1n, deckSize);
    execute(forw, commands, deckSize);
    execute(forw2, commands, deckSize);
    let diff = forw2.currentPosition - forw.currentPosition;
    console.log(`${forw.currentPosition}+x*${diff} mod ${deckSize}`);
    for (let location = locStart; location < locStart + locAmount; location++) {
        const tester = new SingleStack(location, deckSize);
        execute(tester, commands, deckSize);
        const diffPos = (location - locStart) * diff;
        const val = (forw.currentPosition + diffPos) % deckSize;
        console.log(val, tester.currentPosition, val - tester.currentPosition === 0n);
    }

    // 0 -> 10529902731202
    // 1 -> 10529902731202 + 91332517246274
    // 2 -> (10529902731202 + 91332517246274 * 2) % 119315717514047
});

function prnt(curPos, prevPos, deckSize) {
    if (curPos > prevPos) {
        console.log(prevPos, curPos, curPos - prevPos)
    } else {
        console.log(prevPos, curPos, deckSize + curPos - prevPos)
    }
}

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
        this.currentPosition = this.total - this.currentPosition - 1n;
    }

    cut(val) {
        val = val < 0n ? (this.total + val) : val;
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