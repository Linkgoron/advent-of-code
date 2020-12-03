const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const map = data.toString().trim().split('\n').map(x => x.trim().split(''));
    const jumpTypes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
    const treeNums = jumpTypes.map(([iJump, jJump]) => calcSlope(iJump, jJump, map));
    console.log(treeNums.reduce((prev, cur) => prev * cur));
});

function calcSlope(iJump, jJump, map) {
    let width = map[0].length;
    let height = map.length;
    let total = 0;
    for (let i = 0, j = 0; j < height; i += iJump, j += jJump) {
        const row = map[j];
        const cell = row[i % width];
        if (cell === '#') {
            total++;
        }
    }
    return total;
}