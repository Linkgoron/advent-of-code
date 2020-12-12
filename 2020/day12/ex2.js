const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const commands = data.toString().trim().split(/\r?\n/gm).map((row, y) => {
        return {
            action: row[0],
            steps: Number(row.slice(1)),
        }
    });
    let state = {
        x: 10,
        y: -1,
        shipX: 0,
        shipY: 0
    };
    for (const command of commands) {
        const next = nextState(command, state);
        state = next;
    }
    console.log(Math.abs(state.shipX) + Math.abs(state.shipY))
});

function nextState(command, state) {
    switch (command.action) {
        case 'F': return {
            x: state.x,
            y: state.y,
            shipX: state.shipX + command.steps * state.x,
            shipY: state.shipY + command.steps * state.y,
        }
        case 'N':
        case 'S':
        case 'E':
        case 'W': return {
            ...changeForDir(command, state),
            shipX: state.shipX,
            shipY: state.shipY,
        }
        case 'L': {
            const degrees = (command.steps % 360);
            return {
                ...rotate(360 - degrees, state),
                shipX: state.shipX,
                shipY: state.shipY,
            }
        }
        case 'R': {
            const degrees = (command.steps % 360);
            return {
                ...rotate(degrees, state),
                shipX: state.shipX,
                shipY: state.shipY,
            }
        }
    }
}

function rotate(degrees, state) {
    switch (degrees) {
        case 90: return {
            x: -state.y,
            y: state.x,
        }
        case 180: return {
            x: -state.x,
            y: -state.y,
        }
        case 270: return {
            x: state.y,
            y: -state.x,
        }
        case 360: return {
            x: state.x,
            y: state.y,
        }
    }
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
    }
}