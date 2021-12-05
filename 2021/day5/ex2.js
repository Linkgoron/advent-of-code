const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split('\n').map(x => x.split(' -> ').map(coordinates => {
        const [x, y] = coordinates.trim().split(',');
        return {
            x: Number(x),
            y: Number(y),
        }
    })).map(([start, end]) => ({
        start,
        end,
        xDir: (start.x === end.x ? 0 : ((start.x > end.x) ? -1 : 1)),
        yDir: (start.y === end.y ? 0 : (((start.y > end.y) ? -1 : 1))),
        dist: Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y)),
    }));
    // console.log(lines);
    let marked = new Map();
    for (const line of lines) {
        let currentX = line.start.x;
        let currentY = line.start.y;
        for (let i = 0; i <= line.dist; i++) {
            const coordinate = `${currentX},${currentY}`;
            const currentValue = marked.get(coordinate) || 0;
            marked.set(coordinate, currentValue + 1);
            currentX += line.xDir;
            currentY += line.yDir;
        }
    }

    let minX = 0;
    let maxX = lines.map(line => Math.max(line.start.x, line.end.x)).reduce((agg, cur) => Math.max(agg, cur), 0);
    let minY = 0;
    let maxY = lines.map(line => Math.max(line.start.y, line.end.y)).reduce((agg, cur) => Math.max(agg, cur), 0);
    for (let y = 0; y <= maxY; y++) {
        let str = '';
        const currentY = minY + y;
        for (let x = 0; x <= maxX; x++) {
            const currentX = minX + x;
            const coordinate = `${currentX},${currentY}`;
            const currentValue = marked.get(coordinate) || '.';
            str += currentValue.toString();
        }
        // console.log(str);
    }
    console.log([...marked.values()].filter(x => x >= 2).length);
});