const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const map = data.toString().trim().split('\n').map(x => x.trim().split(''));
    let width = map[0].length;
    let height = map.length;
    const iJump = 3;
    const jJump = 1;
    let total = 0;
    for (let i = 0, j = 0; j < height; i += iJump, j += jJump) {
        const row = map[j];
        const cell = row[i % width];
        if (cell === '#') {
            total++;
        }
    }
    console.log(total);
});