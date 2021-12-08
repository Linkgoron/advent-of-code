const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const positions = data.toString().trim().split(',').map(Number);
    const midPos = median(positions.sort((a, b) => a - b));
    const curFuel = positions.reduce((agg, pos) => agg + Math.abs(midPos - pos), 0);
    console.log(midPos, curFuel);
});

//assume sorted
function median(arr) {
    console.log(arr.length);
    if (arr.length % 2 === 1) {
        return arr[Math.floor(arr.length / 2)]
    }

    return (arr[Math.floor(arr.length / 2 - 1)] + arr[Math.floor(arr.length / 2)]) / 2;
}
