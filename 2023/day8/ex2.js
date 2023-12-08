const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [instructions, rawMap] = data.toString().trim().split('\n\n');
    const map = rawMap.trim().split('\n').reduce((acc, cur) => {
        const [name, dirs] = cur.split(' = ');
        const [left, right] = dirs.replace('(', '').replace(')', '').split(', ');
        acc[name] = { L: left, R: right };
        return acc;
    }, {});

    let steps = 0;
    const positions = Object.keys(map).filter(x => x.endsWith('A'));
    const endings = positions.map(() => ({ cycle: 0 }));
    for (let instruction = 0; !endings.every(x => x.cycle !== 0); instruction++) {
        steps++;
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            const curMove = instructions[instruction % instructions.length];
            positions[i] = map[position][curMove];
            if (positions[i].endsWith('Z')) {
                const ending = endings[i];
                if (ending.cycle === 0) {
                    ending.cycle = steps;
                }
            }
        }
    }

    // compute LCM
    const positionFactors = endings.map(x => findPrimeFactors(x.cycle));
    const uniqueFactors = new Set(positionFactors.map(x => Object.keys(x)).flat());
    const LCM = [...uniqueFactors].map(primeFactor => {
        const haveFactor = positionFactors.filter(x => primeFactor in x);
        const maxNeeded = Math.max(...haveFactor.map(x => x[primeFactor]));
        return primeFactor ** maxNeeded;
    }).reduce((a, b) => a * b, 1);
    console.log(LCM);
});

function findPrimeFactors(num) {
    const primeFactors = [];
    while (num % 2 === 0) {
        primeFactors.push(2);
        num = num / 2;
    }

    const sqrtNum = Math.sqrt(num);
    for (let i = 3; i <= sqrtNum; i++) {
        while (num % i === 0) {
            primeFactors.push(i);
            num = num / i;
        }
    }

    if (num > 2) {
        primeFactors.push(num);
    }
    return primeFactors.reduce((a, b) => {
        a[b] = (a[b] || 0) + 1;
        return a;
    }, {});
}