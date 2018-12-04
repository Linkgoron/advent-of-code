const fs = require('fs');

fs.readFile('./ex2.input', (err, data) => {
    if (err) throw new Error("data :(");

    const set = new Set();
    set.add(0);
    const actualInput = data.toString();
    const numbers = actualInput.split('\n').map(x => parseInt(x));
    let acc = 0;
    while (true) {        
        for (const number of numbers) {
            acc = acc + number;
            if (set.has(acc)) {
                console.log('found double!', acc);
                return;
            }

            set.add(acc);
        }
    }
}, 0);


