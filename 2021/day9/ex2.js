const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split('\n').map(x => {
        const numbers = x.trim().split('').map(Number);
        return numbers;
    });
    const localMin = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            if (isLocalMinimum(i, j, lines)) {
                localMin.push({ x: i, y: j, value: lines[i][j] });
            }
        }
    }
    console.log(localMin.map(point => findBasin(point, lines)).sort((a, b) => (b - a)).slice(0, 3)
        .reduce((agg, cur) => agg * cur, 1));
});

function* getNeighbours(i, j, lines) {
    let points = [[i, j - 1], [i, j + 1], [i - 1, j], [i + 1, j]];
    for (const point of points) {
        const [x, y] = point;
        if (!lines[x] || typeof lines[x][y] !== 'number') {
            continue;
        }

        yield { x, y, value: lines[x][y] };
    }
}

function isLocalMinimum(i, j, lines) {
    let value = lines[i][j];
    for (const point of getNeighbours(i, j, lines)) {
        if (value >= point.value) {
            return false;
        }
    }
    return true;
}

function canonical(point) {
    return `${point.x},${point.y}`
}

function findBasin(lowPoint, lines) {
    const found = new Set([canonical(lowPoint)]);
    const toVisit = new Set([lowPoint]);
    let basinSize = 0;
    for (const point of toVisit) {
        basinSize++;
        for (const neighbour of getNeighbours(point.x, point.y, lines)) {
            if (neighbour.value === 9) {
                continue;
            }
            if (!found.has(canonical(neighbour))) {
                found.add(canonical(neighbour));
                toVisit.add(neighbour);
            }
        }
    }
    return basinSize;
}