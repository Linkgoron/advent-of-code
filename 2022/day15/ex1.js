const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rows = data.toString().trim().split('\n');
    const grid = new Map()
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].trim().split('');
        for (let j = 0; j < row.length; j++) {
            const key = getKey(i, j);
            grid.set(key, { height: Number(row[j]), key, x: i, y: j });
        }
    }

    let count = 0;
    for (const [k, point] of grid) {
        if (isVisible(point, grid, 0, rows[0].length - 1)) {
            count += 1;
        }
    }
    console.log(count);
});

function isVisible(point, grid) {
    let dirs = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
    for (const dir of dirs) {
        let loc = { x: point.x + dir.x, y: point.y + dir.y };        
        let elem = grid.get(getKey(loc.x, loc.y));
        while (elem) {
            if (point.height <= elem.height) {
                break;
            }
            loc.x = dir.x + loc.x;
            loc.y = dir.y + loc.y;
            elem = grid.get(getKey(loc.x, loc.y));
        }
        if (!elem) {
            return true;
        }
    }
    return false;
}


function getKey(x, y) {
    return `${x},${y}`;
}