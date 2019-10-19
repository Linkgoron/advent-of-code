const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const ranges = data.toString().trim().split('\r\n').map(row => row.trim().split('-')).map(part => ({
        low: parseInt(part[0]),
        high: parseInt(part[1]),
        fails(num) { return num >= this.low && num <= this.high; }
    })).sort((a, b) => a.low - b.low);

    let total = 0;
    for (let i = 0; i <= 4294967295; i++) {
        const failedRange = ranges.find(x => x.fails(i));
        if (!failedRange) {
            total++;
        } else {
            i = failedRange.high;
        }
    }
    console.log(total);
});