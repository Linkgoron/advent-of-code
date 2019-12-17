require('fs').readFile('./ex.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x));
    const robot = new RobotModule();
    runProgram(startingState, robot, robot);
});

function runProgram(startingState, input, output) {
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
                const readValue = input.read();
                state[writePos] = readValue;
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

const Directions = {
    North: 1,
    South: 2,
    West: 3,
    East: 4
}

const From = {
    [Directions.North]: Directions.South,
    [Directions.South]: Directions.North,
    [Directions.West]: Directions.East,
    [Directions.East]: Directions.West
}

class RobotModule {
    constructor() {
        this.state = new Map([[`${0},${0}`, 'S']]);
        this.str = "";
        this.inputState = { which: 0, location: 0 };
        this.inputs = {
            0: "A,B,A,B,A,C,A,C,B,C",
            1: "R,6,L,10,R,10,R,10",
            2: "L,10,L,12,R,10",
            3: "R,6,L,12,L,10",
            4: "n"
        }
    }

    write(value) {
        console.log(value);
    }


    read() {
        const currentInput = this.inputs[this.inputState.which];
        if (currentInput.length === this.inputState.location) {
            this.inputState.which++;
            this.inputState.location = 0;
            // new line
            return 10;
        }
        const ret = currentInput.charCodeAt(this.inputState.location++);
        return ret;
    }

    inputsDone() {
        return this.inputState.which === 5;
    }
}

// 1: "R,6,L,10,R,10,R,10,L,10",
// ,L12,R,10,R,6,L,10,R,10,R,10,L,12,R,10,R,6,L,10,R,10,R,10,R,6,L,12,L,10,R,6,L,10,R,10,R,10,R,6,L,10,L,10,L,10,L,12,R,10,R,6,L,10,L,10