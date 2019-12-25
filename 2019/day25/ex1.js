const readline = require('readline');
require('fs').readFile('./ex.input', async (err, data) => {
    const startingState = data.toString().trim().split(',').map(Number);
    const robot = new DroidModule();
    await runProgram(startingState, robot, robot);
    // items were:
    // - tambourine
    // - astronaut ice cream
    // - mutex
    // - easter egg
});

async function runProgram(startingState, input, output) {
    const state = [...startingState];
    let relative = 0;
    for (let inst = 0; inst < state.length; inst++) {
        const totalCommand = state[inst++];
        const command = totalCommand % 100;
        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 99].includes(command)) {
            console.error('bad op-code', inst - 1, totalCommand, command);
            throw new Error('bad op code');
        }

        if (command === 99) {
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
                continue
            }
            case 2: {
                const left = fetchValue(modes[0], state[inst++], state);
                const right = fetchValue(modes[1], state[inst++], state);
                const writePos = getWritePosition(modes[2], inst, state);
                state[writePos] = left * right;
                continue
            }
            case 3: {
                const writePos = getWritePosition(modes[0], inst, state);
                state[writePos] = await input.read();
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
                const writePos = getWritePosition(modes[2], inst, state);
                state[writePos] = first < second ? 1 : 0;
                continue;
            }
            case 8: {
                const first = fetchValue(modes[0], state[inst++], state);
                const second = fetchValue(modes[1], state[inst++], state);
                const writePos = getWritePosition(modes[2], inst, state);
                state[writePos] = first === second ? 1 : 0;
                continue;
            }
            case 9: {
                const value = fetchValue(modes[0], state[inst], state);
                relative += value;
                continue;
            }
        }
    }
}
class DroidModule {
    constructor(io) {
        this.interface = io;
        this.currentOutput = { pos: 0, content: '' };
    }

    write(value) {
        const letter = String.fromCharCode(value);
        process.stdout.write(letter);
    }

    async read() {
        if (this.currentOutput.pos < this.currentOutput.content.length) {
            return this.currentOutput.content.charCodeAt(this.currentOutput.pos++);
        }
        let resp = await new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            let response;
            rl.on('line', (userInput) => {
                response = userInput;
                rl.close();
            });

            rl.on('close', () => {
                resolve(response + '\n');
            });
        });
        if(resp === 'exit\n') {
            process.exit(0);
        }
        this.currentOutput = { pos: 0, content: resp };
        return this.currentOutput.content.charCodeAt(this.currentOutput.pos++);
    }
}