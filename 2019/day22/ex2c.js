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
    // let locStart = 111543024099186n;
    let locStart = 0n;
    let locAmount = 1n;
    let deckSize = 119315717514047n
    const forw = new SingleStack(locStart, deckSize);
    const forw2 = new SingleStack(locStart + 1n, deckSize);
    execute(forw, commands, deckSize);
    execute(forw2, commands, deckSize);
    const init = forw.currentPosition;
    let diff = forw2.currentPosition - forw.currentPosition;
    console.log(`${forw.currentPosition}+x*${diff} mod ${deckSize}`);
    const func = new Func(init, diff, deckSize);
    let times = 
    let map = new Map
    let funcTwice = func.composeSelf();
    for (let location = locStart; location < locStart + locAmount; location++) {
        const tester = new SingleStack(location, deckSize);
        execute(tester, commands, deckSize);
        execute(tester, commands, deckSize);
        const diffPos = (location - locStart) * diff;
        const val = (init + diffPos) % deckSize;
        console.log(val, tester.currentPosition, val - tester.currentPosition === 0n);
        console.log(func.compute(location), funcTwice.compute(location));
    }

    // init + diffx
    // init + diff*(init+diff*x) = init+dif*init + diff*diff*x
    // console.log('-----');
    // const specialStart = 111543024099186n;
    // const farther = new SingleStack(specialStart, deckSize);

    // for (let times = 0; times < 3; times++) {
    //     execute(farther, commands);
    //     let curPos = specialStart;
    //     for (let i = 0; i < times + 1; i++) {
    //         const diffPos = curPos * diff;
    //         curPos = (init + diffPos) % deckSize;
    //     }

    //     let curPos2 = 0n;
    //     for (let i = 0; i < times; i++) {
    //         curPos2 = (curPos * diff) % deckSize;            
    //     }        
    //     console.log(curPos2,curPos, farther.currentPosition, curPos - forw.currentPosition === 0n);
    // }

    // 0 -> 10529902731202
    // 1 -> 10529902731202 + 91332517246274
    // 2 -> (10529902731202 + 91332517246274 * 2) % 119315717514047
});

class Func {
    constructor(init, diff, mod) {
        this.init = init % mod;
        this.diff = diff % mod;
        this.mod = mod;
    }

    compute(x) {
        return this.init + this.diff * x % this.mod;
    }

    composeSelf() {
        let newInit = this.init + this.init * this.diff % this.mod;
        let newDiff = (this.diff * this.diff) % this.mod
        return new Func(newInit, newDiff, this.mod);
    }

    add(other) {
        if(other.mod !== this.mod) {
            throw new Error("same mod only");
        }
        return new Func(this.init + other.init, this.diff + other.diff, this.mod);
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