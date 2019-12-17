require('fs').readFile('./ex.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x));
    const robot = new RobotModule();
    runProgram(startingState, robot, robot);
    let allData = robot.str.split(String.fromCharCode(10)).map((row, rowIndex) => row.split('').map((col, colIndex) => [`${rowIndex},${colIndex}`, col])).flat();
    let map = new Map(allData.filter(([coordinate, type]) => type !== '.'));
    let calib = 0;
    for (let [key, value] of map) {
        let [x, y] = key.split(',').map(Number);
        let neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        if (neighbours.every(([nx, ny]) => map.has(`${x + nx},${y + ny}`))) {
            calib += x * y;
        }
    }
    console.log(calib);
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
                state[writePos] = input.read();
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
    }

    write(value) {
        this.str += String.fromCharCode(value);
    }


    read() {

    }
}