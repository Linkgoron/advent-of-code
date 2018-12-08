const fs = require('fs');

const coordinate = (a, b) => (2 ** a) * (3 ** b);

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const number = parseInt(data.toString());

    const grid = {};
    grid[coordinate(0, 0)] = 1;
    let x = 1;
    let y = 0;
    for (i = 0; i < 1000; i++) {
        const computedValue = computeValue(x, y, grid);
        grid[coordinate(x, y)] = computedValue;
        if (computedValue > number) {
            console.log(computedValue);
            return;
        }
        if (!grid[coordinate(x, y + 1)] && grid[coordinate(x - 1, y)]) {
            y++;
        } else if (!grid[coordinate(x, y + 1)] && grid[coordinate(x, y - 1)]) {
            x--;
        } else if (!grid[coordinate(x, y - 1)] && grid[coordinate(x + 1, y)]) {
            y--;
        } else if (!grid[coordinate(x + 1, y)] && grid[coordinate(x, y + 1)]) {
            x++;
        }
    }
});

function computeValue(x, y, grid) {
    // console.log("computing for ", x, y)
    let sum = 0;
    for (let i = x - 1; i < x + 2; i++) {
        for (let j = y - 1; j < y + 2; j++) {
            // console.log(x, y, grid[coordinate(i, j)]);
            sum += grid[coordinate(i, j)] || 0;
        }
    }
    return sum;
}