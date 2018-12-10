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
            pos: depth % ((range - 1) * 2),
            get score() { return this.pos === 0 ? (this.depth * this.range) : 0; }
        }));
    const res = pos.reduce((acc, i) => acc + i.score, 0);
    console.log(res);
});
