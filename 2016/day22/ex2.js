const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const disks = data.toString().trim().split('\r\n').slice(1).map(row => row.trim().split(/ +/g))
        .map(x => ({
            x: parseInt(x[0].split('-')[1].replace('x', '')),
            y: parseInt(x[0].split('-')[2].replace('y', '')),
            size: parseInt(x[1].replace('T', '')),
            used: parseInt(x[2].replace('T', '')),
            availiable: parseInt(x[3].replace('T', '')),
            target: false
        })).filter(disk => disk.y < 2 || (disk.x > 19 && disk.y < 15 && disk.y > 10) || disk.x === 20);


    const start = disks.filter(disk => disk.y === 0).sort((a, b) => b.x - a.x)[0];
    start.target = true;
    const initalGrid = new Map(disks.map(disk => [`${disk.x},${disk.y}`, { size: disk.size, used: disk.used, availiable: disk.availiable, target: disk.target }]));
    initalGrid.step = 0;
    const toVisit = new Set([initalGrid]);
    const history = new Set();
    let i = 0;
    let closest = start.x + start.y;
    for (const grid of toVisit) {
        const dist = [...grid].filter(x => x[1].target).map(t => t[1].x + t[1].y);;
        if (dist < closest) {
            closest = dist;
        }
        if (i++ % 50 === 0) {
            console.log(i, grid.step, closest);
        }
        if (grid.get('0,0').target) {
            console.log('DONE', grid.step);
            return;
        }

        for (const state of nextStates(grid, findStates(grid))) {
            const targetPos = [...state.entries()].filter(x => x[1].target).map(x => x[0].split(',').map(x => parseInt(x)))[0]
            const blankPos = [...state.entries()].filter(x => x[1].used === 0).map(x => x[0].split(',').map(x => parseInt(x)))[0]
            const hash = `${targetPos},${blankPos}`;
            if (!history.has(hash)) {
                history.add(hash);
                state.step = grid.step + 1;
                toVisit.add(state);
            }
        }
        toVisit.delete(grid);
    }
});

function* nextStates(grid, toMove) {
    for (const movement of toMove) {
        const actions = move(movement[0], movement[1]);
        // console.log('acts', actions)
        const nextMap = new Map(grid);
        nextMap.set(`${movement[2].x},${movement[2].y}`, actions[1]);
        nextMap.set(`${movement[3].x},${movement[3].y}`, actions[0]);
        yield nextMap;
    }
}

function move(source, sink) {
    const sourceTotal = source.availiable + source.used;
    return [{ size: source.size, used: 0, availiable: sourceTotal, target: false }, {
        size: sink.size, used: (sink.used + source.used), availiable: (sink.availiable - source.used), target: source.target
    }]
}

function* findStates(grid) {
    const stuff = [...grid.entries()].filter(x => x[1].target).map(x => x[0].split(',').map(x => parseInt(x)))[0];
    for (const [pos, disk] of grid) {
        const [x, y] = pos.split(',').map(x => parseInt(x));
        const up = grid.get(`${x},${y - 1}`);
        const canUp = up && disk.availiable >= up.used;
        if (canUp && up.used !== 0) {
            yield [up, disk, { x, y }, { x, y: y - 1 }];
        }

        const down = grid.get(`${x},${y + 1}`);
        if (down && disk.availiable >= down.used && down.used !== 0 && y < 2) {
            yield [down, disk, { x, y }, { x, y: y + 1 }];

        }

        const left = grid.get(`${x - 1},${y}`);
        if (left && disk.availiable >= left.used && left.used !== 0 && ((y < 2 || (!canUp)))) {
            yield [left, disk, { x, y }, { x: x - 1, y: y }];
        }

        const right = grid.get(`${x + 1},${y}`);
        if (right && disk.availiable >= right.used && right.used !== 0 && y < 2) {
            yield [right, disk, { x, y }, { x: x + 1, y: y }];

        }

    }
}