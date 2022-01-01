const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const [rawDots, rawFolds] = data.toString().trim().split('\n\n');
    const dots = rawDots.split('\n').map(x => x.trim()).map(dot => {
        const [x, y] = dot.split(',').map(Number);
        return {
            x, y
        };
    })
    const folds = rawFolds.split('\n').map(x => x.slice('fold along '.length)).map(fold => {
        const [dir, value] = fold.split('=');
        return {
            dir,
            location: Number(value),
        }
    });

    const map = new Set();
    let maxX = 0;
    let maxY = 0;
    for (const dot of dots) {
        map.add(`${dot.x},${dot.y}`);
        if (dot.x > maxX) {
            maxX = dot.x;
        }
        if (dot.y > maxY) {
            maxY = dot.y;
        }
    }
    const state = {
        x: maxX,
        y: maxY,
        map,
    }

    let st = state;
    for (const folding of folds) {
        st = fold(st, folding);
    }
    printState(st);
});

function printState(state) {
    for (let i = 0; i <= state.y; i++) {
        let row = ''
        for (let j = 0; j <= state.x; j++) {
            const letter = state.map.has(`${j},${i}`) ? '#' : '.';
            row += letter;
        }
        console.log(row);
    }
}

function fold(state, command) {
    if (command.dir === 'y') {
        const nextState = {
            x: state.x,
            y: command.location - 1,
            map: new Set(),
        }
        for (let i = 0; i <= nextState.y; i++) {
            for (let j = 0; j <= nextState.x; j++) {
                const diff =  command.location - i;
                let isOn = state.map.has(`${j},${i}`) || state.map.has(`${j},${command.location + diff}`)
                if (isOn) {
                    nextState.map.add(`${j},${i}`);
                }
            }
        }
        return nextState;
    }

    const nextState = {
        x: command.location - 1,
        y: state.y,
        map: new Set(),
    }
    for (let i = 0; i <= nextState.y; i++) {
        for (let j = 0; j <= nextState.x; j++) {
            const diff =  command.location - j;
            let isOn = state.map.has(`${j},${i}`) || state.map.has(`${command.location + diff},${i}`)
            if (isOn) {
                nextState.map.add(`${j},${i}`);
            }
        }
    }
    return nextState;
    
}