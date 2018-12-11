const fs = require('fs');


fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const gridSerialNumber = parseInt(data.toString());

    let max = null;
    for (let i = 1; i < 301; i++) {
        for (let j = 1; j < 301; j++) {
            const curMax = blockPowerLevel(i, j, gridSerialNumber);
            if (max === null || curMax.max > max.max) {
                max = curMax;
            }

        }
    }
    console.log(`${max.x},${max.y},${max.size}`);
});


function blockPowerLevel(x, y, gridSerialNumber) {
    let max = powerLevel(x, y, gridSerialNumber);
    let size = 1;
    let sum = max;
    for (let squareSize = 2; squareSize <= Math.min(301 - x, 301 - y); squareSize++) {
        const diff = squareSize - 1;
        for (let l = x; l <= Math.min(x + diff, 300); l++) {
            if (y + diff <= 300) {
                sum += powerLevel(l, y + diff, gridSerialNumber);
            }
        }
        for (let m = y; m <= Math.min(y + diff, 300); m++) {
            // prevent double counting.
            if (x + diff < 300) {
                sum += powerLevel(x + diff, m, gridSerialNumber);
            }
        }
        if (sum > max) {
            max = sum;
            size = squareSize;
        }
    }
    return {
        x, y, max, size
    };
}

function powerLevel(x, y, gridSerialNumber) {
    const rackId = x + 10;
    const step2 = rackId * y;
    const step3 = step2 + gridSerialNumber;
    const step4 = step3 * rackId;
    const hundredDigit = Math.floor((step4 % 1000) / 100);
    return hundredDigit - 5;
}