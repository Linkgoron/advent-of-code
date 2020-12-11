const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const cells = data.toString().trim().split(/\r?\n/gm).map((row, y) => {
        return row.split('').map((char, x) => ({
            isSeat: char === 'L',
            x: Number(x),
            y: Number(y),
        }));
    }).flat().filter(x => x.isSeat);
    let current = new Map(cells.map(x => [`${x.x},${x.y}`, { x: x.x, y: x.y, taken: false }]));
    let prev = new Map();

    while ([...current.keys()].some(x => !prev.get(x) || prev.get(x).taken !== current.get(x).taken)) {
        prev = current;
        current = nextStep(current);
    }

    console.log([...prev.values()].filter(x => x.taken).length);
});

function nextStep(map) {
    return new Map([...map].map(([key, value]) => {
        let alive = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const neighbour = map.get(`${value.x + i},${value.y + j}`);
                if (neighbour && neighbour.taken) {
                    alive++;
                }
            }
        }
        if ((!value.taken && alive === 0) || (alive < 4 && value.taken)) {
            return [key, { x: value.x, y: value.y, taken: true }];
        }
        return [key, { x: value.x, y: value.y, taken: false }];
    }));
}