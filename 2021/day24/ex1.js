const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const commands = data.toString().trim().split(/\r?\n/gi).map(x => {
        const [command, ...args] = x.trim().split(' ');
        return {
            command,
            args: args.slice(0, 2),
        };
    });

    // 4, 8, 10-14
    let num = 52926995971999;
    let state = {
        inp: num.toString().split(''),
        inpRead: 0,
        w: 0,
        x: 0,
        y: 0,
        z: 0,
    }


    const initState = { ...state };
    delete initState.inp;
    delete initState.inpRead;
    console.log(initState);
    let i = 0;
    for (const command of commands) {
        if (command.command === 'eql' && command.args[1] !== '0') {
            const curState = { ...state };
            delete curState.inp;
            delete curState.inpRead;
            console.log(curState,++i)
        }
        moveToNextState(state, command);
        const curState = { ...state };
        delete curState.inp;
        delete curState.inpRead;
        // if (command.command === 'eql') {
        //     console.log(curState)
        // }
    }
    delete state.inp;
    delete state.inpRead;
    console.log(num, state);
});

function parseRight(state, val) {
    return ['w', 'x', 'y', 'z'].includes(val) ? state[val] : Number(val);
}
function moveToNextState(state, command) {
    const location = command.args[0];
    if (command.command === 'inp') {
        if (state.inpRead === state.inp.length) {
            throw new Error('not enough inputs');
        }
        const val = Number(state.inp[state.inpRead++]);
        state[location] = val;
        return;
    }
    const left = state[location];
    const right = parseRight(state, command.args[1]);

    switch (command.command) {
        case 'add': {
            state[location] = left + right;
            break;
        }
        case 'mul': {
            state[location] = left * right;
            break;
        }
        case 'div': {
            state[location] = Math.floor(left / right);
            break;
        }
        case 'mod': {
            state[location] = left % right;
            break;
        }
        case 'eql': {
            state[location] = left === right ? 1 : 0;
            break;
        }
    }
}