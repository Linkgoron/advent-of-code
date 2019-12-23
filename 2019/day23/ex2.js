require('fs').readFile('./ex1.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x))

    const executions = [];
    const governor = new Governor();
    for (let val = 0; val < 50; val++) {
        const io = new IOUnit(val, governor);
        executions.push(createExecution(startingState, io, io, val));
    }
    while (!governor.finished) {
        for (let execution of executions) {
            if (!execution.isDone()) {
                execution.execute();
            }
        }
        governor.pushNat();
    }
    console.log(governor.lastNatMessage.y);
});

function createExecution(startingState, input, output, id) {
    const state = [...startingState];
    let relative = 0;
    let done = false;
    let inst = -1;
    return {
        id,
        isDone() { return done; },
        execute() {
            inst++;
            const totalCommand = state[inst++];
            const command = totalCommand % 100;
            if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 99].includes(command)) {
                console.error('bad op-code', inst - 1, totalCommand, command);
                throw new Error('bad op code');
            }

            if (command === 99) {
                done = true;
                return;
            }
            const modeString = [...Math.floor(totalCommand / 100).toString()].reverse()
            const modes = [parseInt(modeString[0] || '0'), parseInt(modeString[1] || '0'), parseInt(modeString[2] || '0')]

            function fetchValue(mode, value, memory) {
                return mode === 1 ? value :
                    mode === 0 ? (memory[value] || 0) :
                        (memory[relative + value] || 0);
            }

            function getWritePosition(mode, value, memory) {
                return mode === 0 ? memory[value] : (memory[inst] + relative);
            }

            switch (command) {
                case 1: {
                    const left = fetchValue(modes[0], state[inst++], state);
                    const right = fetchValue(modes[1], state[inst++], state);
                    const writePos = getWritePosition(modes[2], inst, state);
                    state[writePos] = left + right;
                    return;
                }
                case 2: {
                    const left = fetchValue(modes[0], state[inst++], state);
                    const right = fetchValue(modes[1], state[inst++], state);
                    const writePos = getWritePosition(modes[2], inst, state);
                    state[writePos] = left * right;
                    return;
                }
                case 3: {
                    const writePos = getWritePosition(modes[0], inst, state);
                    state[writePos] = input.read();
                    return;;
                }
                case 4: {
                    const out = fetchValue(modes[0], state[inst], state);
                    output.write(out);
                    return;;
                }
                case 5: {
                    const first = fetchValue(modes[0], state[inst++], state);
                    if (first !== 0) {
                        inst = fetchValue(modes[1], state[inst], state) - 1;
                    }
                    return;;
                }
                case 6: {
                    const first = fetchValue(modes[0], state[inst++], state);
                    if (first === 0) {
                        inst = fetchValue(modes[1], state[inst], state) - 1;
                    }
                    return;;
                }
                case 7: {
                    const first = fetchValue(modes[0], state[inst++], state);
                    const second = fetchValue(modes[1], state[inst++], state);
                    const writePos = getWritePosition(modes[2], inst, state);
                    state[writePos] = first < second ? 1 : 0;
                    return;;
                }
                case 8: {
                    const first = fetchValue(modes[0], state[inst++], state);
                    const second = fetchValue(modes[1], state[inst++], state);
                    const writePos = getWritePosition(modes[2], inst, state);
                    state[writePos] = first === second ? 1 : 0;
                    return;;
                }
                case 9: {
                    const value = fetchValue(modes[0], state[inst], state);
                    relative += value;
                    return;;
                }
            }
        }
    }
}
class IOUnit {
    constructor(address, bus) {
        this.address = address;
        this.gaveAddress = false;
        this.writeState = 0;
        this.bus = bus;
        this.message = undefined;
        this.readVal = undefined;
    }

    write(value) {
        // console.log('WRITE', value, value === 255, this.message, this.writeState);
        if (this.writeState === 0) {
            this.message = { address: value };
            this.writeState++
            return;
        }

        if (this.writeState === 1) {
            this.message.x = value;
            this.writeState++
            return;
        }

        if (this.writeState === 2) {
            this.message.y = value;
            this.writeState = 0;
            this.bus.write(this.message.address, { x: this.message.x, y: this.message.y });
            return;
        }
    }

    read() {
        if (!this.gaveAddress) {
            this.gaveAddress = true;
            return this.address;
        }
        if (this.readVal) {
            const res = this.readVal.y;
            this.readVal = undefined;
            return res;
        }
        this.readVal = this.bus.read(this.address);
        if (!this.readVal) {
            return -1;
        }
        return this.readVal.x;
    }
}

class Governor {
    constructor() {
        this.map = new Map();
        this.nat = undefined;
        this.triedToRead = 0;
        this.lastNatMessage = undefined;
        this.finished = false;
    }

    resetRead() {
        this.triedToRead = 0;
    }

    allIdle() {
        return [...this.map.values()].every(x => x.length === 0);
    }

    pushNat() {
        if (!this.allIdle()) {
            this.triedToRead = 0;
            return;
        }
        if (this.triedToRead >= 1000) {
            if (!this.map.has(0) === undefined) {
                this.map.set(0, []);
            }
            this.map.get(0).push(this.nat);
            if (!this.finished && this.lastNatMessage && this.lastNatMessage.y === this.nat.y) {
                this.finished = true;
            }
            this.lastNatMessage = this.nat;
            this.triedToRead = 0;
        }
    }

    write(address, message) {
        if (address === 255) {
            this.nat = message;
            return;
        }
        if (!this.map.has(address)) {
            this.map.set(address, []);
        }
        this.map.get(address).push(message);
    }

    read(address) {
        if (!this.map.has(address)) {
            this.map.set(address, []);
        }
        const doesntHaveValue = this.map.get(address).length === 0;
        if (doesntHaveValue) {
            this.triedToRead++;
            return undefined;
        }

        return this.map.get(address).shift();
    }
}