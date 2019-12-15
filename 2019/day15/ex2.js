require('fs').readFile('./ex.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x))
    const robot = new RobotModule();
    runProgram(startingState, robot, robot);
    const [point] = robot.oxygenLocation();
    const visited = new Set([point]);
    const toVisit = new Set([{ point, steps: 0 }]);

    for (const { point: curPoint, steps } of toVisit) {
        const [x, y] = curPoint.split(',').map(Number);
        for (const dir of Object.values(Directions)) {
            const { pos, isWall } = robot.getElementInDirection({ x, y }, dir, robot.state);
            if (!isWall && !visited.has(`${pos.x},${pos.y}`)) {
                visited.add(`${pos.x},${pos.y}`)
                toVisit.add({ point: `${pos.x},${pos.y}`, steps: steps + 1 });
            }
        }

    }
    console.log(Math.max(...[...toVisit].map(x => x.steps)));
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
        this.movementStack = [{ x: 0, y: 0, moved: undefined, back: undefined, steps: 0 }];
        this.writeState = 0;
    }

    write(value) {
        let sourceState = this.movementStack[this.movementStack.length - 1];
        let { pos, isKnown } = this.getElementInDirection(sourceState, sourceState.moved);
        if (isKnown) {
            return;
        }

        if (value === 0) {
            this.state.set(`${pos.x},${pos.y}`, '#');
            return;
        }

        this.movementStack.push({ ...pos, moved: undefined, back: From[sourceState.moved], steps: sourceState.steps + 1 });
        if (value === 1) {
            this.state.set(`${pos.x},${pos.y}`, '.');
        } else {
            this.state.set(`${pos.x},${pos.y}`, 'x');
        }
    }


    read() {
        let currentState = this.movementStack.pop();
        if (this.movementStack.moved === Directions.East) {
            return this.movementStack.from;
        }
        if (currentState.moved === undefined) {
            currentState.moved = Directions.North;
            let { isKnown } = this.getElementInDirection(currentState, Directions.North);
            if (!isKnown) {
                this.movementStack.push(currentState);
                return Directions.North;
            }
        }

        if (currentState.moved === Directions.North) {
            currentState.moved = Directions.East;
            let { isKnown } = this.getElementInDirection(currentState, Directions.East);
            if (!isKnown) {
                this.movementStack.push(currentState);
                return Directions.East;
            }
        }
        if (currentState.moved === Directions.East) {
            currentState.moved = Directions.South;
            let { isKnown } = this.getElementInDirection(currentState, Directions.South);
            if (!isKnown) {
                this.movementStack.push(currentState);
                return Directions.South;
            }
        }

        if (currentState.moved === Directions.South) {
            currentState.moved = Directions.West;
            let { isKnown } = this.getElementInDirection(currentState, Directions.West);
            if (!isKnown) {
                this.movementStack.push(currentState);
                return Directions.West;
            }
        }
        if (currentState.back === undefined) {
            return 5;
        }
        return currentState.back;
    }

    getElementInDirection(position, direction) {
        let toGo = { x: position.x, y: position.y };
        switch (direction) {
            case Directions.North: {
                toGo.y--;
                break;
            }
            case Directions.South: {
                toGo.y++;
                break;
            }
            case Directions.West: {
                toGo.x--;
                break;
            }
            case Directions.East: {
                toGo.x++;
                break;
            }
        }

        const shape = this.state.get(`${toGo.x},${toGo.y}`);
        const isWall = shape === '#';
        const isKnown = this.state.has(`${toGo.x},${toGo.y}`);
        return { pos: toGo, isKnown, isWall, shape };
    }

    oxygenLocation() {
        return [...this.state].find(([loc, type]) => type === 'x');
    }

    printScreen() {
        const elems = [...this.state].map(([coords, _]) => {
            const [x, y] = coords.split(',');
            return { x: parseInt(x), y: parseInt(y) }
        });
        const maxX = elems.reduce((res, cur) => (cur.x > res) ? cur.x : res, 0);
        const minX = elems.reduce((b, a) => a.x < b ? a.x : b, 0);
        const maxY = elems.reduce((b, a) => a.y > b ? a.y : b, 0);
        const minY = elems.reduce((b, a) => a.y < b ? a.y : b, 0);

        console.log('');
        for (let row = minY; row <= maxY; row++) {
            let str = '';
            for (let col = minX; col <= maxX; col++) {
                str += this.state.get(`${col},${row}`) || ' ';
            }
            console.log(str);
        }
    }
}