const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const positions = data.toString().trim().split(',').map(Number);
    const sum = positions.reduce((agg, pos) => agg + pos, 0);
    const avg = sum / positions.length;
    const options = [Math.floor(avg), Math.ceil(avg)];
    const [min, fuel] = findMin(options, positions);
    console.log(min, fuel);
});

function findMin([opt1, opt2], positions) {
    const fuel1 = positions.reduce((agg, pos) => agg + sum(Math.abs(opt1 - pos)), 0);
    if (opt1 === opt2) {
        return [opt1, fuel1];
    }

    const fuel2 = positions.reduce((agg, pos) => agg + sum(Math.abs(opt2 - pos)), 0);
    if (fuel1 <= fuel2) {
        return [opt1, fuel1]
    }
    return [opt2, fuel2];
}

function sum(n) {
    return (1 + n) * n / 2;
}