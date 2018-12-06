const fs = require('fs');
fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const accum = actualInput.split('\n').map(x => parseInt(x)).reduce((acc, val) => {
        acc + val
    }, 0);
    console.log(accum);
});
