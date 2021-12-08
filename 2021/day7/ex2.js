const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const positions = data.toString().trim().split(',').map(Number);
    let startPos = Math.min(...positions);
    let endPos = Math.max(...positions);
    let minPos = 0;
    let minPosSum = Number.POSITIVE_INFINITY;
    for (let i = startPos; i <= endPos; i++) {
        const curFuel = positions.reduce((agg, pos) => agg + sum(Math.abs(i - pos)), 0);
        if (curFuel < minPosSum) {
            minPos = i;
            minPosSum = curFuel;
        }
    }
    console.log(minPos, minPosSum);
});

function sum(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}