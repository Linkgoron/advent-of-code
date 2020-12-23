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

    let deckSize = 119315717514047n
    const forw = new OppositeStack(0n, deckSize);
    const forw2 = new OppositeStack(1n, deckSize);
    const revCommands = commands.reverse();
    execute(forw, revCommands, deckSize);
    execute(forw2, revCommands, deckSize);
    const diff = forw2.currentPosition - forw.currentPosition % deckSize;
    console.log(`function is:${forw.currentPosition}+x*${diff} mod ${deckSize}`);
    const func = new Func(forw.currentPosition, diff, deckSize);
    const times = 101741582076661n;
    const bitRep = times.toString(2);
    const map = new Map();
    let allFunc = func;
    map.set(0, allFunc);
    for (let i = 1; i < bitRep.length; i++) {
        allFunc = allFunc.composeSelf();
        map.set(i, allFunc);
    }
    var bitRepArr = bitRep.split('').reverse();
    let full = undefined;
    for (let i = 0; i < bitRep.length; i++) {
        if (bitRepArr[i] === '1') {
            if (full === undefined) {
                full = map.get(i);
            } else {
                full = full.compose(map.get(i));
            }
        }
    }
    console.log((full.compute(2020n) + deckSize) % deckSize);
});

class Func {
    constructor(init, diff, mod) {
        this.init = BigInt(init) % BigInt(mod);
        this.diff = BigInt(diff) % BigInt(mod);
        this.mod = BigInt(mod);
    }

    compute(x) {
        return (this.init + this.diff * BigInt(x)) % this.mod;
    }

    composeSelf() {
        return this.compose(this);
    }

    compose(other) {
        if (other.mod !== this.mod) {
            throw new Error("same mod only");
        }
        let newInit = (this.init + other.init * this.diff) % this.mod;
        let newDiff = (this.diff * other.diff) % this.mod
        return new Func(newInit, newDiff, this.mod);
    }

    toString() {
        return `${this.init} + ${this.diff}*x mod ${this.mod}`;
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

class OppositeStack {
    constructor(toFollow, total) {
        this.toFollow = toFollow;
        this.currentPosition = toFollow;
        this.total = total;
    }

    newStack() {
        this.currentPosition = this.total - this.currentPosition - 1n;
    }

    cut(val) {
        val = this.total - val;
        val = val < 0n ? (this.total + val) : val;
        const move = val % this.total;
        if (this.currentPosition < move) {
            const staying = this.total - move;
            this.currentPosition = staying + this.currentPosition;
        } else {
            this.currentPosition = this.currentPosition - move;
        }
    }

    increment(delta) {
        let pos = 0n;
        let i = 0n;
        const ceil = this.total % delta === 0 ? 0n : 1n;
        const toMul = (this.total / delta) + ceil;
        while (pos !== this.currentPosition) {
            const diff = this.currentPosition - pos;
            if (diff % delta === 0n) {
                const stepDelta = diff / delta;
                this.currentPosition = i + stepDelta;
                return;
            }
            pos = (pos + delta * toMul) % this.total;
            i += toMul;
        }
    }
}