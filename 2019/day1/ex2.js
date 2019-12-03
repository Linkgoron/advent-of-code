const fs = require('fs');
fs.readFile('./ex2.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const values = actualInput.split('\n').map(computeFuel);
    const sum = values.reduce((acc, val) => acc + val, 0);
    console.log(sum);
});

function computeFuel(value) {
    const fuel = Math.max(0, Math.floor((value / 3) - 2));
    if (fuel <= 0) return 0;    
    return computeFuel(fuel) + fuel;
}