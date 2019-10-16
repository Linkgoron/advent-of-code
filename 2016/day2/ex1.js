const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => x.trim());
    let location = { x: 1, y: 1 };
    const map = new Map([
        ['0,0', '1'], ['1,0', '2'], ['2,0', '3'], ['0,1', '4'], ['1,1', '5'],
        ['2,1', '6'], ['0,2', '7'], ['1,2', '8'], ['2,2', '9']
    ]);

    let code = '';
    for (const steps of rows) {
        for (const dir of steps) {
            const nextPoint = {
                x: location.x + (dir === 'R' ? 1 : dir === 'L' ? -1 : 0),
                y: location.y + (dir === 'U' ? -1 : dir === 'D' ? 1 : 0)
            };
            if (map.has(`${nextPoint.x},${nextPoint.y}`)) {

                location = nextPoint;
            }
        }
        code += map.get(`${location.x},${location.y}`).toString();
    }
    console.log(code);
});