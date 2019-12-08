require('fs').readFile('./ex2.input', async (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x))
    const options = permutations([5, 6, 7, 8, 9]);

    let maxConfig = undefined;
    let max = undefined;
    for (const option of options) {
        const units = setup(option);
        await Promise.all(units.map((x, i) => runProgram(startingState, x, units[(i + 1) % 5])));
        const finalOutput = await units[0].read();
        if (max === undefined || max < finalOutput) {
            max = finalOutput;
            maxConfig = [...option];
        }
    }
    console.log(`max output ${max}, config is ${maxConfig}`);
});

function setup(phaseSetting) {
    return [
        new IOUnit([phaseSetting[0], 0]),
        new IOUnit([phaseSetting[1]]),
        new IOUnit([phaseSetting[2]]),
        new IOUnit([phaseSetting[3]]),
        new IOUnit([phaseSetting[4]])
    ];
}

async function runProgram(startingState, input, output) {
    const state = [...startingState];
    for (let inst = 0; inst < state.length; inst++) {
        const totalCommand = state[inst++];
        const command = totalCommand % 100;
        if (![1, 2, 3, 4, 5, 6, 7, 8, 99].includes(command)) {
            console.error('bad op-code', inst - 1, command);
            throw new Error('bad op code');
        }

        if (command === 99) {
            return;
        }
        const modeString = [...Math.floor(totalCommand / 100).toString()].reverse()
        const modes = [parseInt(modeString[0] || '0'), parseInt(modeString[1] || '0'), parseInt(modeString[2] || '0')]

        function fetchValue(mode, value, memory) {
            return mode === 1 ? value : memory[value];
        }

        switch (command) {
            case 1: {
                const left = fetchValue(modes[0], state[inst++], state);
                const right = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = left + right;
                continue
            }
            case 2: {
                const left = fetchValue(modes[0], state[inst++], state);
                const right = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = left * right;
                continue
            }
            case 3: {
                state[state[inst]] = await input.read();
                continue;
            }
            case 4: {
                const out = fetchValue(modes[0], state[inst], state);
                output.write(out);
                continue;
            }
            case 5: {
                const first = fetchValue(modes[0], state[inst++], state);
                if (first !== 0) {
                    inst = fetchValue(modes[1], state[inst], state) - 1;
                }
                continue;
            }
            case 6: {
                const first = fetchValue(modes[0], state[inst++], state);
                if (first === 0) {
                    inst = fetchValue(modes[1], state[inst], state) - 1;
                }
                continue;
            }
            case 7: {
                const first = fetchValue(modes[0], state[inst++], state);
                const second = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = first < second ? 1 : 0;
                continue;
            }
            case 8: {
                const first = fetchValue(modes[0], state[inst++], state);
                const second = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = first === second ? 1 : 0;
                continue;
            }
        }
    }
}

function permutations(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permutations(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}

class IOUnit {
    constructor(initialInput) {
        this.state = [...initialInput];
        this.pos = 0;
        this.isWaiting = false;
        this.signal = undefined;
    }

    write(value) {
        this.state.push(value);
        if (this.isWaiting) {
            this.signal();
            this.isWaiting = false;
            this.signal = undefined;
        }
    }

    async read() {
        if (this.pos < this.state.length) {
            return this.state[this.pos++];
        }
        if (this.isWaiting) {
            throw new Error('does not support two reads at once');
        }
        this.isWaiting = true;
        await new Promise((res) => {
            this.signal = res;
        });
        return this.state[this.pos++];
    }
}