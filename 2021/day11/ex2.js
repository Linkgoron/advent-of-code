const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    let lines = data.toString().trim().split('\n').map(x => x.trim().split('').map(Number));
    let flashed = 0;
    for (let i = 0; flashed !== 100; i++) {
        const { lines: nextLines, flashed: nextFlash } = doStep(lines);
        lines = nextLines;
        flashed = nextFlash;
        if (flashed === 100) {
            console.log(i + 1);
            break;
        }
    }
});

function doStep(lines) {
    let nextLines = lines.map(line => line.slice());
    const levelNines = new Set();
    for (let x = 0; x < lines.length; x++) {
        for (let y = 0; y < lines[x].length; y++) {
            nextLines[x][y]++;
            if (nextLines[x][y] === 10) {
                levelNines.add(`${x},${y}`);
            }
        }
    }

    for (const nine of levelNines) {
        const [x, y] = nine.split(',').map(Number);
        for (const [x1, y1] of getNeighbours(x, y, lines)) {
            nextLines[x1][y1]++;
            if (nextLines[x1][y1] === 10) {
                levelNines.add(`${x1},${y1}`);
            }
        }
    }

    for (const nine of levelNines) {
        const [x, y] = nine.split(',').map(Number);
        nextLines[x][y] = 0;
    }
    return { lines: nextLines, flashed: levelNines.size };
}


function* getNeighbours(x, y, lines) {
    const rowLen = lines[0].length;
    for (let i = -1; i < 2; i++) {
        const x1 = x + i;
        if (x1 < 0 || x1 >= lines.length) continue;
        for (let j = -1; j < 2; j++) {
            const y1 = y + j;
            if (y1 < 0 || y1 >= rowLen) continue;
            if (i === 0 && j === 0) continue;
            yield [x1, y1];
        }
    }
}