const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const totalNumOfRows = 400000;
    let row = data.toString().trim();
    let trapNum = 0;
    for (let i = 0; i < totalNumOfRows; i++) {
        trapNum += row.split('').reduce((acc, x) => acc + (x === '.' ? 1 : 0), 0);
        row = nextLevel(row);
    }

    console.log(trapNum);
});

function nextLevel(level) {
    let nextLevel = '';
    for (let i = 0; i < level.length; i++) {
        if (level[i - 1] === '^' && level[i] === '^' && level[i + 1] !== '^') {
            nextLevel += '^';
            continue;
        }
        if (level[i - 1] !== '^' && level[i] === '^' && level[i + 1] === '^') {
            nextLevel += '^';
            continue;
        }

        if (level[i - 1] === '^' && level[i] !== '^' && level[i + 1] !== '^') {
            nextLevel += '^';
            continue;
        }

        if (level[i - 1] !== '^' && level[i] !== '^' && level[i + 1] === '^') {
            nextLevel += '^';
            continue;
        }
        nextLevel += '.';
    }
    return nextLevel;
}