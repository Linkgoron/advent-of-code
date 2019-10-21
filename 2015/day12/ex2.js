const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const obj = JSON.parse(data.toString());
    console.log(sumAll(obj));
});

function sumAll(obj) {
    let sum = 0;
    const isArray = Array.isArray(obj);
    const entries = Object.entries(obj);
    const hasRed = isArray ? false : entries.some(([key, val]) => val === 'red');
    if (hasRed) return 0;
    for (const [key, val] of entries) {
        if (typeof val === 'number') {
            sum += val;
        }

        if (typeof val === 'object') {
            sum += sumAll(val);
        }
    }
    return sum;
}