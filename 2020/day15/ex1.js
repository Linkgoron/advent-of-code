const fs = require('fs');
fs.promises.readFile('./ex.input').then(raw => {
    const numbers = raw.toString().trim().split(',').map(Number);
    console.log(numbers);
    const mem = new Map();
    let prev = undefined;
    const turnLimit = 2020;
    for (let turn = 0; turn < turnLimit; turn++) {
        let said = undefined;
        if (turn < numbers.length) {
            said = numbers[turn];
            mem.set(said, turn);
        } else {
            if (mem.has(prev)) {
                said = turn - mem.get(prev) - 1;
            } else {
                said = 0;
            }
            mem.set(prev, turn - 1);
        }
        prev = said;
    }
    console.log(prev);
});
