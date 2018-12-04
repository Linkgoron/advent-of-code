const fs = require('fs');
const set = new Set();
set.add(0);
const found = false;
fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const accum = actualInput.split('\n').map(x => parseInt(x)).reduce((acc, val) => {
        const currentFrequency = acc + val;
        if (set.has(currentFrequency)) {
            if (!found) {
                found = true;
                console.log('found double!', currentFrequency);
            }
        } else if (!found) {
            set.add(currentFrequency);
        }
    }, 0);
    console.log(accum);
});
