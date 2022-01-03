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
                localMin.push(lines[i][j]);
            }
        }
    }
    console.log(localMin.reduce((agg, cur) => agg + cur + 1, 0));
});

function isLocalMinimum(i, j, lines) {
    let points = [[i, j - 1], [i, j + 1], [i - 1, j], [i + 1, j]];
    let value = lines[i][j];
    for (const point of points) {
        const [x, y] = point;
        if (!lines[x]) {
            continue;
        }
        const neighbour = lines[x][y];
        if (typeof neighbour === 'number' && value >= neighbour) {
            return false;
        }
    }
    return true;
}