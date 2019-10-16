const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => x.trim()).map(x => x.split('  ').map(x => parseInt(x)));
    const possible = rows.filter(x => (x[0] + x[1] > x[2]) && (x[0] + x[2] > x[1]) && (x[1] + x[2] > x[0])).length;
    console.log(possible);
});