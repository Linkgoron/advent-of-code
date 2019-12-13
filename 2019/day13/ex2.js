require('fs').readFile('./ex2.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x));
    startingState[0] = 2;
    const gameModule = new GameModule();
    runProgram(startingState, gameModule, gameModule);
    console.log([...gameModule.state.values()].filter(x => x === 'x').length);
    // printScreen(gameModule);
    console.log(gameModule.score);
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

class GameModule {
    constructor() {
        this.state = new Map();
        this.ballLocation = { x: 0, y: 0 };
        this.tilePosition = undefined;
        this.ballDir = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        this.score = 0;
        this.writeState = 0;
    }

    write(value) {
        if (this.writeState === 0) {
            this.writeState++;
            this.x = value;
            return;
        }

        if (this.writeState === 1) {
            this.writeState++;
            this.y = value;
            return;
        }

        this.writeState = 0;
        if (this.x === -1 && this.y === 0) {
            this.score = value;
        } else {
            const tileType = this.toType(value);
            this.state.set(`${this.x},${this.y}`, tileType);
            if (tileType === 'O') {
                this.ballDir = { x: this.ballLocation.x - this.x, y: this.ballLocation.y - this.y }
                this.ballLocation = { x: this.x, y: this.y };
            }
            if (tileType === '^') {
                this.tilePosition = { x: this.x, y: this.y };
            }

            if (tileType !== ' ' && this.ballLocation && this.tilePosition) {
                this.printScreen();
            }
        }
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
        console.log('--------------------------------------');
        console.log(`SCORE:${this.score}`);
        for (let row = minY; row <= maxY; row++) {
            let str = '';
            for (let col = minX; col <= maxX; col++) {
                str += this.state.get(`${col},${row}`) || ' ';
            }
            console.log(str);
        }
    }

    toType(value) {
        switch (value) {
            case 0: return ' '
            case 1: return 'W'
            case 2: return 'x'
            case 3: return '^'
            case 4: return 'O'
        }
    }

    read() {
        // total awesome AI implementation that
        // goes in the same direction as the paddle.
        if (this.ballDir.x < 0) {
            if (this.ballLocation.x > this.tilePosition.x) {
                return 1;
            }
            if (this.ballLocation.x < this.tilePosition.x) {
                return -1;
            }
            return 0;
        }

        if (this.ballLocation.x < this.tilePosition.x) {
            return -1;
        }
        if (this.ballLocation.x < this.tilePosition.x) {
            return 1;
        }
        return 0
    }
}