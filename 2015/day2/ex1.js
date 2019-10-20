const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const wraps = data.toString().split('\r\n').map(x => x.trim().split('x')).map(x => ({
        l: parseInt(x[0]),
        w: parseInt(x[1]),
        h: parseInt(x[2]),
        size() { return 2 * this.l * this.w + 2 * this.w * this.h + 2 * this.l * this.h + Math.min(this.w * this.l, this.w * this.h, this.l * this.h) }
    }));

    const total = wraps.reduce((acc, wrap) => acc + wrap.size(), 0);
    console.log(total);
});