const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const ranges = data.toString().trim().split('\r\n').map(row => row.trim().split('-')).map(part => ({
        low: parseInt(part[0]),
        high: parseInt(part[1]),
        fails(num) { return !(num >= this.low && num <= this.high) }
    })).sort((a, b) => a.low - b.low);

    for (let i = 0; i <= 4294967295; i++) {
        if (ranges.every(x => x.fails(i))) {
            console.log(i);
            return;
        }
    }
});