require('fs').readFile('./ex.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(Number);
    const printingRobot = new RobotModule(true, false);
    runProgram(startingState, printingRobot, printingRobot);
    const commands = buildPath(printingRobot.str);
    commands.push('n');
    startingState[0] = 2;
    const cleaningRobot = new RobotModule(false, false, commands);
    runProgram(startingState, cleaningRobot, cleaningRobot);
    console.log('the result is', cleaningRobot.score);
});

function buildPath(str) {
    const allData = str.split(String.fromCharCode(10))
        .map((row, rowIndex) => row.trim().split('').map((col, colIndex) => [`${colIndex},${rowIndex}`, col])).flat();
    const map = new Map(allData.filter(([coordinate, type]) => type !== '.'));
    const [startingLoc, dirStr] = [...map].find(([loc, type]) => type !== '#');
    const startDir = dirStr === '^' ? 'north' :
        dirStr === '>' ? 'east' :
            dirStr === '<' ? 'west' : 'south';
    const trip = [];
    let location = startingLoc;
    let fullDirection = getNextDir(startingLoc, map, startDir);
    while (fullDirection) {
        trip.push(fullDirection.turn);
        const direction = fullDirection.dir;
        let steps = 0;
        let nextPos = getNextDirectionPos(direction, location);
        while (map.has(nextPos)) {
            steps++;
            location = nextPos;
            nextPos = getNextDirectionPos(direction, location);
        }
        trip.push(steps);
        fullDirection = getNextDir(location, map, direction);
    }
    const fullTrip = trip.join(',');
    const res = greedyChunks(fullTrip + ',', 3);
    // remove trailing comma
    const moves = res.sort((a, b) => b.length - a.length).map(x => x.slice(0, x.length - 1));
    const item = ['A', 'B', 'C'];
    const finalString = moves.reduce((res, move, i) => res.replace(new RegExp(move, 'g'), item[i]), fullTrip);
    moves.unshift(finalString);
    return moves;
}

function greedyChunks(initString, chunksLeft) {
    if (initString.replace(/\|/g, '').length === 0) {
        return [];
    }

    if (chunksLeft === 0) {
        return false;
    }
    const fixedString = initString.replace(/\|+/g, '|');
    const startingPosition = fixedString.indexOf('|') + 1;
    const currentString = fixedString.slice(startingPosition);
    let cutPos = 0;
    while (cutPos < currentString.length) {
        if (cutPos + 1 === currentString.length) {
            return false;
        }
        const firstComma = currentString.indexOf(',', cutPos);
        const findLoc = currentString.indexOf(',', firstComma + 1);
        const grouping = currentString.slice(0, findLoc + 1);
        if (grouping.includes('|') || grouping.length > 20) {
            return false;
        }
        const newString = currentString.replace(new RegExp(grouping, 'g'), '|');
        const res = greedyChunks(newString, chunksLeft - 1);
        if (res) {
            return res.concat([grouping]);
        }
        cutPos = findLoc + 1;
    }
    return false;
}

function getNextDir(location, map, currentDirection) {
    const [x, y] = location.split(',').map(Number);
    const options = (currentDirection === 'north' || currentDirection === 'south') ? [[-1, 0], [1, 0]] : [[0, 1], [0, -1]];
    for (const [addX, addY] of options) {
        const nextPos = `${x + addX},${y + addY}`;
        if (map.has(nextPos)) {
            switch (currentDirection) {
                case 'north': return addX > 0 ? { turn: 'R', dir: 'east' } : { turn: 'L', dir: 'west' };
                case 'south': return addX > 0 ? { turn: 'L', dir: 'east' } : { turn: 'R', dir: 'west' };
                case 'west': return addY < 0 ? { turn: 'R', dir: 'north' } : { turn: 'L', dir: 'south' };
                case 'east': return addY < 0 ? { turn: 'L', dir: 'north' } : { turn: 'R', dir: 'south' };
            }
        }
    }
    return undefined;
}

function getNextDirectionPos(dir, location) {
    const [x, y] = location.split(',').map(Number);
    switch (dir) {
        case 'north': return `${x},${y - 1}`;
        case 'south': return `${x},${y + 1}`;
        case 'west': return `${x - 1},${y}`;
        case 'east': return `${x + 1},${y}`;
    }
}

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

class RobotModule {
    constructor(mode, stream, inputs) {
        this.inputState = { which: 0, location: 0 };
        this.inputs = inputs ? [...inputs] : [];
        this.mode = mode;
        this.str = "";
        this.score = 0;
        this.stream = stream;
    }

    write(value) {
        if (value < 256) {
            const letter = String.fromCharCode(value);
            if (this.stream) {
                process.stdout.write(letter);
            }
            if (this.mode) {
                this.str += letter;
            }
        } else {
            this.score = value;
        }
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
}