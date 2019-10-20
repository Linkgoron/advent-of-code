const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const sizes = data.toString().split('\r\n').map(x => x.trim().split('x')).map(x => ({
        l: parseInt(x[0]),
        w: parseInt(x[1]),
        h: parseInt(x[2]),
        get sizes() {
            return [this.l, this.w, this.h].sort((a, b) => a - b)
        },
        wrap() { return 2 * this.l * this.w + 2 * this.w * this.h + 2 * this.l * this.h + Math.min(this.w * this.l, this.w * this.h, this.l * this.h) },
        ribbon() { return ((this.l * this.w * this.h) + this.sizes[0] * 2 + this.sizes[1] * 2); }
    }));

    const total = sizes.reduce((acc, wrap) => acc + wrap.ribbon(), 0);
    console.log(total);
});