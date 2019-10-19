const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().trim().split('\r\n').map(row => row.trim().split(' ')).map(parseCommand);
    let state = 'abcdefgh'
    for (const command of commands) {
        switch (command.command) {
            case 'swapPosition': {
                const firstLetter = state[command.firstPos];
                const secondLetter = state[command.secondPos];
                const arr = [...state];
                arr[command.secondPos] = firstLetter;
                arr[command.firstPos] = secondLetter;
                state = arr.join('');
                continue;
            }
            case 'swapLetter': {
                const firstLetterLocation = state.indexOf(command.firstLetter);
                const secondLetterLocation = state.indexOf(command.secondLetter);
                const arr = [...state];
                arr[firstLetterLocation] = command.secondLetter;
                arr[secondLetterLocation] = command.firstLetter;
                state = arr.join('');
                continue;
            }
            case 'rotateDirection': {
                if (command.direction === 'right') {
                    const arr = [...state];
                    for (var i = 0; i < command.amount; i++) {
                        arr.unshift(arr.pop());
                    }
                    state = arr.join('');
                    continue;
                }
                if (command.direction === 'left') {
                    const arr = [...state];
                    for (var i = 0; i < command.amount; i++) {
                        arr.push(arr.shift());
                    }
                    state = arr.join('');
                    continue;
                }
                throw new Error('bad direction');
            }
            case 'rotateBased': {
                const by = state.indexOf(command.letter);
                const additional = by >= 4 ? 1 : 0;
                const arr = [...state];

                for (var i = 0; i < (by + 1 + additional); i++) {
                    arr.unshift(arr.pop());
                }
                state = arr.join('');
                continue;
            }
            case 'reverse': {
                const start = command.from;
                const end = command.to;
                const toCopy = [...state.substring(start, end + 1)].reverse();
                const arr = [...state];
                for (let i = 0; i <= end - start; i++) {
                    arr[start + i] = toCopy[i];
                }
                state = arr.join('');
                continue;
            }
            case 'move': {
                const arr = [...state];
                const removed = arr.splice(command.from, 1);
                arr.splice(command.to, 0, removed[0]);
                state = arr.join('');
            }
        }
    }
    console.log(state);
});

function parseCommand(command) {
    if (command[0] === 'swap') {
        if (command[1] === 'position') {
            return {
                command: 'swapPosition',
                firstPos: parseInt(command[2]),
                secondPos: parseInt(command[5])
            }
        }
        if (command[1] === 'letter') {
            return {
                command: 'swapLetter',
                firstLetter: command[2],
                secondLetter: command[5]
            }
        }
    }
    if (command[0] === 'rotate') {
        if (command[1] === 'based') {
            return {
                command: 'rotateBased',
                letter: command[6]
            }
        }
        if (command[1] === 'left' || command[1] === 'right') {
            return {
                command: 'rotateDirection',
                direction: command[1],
                amount: parseInt(command[2])
            }
        }
    }
    if (command[0] === 'move') {
        return {
            command: 'move',
            from: parseInt(command[2]),
            to: parseInt(command[5]),
        }
    }
    if (command[0] === 'reverse') {
        return {
            command: 'reverse',
            from: parseInt(command[2]),
            to: parseInt(command[4]),
        }
    }
    console.log(command);
    throw new Error(`failed to parse command ${command}`);
}