const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const gridSerialNumber = parseInt(data.toString());
    /** @type Map<string,{x:number,y:number} */
    let max = { x: 0, y: 0, powerLevel: -1000 };

    for (let i = 1; i < 301; i++) {
        for (let j = 1; j < 301; j++) {
            const pl = blockPowerLevel(i, j, gridSerialNumber);
            if (pl > max.powerLevel) {
                max = {
                    x: i, y: j, powerLevel: pl
                };
            }
        }
    }
    console.log(`${max.x},${max.y}`);
});

function blockPowerLevel(x, y, gridSerialNumber) {
    let sum = 0;
    for (let i = x; i <= Math.min(x + 2, 300); i++) {
        for (let j = y; j <= Math.min(y + 2, 300); j++) {
            sum += powerLevel(i, j, gridSerialNumber);
        }
    }
    return sum
}

function powerLevel(x, y, gridSerialNumber) {
    const rackId = x + 10;
    const step2 = rackId * y;
    const step3 = step2 + gridSerialNumber;
    const step4 = step3 * rackId;
    const hundredDigit = Math.floor((step4 % 1000) / 100);
    return hundredDigit - 5;
}