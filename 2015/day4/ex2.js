const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const directions = data.toString().split('');
    const presents = new Map([[`${0},${0}`, 2]]);
    let santa = { x: 0, y: 0 };
    let robo = { x: 0, y: 0 };
    for (const [direction, i] of directions.map((x, i) => [x, i])) {
        let location = i % 2 === 0 ? santa : robo;
        switch (direction) {
            case '^': {
                location.y--;
                break;
            }
            case 'v': {
                location.y++;
                break;
            }
            case '>': {
                location.x++;
                break;
            }
            case '<': {
                location.x--;
                break;
            }
        }
        const key = `${location.x},${location.y}`
        const prevValue = presents.get(key) || 0
        presents.set(key, prevValue + 1);
    }
    console.log(presents.size);
});