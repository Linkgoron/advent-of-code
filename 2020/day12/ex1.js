const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const commands = data.toString().trim().split(/\r?\n/gm).map((row, y) => {
        return {
            action: row[0],
            steps: Number(row.slice(1)),
        }
    });
    let state = {
        x: 0,
        y: 0,
        facing: 'E',
    };
    for (const command of commands) {
        const next = nextState(command, state);
        state = next;
    }
    console.log(Math.abs(state.x) + Math.abs(state.y))
});

function nextState(command, state) {
    const dirs = ['N', 'E', 'S', 'W'];
    switch (command.action) {
        case 'F':
        case 'N':
        case 'S':
        case 'E':
        case 'W': return {
            ...changeForDir(command, state),
            facing: state.facing,
        }
        case 'L': {
            const currentPos = dirs.indexOf(state.facing);
            const dirShift = command.steps / 90;
            const nextDir = dirs[mod(currentPos - dirShift, dirs.length)];
            return {
                x: state.x,
                y: state.y,
                facing: nextDir,
            }
        }
        case 'R': {
            const currentPos = dirs.indexOf(state.facing);
            const dirShift = (command.steps / 90);
            const nextDir = dirs[(currentPos + dirShift) % 4];
            return {
                x: state.x,
                y: state.y,
                facing: nextDir,
            }
        }
    }
}

function mod(num,target) {
    return ((num%target)+target)%target;

}

function changeForDir(command, state) {
    switch (command.action) {
        case 'N': return {
            x: state.x,
            y: state.y - command.steps,
        }
        case 'S': return {
            x: state.x,
            y: state.y + command.steps,
        }
        case 'E': return {
            x: state.x + command.steps,
            y: state.y,
        }
        case 'W': return {
            x: state.x - command.steps,
            y: state.y,
        }
        case 'F': return changeForDir({ action: state.facing, steps: command.steps }, state);
    }
}