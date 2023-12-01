const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const paths = data.toString().trim().split(/\r?\n/).map((row) => {
        return row.split(' -> ').map(x => x.split(',').map(Number));
    });

    const allPoints = paths.flat();
    let minX = Math.min(...allPoints.map(x => x[0]))
    let maxX = Math.max(...allPoints.map(x => x[0]))
    let maxY = Math.max(...allPoints.map(x => x[1]))

    const map = new Map();
    for (const path of paths) {
        for (let i = 0; i < path.length - 1; i++) {
            const [fromX, fromY] = path[i];
            const [toX, toY] = path[i + 1];
            if (fromX === toX) {
                const dir = fromY < toY ? 1 : -1;
                for (let i = fromY; i !== (dir + toY); i += dir) {
                    map.set(`${fromX}, ${i}`, '#');
                }
            } else {
                const dir = fromX < toX ? 1 : -1;
                for (let i = fromX; i !== (dir + toX); i += dir) {
                    map.set(`${i}, ${fromY}`, '#');
                }
            }
        }
    }

    let wasRested = true;
    let added = 0;
    while (wasRested) {
        let curX = 500;
        let curY = 0;
        wasRested = false;
        while (!wasRested && curX <= maxX && curX >= minX && curY < maxY) {
            if (!map.has(`${curX}, ${curY + 1}`)) {
                curY++;
            } else if (!map.has(`${curX - 1}, ${curY + 1}`)) {
                curX -= 1;
                curY += 1;
            } else if (!map.has(`${curX + 1}, ${curY + 1}`)) {
                curX += 1;
                curY += 1;
            } else {
                wasRested = true;
                map.set(`${curX}, ${curY}`, 'o');
                added++;
            }
        }
    }

    // printMap(map, minX, maxX, maxY);
    console.log(added);
});

function printMap(map, minX, maxX, maxY) {
    for (let y = 0; y <= maxY; y++) {
        let row = '';
        for (let x = minX; x <= maxX; x++) {
            const key = `${x}, ${y}`;
            if (map.has(key)) {
                row += map.get(key);
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
}