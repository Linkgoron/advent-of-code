const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => x.trim());
    let location = { x: 1, y: 1 };
    const map = new Map([
        ['2,0', '1'], ['1,1', '2'], ['2,1', '3'], ['3,1', '4'], ['0,2', '5'],
        ['1,2', '6'], ['2,2', '7'], ['3,2', '8'], ['4,2', '9'], ['1,3', 'A'],
        ['2,3', 'B'], ['3,3', 'C'], ['2,4', 'D']
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
        code += map.get(`${location.x},${location.y}`);
    }
    console.log(code);
});