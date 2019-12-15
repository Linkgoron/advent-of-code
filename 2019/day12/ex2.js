require('fs').readFile('./ex2.input', (err, data) => {
    const moons = data.toString().trim()
        .split('\n').map(x => x.trim().substring(1, x.length - 1).split(',').map(x => x.trim().split('=')))
        .map((row, i) => ({
            position: {
                x: parseInt(row[0][1]),
                y: parseInt(row[1][1]),
                z: parseInt(row[2][1]),
            },
            velocity: { x: 0, y: 0, z: 0 }
        }));

    const initial = {
        x: moons.map(x => x.position.x).toString(),
        y: moons.map(y => y.position.y).toString(),
        z: moons.map(z => z.position.z).toString(),
    }

    const repetition = { x: false, y: false, z: false };
    let state = moons;
    for (let i = 0; !repetition.x || !repetition.y || !repetition.z; i++) {
        state = state.map(({ position, velocity }) => {
            const vel = state.reduce((a, otherMoon) => add(a, velocityChange(position, otherMoon.position)), velocity);
            return {
                position: add(position, vel),
                velocity: vel
            }
        });

        for (const axis of ['x', 'y', 'z']) {
            const currentAxisValue = state.map(x => x.position[axis]).toString();
            if (!repetition[axis] && currentAxisValue == initial[axis] && state.every(m => m.velocity[axis] === 0)) {
                repetition[axis] = findPrimeFactors(i + 1);
            }
        }
    }

    // compute LCM
    const values = Object.values(repetition);
    const allNums = new Set(values.map(x => Object.keys(x)).reduce((all, me) => all.concat(me), []));
    const LCM = [...allNums].map(primeFactor => values.reduce((a, factors) => {
        if (primeFactor in factors) {
            const compute = Number(primeFactor) ** factors[primeFactor];
            return compute > a ? compute : a;
        }
        return a;
    }, 0)).reduce((a, b) => a * b, 1);

    console.log(LCM);

    function velocityChange(pos1, pos2) {
        if (pos1 === pos2) {
            return { x: 0, y: 0, z: 0 };
        }
        const diff = (val2, val1) => val1 === val2 ? 0 : (val1 - val2) / Math.abs(val1 - val2);
        return { x: diff(pos1.x, pos2.x), y: diff(pos1.y, pos2.y), z: diff(pos1.z, pos2.z) };
    }

    function add(tup1, tup2) {
        return { x: tup1.x + tup2.x, y: tup1.y + tup2.y, z: tup1.z + tup2.z };
    }
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