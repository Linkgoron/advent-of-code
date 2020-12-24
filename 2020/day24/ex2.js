const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    let allDirs = data.toString().trim().split(/\r?\n/gm).map(x => {
        const dirs = [];
        for (let i = 0; i < x.length; i++) {
            if (x[i] === 'e' || x[i] === 'w') {
                dirs.push(x[i]);
                continue;
            }
            if (x[i] === 's' || x[i] === 'n') {
                dirs.push(x[i] + x[i + 1]);
                i++;
                continue;
            }
        }
        return dirs;
    });

    let blackTiles = new Set();
    for (const dirs of allDirs) {
        const pos = { x: 0, y: 0 };
        for (const step of dirs) {
            if (step === 'e') pos.x++
            else if (step === 'w') pos.x--;
            else if (step === 'ne') { pos.x += 0.5; pos.y += 1; }
            else if (step === 'nw') { pos.x -= 0.5; pos.y += 1; }
            else if (step === 'se') { pos.x += 0.5; pos.y -= 1; }
            else if (step === 'sw') { pos.x -= 0.5; pos.y -= 1; }
        }
        if (blackTiles.has(`${pos.x},${pos.y}`)) {
            blackTiles.delete(`${pos.x},${pos.y}`);
        } else {
            blackTiles.add(`${pos.x},${pos.y}`);
        }
    }

    for (let day = 1; day < 101; day++) {
        const toConsider = new Set(blackTiles);
        const nextBlackTiles = new Set();
        for (const tile of toConsider) {
            const blackNeighbours = [...getNeighbours(tile)].filter(x => blackTiles.has(x)).length;
            const isBlack = blackTiles.has(tile);
            if (isBlack) {
                for (const item of getNeighbours(tile)) {
                    toConsider.add(item);
                }
            }
            if (isBlack && (blackNeighbours === 1 || blackNeighbours === 2)) {
                nextBlackTiles.add(tile);
                continue;
            }
            if (!isBlack && blackNeighbours === 2) {
                nextBlackTiles.add(tile);
            }
        }
        blackTiles = nextBlackTiles;
    }
    console.log(blackTiles.size);
});

function* getNeighbours(key) {
    const [x, y] = key.split(',').map(Number);
    yield `${x + 1},${y}`;
    yield `${x - 1},${y}`;
    yield `${x + 0.5},${y + 1}`;
    yield `${x - 0.5},${y + 1}`;
    yield `${x + 0.5},${y - 1}`;
    yield `${x - 0.5},${y - 1}`;
}