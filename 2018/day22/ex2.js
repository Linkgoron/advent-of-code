const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const data = rawData.toString().split("\n").map(x => x.trim().split(' ')[1]);
    const depth = parseInt(data[0]);
    const targetIndex = data[1].split(',');
    const target = { x: parseInt(targetIndex[0]), y: parseInt(targetIndex[1]) };
    const memory = {
        erosion: {},
        geological: {}
    }

    let sum = 0;
    for (let i = 0; i <= target.x; i++) {
        for (let j = 0; j <= target.y; j++) {
            sum += riskLevel(i, j, target, depth, memory);
        }
    }
    console.log(sum);
});



function geologicalIndex(x, y, target, depth, memory) {
    if (x === 0 && y === 0) return 0;
    if (target.x === x && target.y === y) return 0;
    if (y === 0) return x * 16807;
    if (x === 0) return y * 48271;
    const mem = `${x},${y}`;
    if (typeof memory.geological[mem] === 'number') {
        return memory.geological[mem];
    }
    const res = erosionLevel(x - 1, y, target, depth, memory) * erosionLevel(x, y - 1, target, depth, memory);
    memory.geological[mem] = res;
    return res;
}

function erosionLevel(x, y, target, depth, memory) {
    const mem = `${x},${y}`;
    if (typeof memory.erosion[mem] === 'number') {
        return memory.erosion[mem];
    }
    const index = geologicalIndex(x, y, target, depth, memory);
    const res = (depth + index) % 20183;
    memory.erosion[mem] = res;
    return res;
}

function pointType(x, y, target, depth, memory) {
    const erosion = erosionLevel(x, y, target, depth, memory);
    if (erosion % 3 === 0) return 'rocky';
    if (erosion % 3 === 1) return 'wet';
    if (erosion % 3 === 2) return 'narrow';
}

function riskLevel(x, y, target, depth, memory) {
    const type = pointType(x, y, target, depth, memory);
    if (type === 'rocky') return 0;
    if (type === 'wet') return 1;
    if (type === 'narrow') return 2;
}