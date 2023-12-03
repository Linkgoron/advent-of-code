const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const elves = data.toString().trim().split(/\r?\n/).map((row, y) => {
        return row.trim().split('').map((char, x) => {
            if (char === '.') return;
            return {
                x: x,
                y: y,
            }
        }).filter(Boolean)
    }).flat();

    let dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (let i = 0; i < 1000; i++) {
        const takenPositions = new Set(elves.map(elf => `${elf.x}, ${elf.y}`));
        const wantedPositions = new Map();
        for (const elf of elves) {
            const hasNeighbours = [...besidesPositions(elf)].some(x => takenPositions.has(`${x.x}, ${x.y}`));
            if (!hasNeighbours) continue;
            for (const [xDiff, yDiff] of dirs) {
                const nextX = elf.x + xDiff;
                const nextY = elf.y + yDiff;
                const suggestion = `${nextX}, ${nextY}`;
                const neighbours = [suggestion, `${nextX + yDiff}, ${nextY + xDiff}`, `${nextX - yDiff}, ${nextY - xDiff}`]
                if (neighbours.every(x => !takenPositions.has(x))) {
                    if (!wantedPositions.has(suggestion)) {
                        wantedPositions.set(suggestion, []);
                    }
                    wantedPositions.get(suggestion).push([elf, { x: nextX, y: nextY }]);
                    break;
                }
            }
        }
        let wasMovement = false;
        for (const [key, value] of wantedPositions) {
            if (value.length > 1) continue;
            wasMovement = true;
            const [elf, newPos] = value[0];
            elf.x = newPos.x;
            elf.y = newPos.y;
        }
        if (!wasMovement) {
            console.log(i + 1);
            return;
        }
        const prevFirstDir = dirs.shift();
        dirs.push(prevFirstDir);
    }
    // boxSize(elves);
});


function* besidesPositions(elf) {
    for (let xDiff = -1; xDiff <= 1; xDiff++) {
        for (let yDiff = -1; yDiff <= 1; yDiff++) {
            if (xDiff === 0 && yDiff === 0) continue;
            yield { x: elf.x + xDiff, y: elf.y + yDiff }
        }
    }
}
function boxSize(elves) {
    let maxX = elves.reduce((a, b) => a > b.x ? a : b.x, elves[0].x)
    let minX = elves.reduce((a, b) => a < b.x ? a : b.x, elves[0].x)
    let maxY = elves.reduce((a, b) => a > b.y ? a : b.y, elves[0].y)
    let minY = elves.reduce((a, b) => a < b.y ? a : b.y, elves[0].y)
    console.log('vals', maxY, minY, maxX, minX, (maxY - minY + 1), (maxX - minX + 1));
    const size = (maxY - minY + 1) * (maxX - minX + 1) - elves.length;
    console.log(elves, size);
}

function printIt(elves) {
    console.log('--------')
    let maxX = elves.reduce((a, b) => a > b.x ? a : b.x, elves[0].x);
    let minX = elves.reduce((a, b) => a < b.x ? a : b.x, elves[0].x);
    let maxY = elves.reduce((a, b) => a > b.y ? a : b.y, elves[0].y);
    let minY = elves.reduce((a, b) => a < b.y ? a : b.y, elves[0].y);
    const takenPositions = new Set(elves.map(elf => `${elf.x}, ${elf.y}`));
    console.log(elves);
    for (let y = minY - 1; y <= maxY + 1; y++) {
        let row = '';
        for (let x = minX - 1; x <= maxX + 1; x++) {
            if (takenPositions.has(`${x}, ${y}`)) {
                row += '#';
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
    console.log('--------')
}

// too high 14944