const fs = require('fs');
const _ = require('lodash');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const gridSerialNumber = parseInt(data.toString());

    let max = { x: 0, y: 0, powerLevel: -1000 };
    const cache = new Map();
    for (let squareSize = 1; squareSize < 301; squareSize++) {
        console.log(squareSize);
        for (let i = 1; i < 301; i++) {
            for (let j = 1; j < 301; j++) {
                const squarePowerLevel = blockPowerLevel(i, j, gridSerialNumber, squareSize, cache);
                cache.set(coordinate(i, j, squareSize), squarePowerLevel);
                if (squarePowerLevel > max.powerLevel) {
                    max = {
                        x: i, y: j, powerLevel: squarePowerLevel, squareSize: squareSize
                    };
                }
            }
        }

        if (squareSize > 2) {
            for (let i = 1; i < 301; i++) {
                for (let j = 1; j < 301; j++) {                    
                    cache.delete(coordinate(i, j, squareSize - 1));
                }
            }
        }
    }
    console.log(`${max.x},${max.y},${max.squareSize}`);
});


function blockPowerLevel(x, y, gridSerialNumber, squareSize, cache) {

    const diff = squareSize - 1;
    const smallerSquare = cache.get(coordinate(x, y, squareSize - 1)) || 0;
    let sum = 0;
    for (let i = x; i <= Math.min(x + diff, 300); i++) {
        if (y + diff < 300) {
            sum += powerLevel(i, y + diff, gridSerialNumber);
        }
    }
    for (let j = y; j <= Math.min(y + diff, 300); j++) {
        if (x + diff < 300) {
            sum += powerLevel(x + diff, j, gridSerialNumber);
        }
    }
    return smallerSquare + sum;
}

const coordinate = (a, b, c) => `${a}-${b}-${c}`;


function powerLevel(x, y, gridSerialNumber) {
    const rackId = x + 10;
    const step2 = rackId * y;
    const step3 = step2 + gridSerialNumber;
    const step4 = step3 * rackId;
    const hundredDigit = Math.floor((step4 % 1000) / 100);
    return hundredDigit - 5;
}