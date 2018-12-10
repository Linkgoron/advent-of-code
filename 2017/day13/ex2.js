const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const nodes = data.toString()
        .split('\n')
        .map(x => x.split(": ").map(n => n.trim()))
        .map(([depth, range]) => ({
            depth: parseInt(depth), range: parseInt(range)
        }));


    const pos = nodes.map(({ range, depth }) =>
        ({
            depth,
            range,
            pos(delay) {
                const position = (depth + delay) % ((range - 1) * 2);
                // console.log(depth, range, position, depth + delay, position !== 0);
                return position;
            },
            success(delay) { return this.pos(delay) !== 0 }
        }));

    let res = false;
    // elements with the same range will always be aligned.
    const limitOnConfigurationNumber = [...new Set(pos.map(x => x.range))];
    const maxConfigNumber = limitOnConfigurationNumber.reduce((acc, range) => acc * range, 1)
    console.log(maxConfigNumber);
    for (let delay = 0; delay < maxConfigNumber; delay++) {
        res = pos.reduce((acc, fw) => fw.success(delay) && acc, true);
        if (res) { console.log(delay); break; }
    }
    if (!res) console.log(`couldn't find a solution in ${maxConfigNumber} iterations`)
});
