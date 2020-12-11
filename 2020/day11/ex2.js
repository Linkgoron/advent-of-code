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
    const maxX = Math.max(...[...map.values()].map(x => x.x));
    const maxY = Math.max(...[...map.values()].map(x => x.y));
    return new Map([...map].map(([key, value]) => {
        let alive = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dirX, dirY] of dirs) {
            let seenX = value.x + dirX;
            let seenY = value.y + dirY;
            while (seenX >= 0 && seenY >= 0 && seenX <= maxX && seenY <= maxY && !map.get(`${seenX},${seenY}`)) {
                seenX += dirX;
                seenY += dirY;
            }
            const neighbour = map.get(`${seenX},${seenY}`);
            if (neighbour && neighbour.taken) {
                alive++;
            }
        }
        if ((!value.taken && alive === 0) || (alive < 5 && value.taken)) {
            return [key, { x: value.x, y: value.y, taken: true }];
        }
        return [key, { x: value.x, y: value.y, taken: false }];
    }));
}