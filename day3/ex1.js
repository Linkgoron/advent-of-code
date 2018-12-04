const fs = require('fs');
const _ = require('lodash');

fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const cuts = actualInput.split('\n').map(x => x.trim()).map(x => {
        const vals = x.split(' ');
        const leftTrim = parseInt(vals[2].split(',')[0]);
        const upTrim = parseInt(vals[2].split(',')[1]);
        const width = parseInt(vals[3].split('x')[0]);
        const height = parseInt(vals[3].split('x')[1]);
        return {
            id: vals[0].substring(1),
            leftTrim, upTrim, width, height
        };
    });

    const map = {};
    for (const val of cuts) {
        
        for (let currentCol = val.leftTrim; currentCol < val.leftTrim + val.width; currentCol++) {
            for (let currentRow = val.upTrim; currentRow < val.upTrim + val.height; currentRow++) {
                if (map[currentCol] === undefined) {
                    map[currentCol] = {};
                }
                const curColObject = map[currentCol];
                if (curColObject[currentRow] === undefined) {
                    curColObject[currentRow] = 0;
                }

                curColObject[currentRow]++;
            }
        }

    }    
    console.log(Object.values(map).map(val => Object.values(val).filter(x => x > 1).length).reduce((acc, val) => acc + val, 0));

});
