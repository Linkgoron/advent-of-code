const fs = require('fs');

const rowCount = 6;
const colCount = 50;

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().split('\r\n').map(x => x.trim());
    const map = new Map();

    for (const word of words) {
        const commands = word.split(' ');
        if (commands[0] === 'rect') {
            const [x, y] = commands[1].split('x').map(x => parseInt(x));
            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    map.set(`${i % colCount},${j % rowCount}`, 1);
                }
            }
        }

        if (commands[1] === 'row') {
            const row = parseInt(commands[2].split('=')[1]) % rowCount;
            const amount = parseInt(commands[4]);
            let arr = new Array(colCount);
            for (let i = 0; i < colCount; i++) {
                arr[(i + amount) % colCount] = map.get(`${i},${row}`) || 0;
            }
            for (let i = 0; i < colCount; i++) {
                map.set(`${i},${row}`, arr[i]);
            }
        }

        if (commands[1] === 'column') {
            const column = parseInt(commands[2].split('=')[1]) %  colCount;
            const amount = parseInt(commands[4]);
            let arr = new Array(rowCount);
            for (let j = 0; j < rowCount; j++) {
                arr[(j + amount) % rowCount] = map.get(`${column},${j}`) || 0;
            }
            for (let j = 0; j < rowCount; j++) {
                map.set(`${column},${j}`, arr[j]);
            }
        }
    }

    const on = [...map.values()].filter(x => x === 1).length;
    console.log(on);
});