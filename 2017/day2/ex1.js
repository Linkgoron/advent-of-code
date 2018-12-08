const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\n').map(x => x.split('\t').map(x => parseInt(x)));
    console.log(rows);
    let checksum = 0;
    for (const row of rows) {

        const max = Math.max(...row);
        const min = Math.min(...row);
        checksum += max - min;
    }
    console.log(checksum);
});

