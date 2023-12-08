const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [instructions, rawMap] = data.toString().trim().split('\n\n');
    const map = rawMap.trim().split('\n').reduce((acc, cur) => {
        const [name, dirs] = cur.split(' = ');
        const [left, right] = dirs.replace('(','').replace(')', '').split(', ');
        acc[name] = { L: left, R: right };
        return acc;
    }, {});
    
    let position = 'AAA';
    let steps = 0;
    for (let instruction = 0; position !== 'ZZZ'; instruction++) {
        const curMove = instructions[instruction % instructions.length];
        position = map[position][curMove];
        steps += 1;
    }
    console.log(steps);
});