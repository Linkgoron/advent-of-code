// // get around
// 289326-(537^2)-538=419
// // go back to the middle of the row
// 419-(538/2)=150
// // go back to the middle of the box
// 538/2=269

// 150+269.

// all in all: 419

console.log(419);

const fs = require('fs');

const coordinate = (a, b) => (2 ** a) * (3 ** b);

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const number = parseInt(data.toString());

    const grid = {};
    grid[coordinate(0, 0)] = 1;
    let x = 1;
    let y = 0;
    for (let i = 2; i < number; i++) {
        grid[coordinate(x, y)] = i;
        if (!grid[coordinate(x, y + 1)] && grid[coordinate(x - 1, y)]) {
            y++;
        } else if (!grid[coordinate(x, y + 1)] && grid[coordinate(x, y - 1)]) {
            x--;
        } else if (!grid[coordinate(x, y - 1)] && grid[coordinate(x + 1, y)]) {
            y--;
        } else if (!grid[coordinate(x + 1, y)] && grid[coordinate(x, y + 1)]) {
            x++;
        }
        // console.log(i);
    }
    console.log(Math.abs(x) + Math.abs(y));
});