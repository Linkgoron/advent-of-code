const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [aStart, bStart] = data.toString().split('\n').map(x => parseInt(x));
    const A = new Generator(aStart, 16807, 4);
    const B = new Generator(bStart, 48271, 8);
    let agree = 0;
    const numOfTurns = 5000000;
    for (let i = 0; i < numOfTurns; i++) {
        if (i % 100000 === 0) {
            console.log(i / numOfTurns * 100);
        }
        const genA = A.next().toString(2).padStart(32, '0');
        const genB = B.next().toString(2).padStart(32, '0');
        const isMatch = genA.substring(16) === genB.substring(16);
        if (isMatch) agree++;
    }
    console.log(agree);
});

class Generator {
    constructor(seed, factor, gcd) {
        this.seed = seed;
        this.factor = factor;
        this.current = seed;
        this.gcd = gcd;
    }

    getValue() { return (this.current * this.factor) % 2147483647; }

    next() {
        this.current = this.getValue();
        while ((this.current % this.gcd) !== 0) {
            this.current = this.getValue();
        }
        return this.current;;
    }
}