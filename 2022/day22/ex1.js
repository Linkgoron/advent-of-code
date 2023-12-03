const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const [rawMap, rawPath] = data.toString().split(/\r?\n\r?\n/);
    const rawMapRows = rawMap.split(/\r?\n/);
    const map = new Map(rawMapRows.map((row, y) => {
        const chars = row.split('');
        const items = [];
        for (let x = 0; x < row.length; x++) {
            if (chars[x] === ' ') continue;
            items.push([`${x}, ${y}`, chars[x]]);
        }
        return items;
    }).flat());
    const minX = 0;
    const maxX = rawMapRows.reduce((a, b) => a > b.length ? a : b.length, 0);
    const minY = 0;
    const maxY = rawMapRows.length;
    const commands = [...rawPath.match(/\d+\D?/g)].map(x => ({
        count: x.match(/^\d+$/) ? Number(x) : Number(x.slice(0, -1)),
        turnDirection: x.match(/^\d+$/) ? undefined : x[x.length - 1],
    }))

    let state = {
        position: {
            x: rawMapRows[0].indexOf('.'),
            y: 0,
        },
        direction: 'r',
    }
    
    console.log(commands);
    for (const command of commands) {
        for (let i = 0; i < command.count; i++) {
            const nextPos = computeStep(map, state.direction, state.position);
            if (!nextPos.canMove) break;
            state.position = nextPos.position;
        }
        if (command.turnDirection) {
            state.direction = turnMap[state.direction][command.turnDirection];
        }
    }
    console.log((1000 * (state.position.y + 1)) + 4 * (1 + state.position.x) + dirMap[state.direction].score);
});

let turnMap = {
    'r': { L: 'u', R: 'd' },
    'd': { L: 'r', R: 'l' },
    'l': { L: 'd', R: 'u' },
    'u': { L: 'l', R: 'r' },
}

let dirMap = {
    'r': { xDiff: 1, yDiff: 0, score: 0, char: '>' },
    'd': { xDiff: 0, yDiff: 1, score: 1, char: 'v' },
    'l': { xDiff: -1, yDiff: 0, score: 2, char: '<' },
    'u': { xDiff: 0, yDiff: -1, score: 3, char: '^' },
}
function computeStep(map, direction, position) {
    const { x, y } = position;
    const { xDiff, yDiff } = dirMap[direction];
    const nextKey = `${x + xDiff}, ${y + yDiff}`;
    if (map.has(nextKey)) {
        const pos = map.get(nextKey);
        if (pos === '#') {
            return {
                canMove: false,
            }
        }
        return {
            canMove: true,
            position: {
                x: x + xDiff,
                y: y + yDiff
            }
        }
    }
    const xDiffOpposite = xDiff * -1;
    const yDiffOpposite = yDiff * -1;
    let stepsOpposite = 0;
    for (; map.has(`${x + (xDiffOpposite * stepsOpposite)}, ${y + (yDiffOpposite * stepsOpposite)}`); stepsOpposite++);
    const nextX = x + (xDiffOpposite * (stepsOpposite - 1));
    const nextY = y + (yDiffOpposite * (stepsOpposite - 1));

    const pos = map.get(`${nextX}, ${nextY}`);
    if (!pos) {
        throw new Error(`zzz ${nextX} ${nextY}`);
    }
    if (pos === '#') {
        return {
            canMove: false,
        }
    }
    return {
        canMove: true,
        position: {
            x: nextX,
            y: nextY,
        }
    }
}

function printMap(map, state, minX, maxX, minY, maxY) {
    for (let y = minY; y < maxY; y++) {
        let row = '';
        for (let x = minX; x < maxX; x++) {
            if (state.position.x === x && state.position.y === y) {
                row += dirMap[state.direction].char;
            } else if (map.has(`${x}, ${y}`)) {
                row += map.get(`${x}, ${y}`)
            } else {
                row += ' ';
            }
        }
        console.log(row);
    }
    console.log('----------');
}