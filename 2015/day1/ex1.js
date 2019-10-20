const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    let frist = null;
    let acc = 0;
    let i = 0;
    for (const cur of (data.toString().split('').map(x => x === '(' ? 1 : -1))) {
        i++;
        acc = acc + cur;
        if (acc === -1) {
            console.log(i);
            return;
        }
    }
    console.log(frist);
});