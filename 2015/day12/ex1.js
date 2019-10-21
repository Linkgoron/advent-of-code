const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const obj = JSON.parse(data.toString());
    console.log(sumAll(obj));
});

function sumAll(obj) {
    let sum = 0;
    for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'number') {
            sum += val;
        }

        if (typeof val === 'object') {
            sum += sumAll(val);
        }
    }
    return sum;
}