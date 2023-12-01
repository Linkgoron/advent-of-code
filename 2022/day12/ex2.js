const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const map = new Map(data.toString().trim().split(/\r?\n/).map((row, i) => {
        return row.trim().split('').map((letter, j) => {
            const height = 97 - (letter === 'E' ? 'z' : letter === 'S' ? 'a' : letter).charCodeAt(0);
            const start = letter === 'E';
            const end = letter === 'a';
            return [`${j}, ${i}`, { height, start, end }];
        });
    }).flat());

    const [startKey] = [...map].find(([key, value]) => value.start);
    const visitationList = new Map([[startKey, 0]]);
    for (const [pos, steps] of visitationList) {
        const point = map.get(pos);
        if (point.end) {
            console.log(steps);
            return;
        }
        for (const neighbour of getRelevantNeighbours(pos, map, visitationList)) {
            visitationList.set(neighbour, steps + 1);
        }
    }
});

function* getRelevantNeighbours(pos, map, visited) {
    const [x, y] = pos.split(',').map(Number);
    for (const [xChange, yChange] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const key = `${x + xChange}, ${y + yChange}`;
        if (!map.has(key) || visited.has(key)) {
            continue;
        }
        const currentLocation = map.get(pos);
        const nextLocation = map.get(key);
        if (currentLocation.height + 1 >= nextLocation.height) {
            yield key;
        }
    }
}
