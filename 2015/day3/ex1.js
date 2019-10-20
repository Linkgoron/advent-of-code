const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const directions = data.toString().split('');
    const presents = new Map([[`${0},${0}`, 1]]);
    let santa = { x: 0, y: 0 };
    for (const direction of directions) {
        switch (direction) {
            case '^': {
                santa.y--;
                break;
            }
            case 'v': {
                santa.y++;
                break;
            }
            case '>': {
                santa.x++;
                break;
            }
            case '<': {
                santa.x--;
                break;
            }
        }
        const key = `${santa.x},${santa.y}`
        const prevValue = presents.get(key) || 0
        presents.set(key, prevValue + 1);
    }
    console.log(presents.size);
});