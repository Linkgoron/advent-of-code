const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const map = data.toString().trim().split('\n').map(x => x.trim().split(''));
    let width = map[0].length;
    let height = map.length;
    let i = 0;
    let j = 0;
    const iJump = 3;
    const jJump = 1;
    let total = 0;
    while (j !== height) {
        const row = map[j];
        const cell = row[i % width];
        if (cell === '#') {
            total++;
        }
        i += iJump;
        j += jJump;
    }
    console.log(total);
});