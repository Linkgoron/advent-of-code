const fs = require('fs');
fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const values = actualInput.split('\n').map(x => computeFuel(x));
    const sum = values.reduce((acc, val) => acc + val, 0);
    console.log(sum);
});

function computeFuel(value) {
    if (value <= 0) return 0;
    const val = Math.max(0, Math.floor((value / 3) - 2))
    return computeFuel(val) + val;
}