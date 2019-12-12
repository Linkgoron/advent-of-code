require('fs').readFile('./ex2.input', (err, data) => {
    const moons = data.toString().trim()
        .split('\n').map(x => x.trim().substring(1, x.length - 1).split(',').map(x => x.trim().split('=')))
        .map((row, i) => ({
            id: i,
            position: {
                x: parseInt(row[0][1]),
                y: parseInt(row[1][1]),
                z: parseInt(row[2][1]),
            },
            velocity: { x: 0, y: 0, z: 0 }
        }));

    let initialXs = moons.map(x => x.position.x).toString();
    let initialYs = moons.map(x => x.position.y).toString();
    let initialZs = moons.map(x => x.position.z).toString();
    let state = moons;

    let hasX = false;
    let hasY = false;
    let hasZ = false;

    let factors = [];

    for (let i = 0; i < 1000000; i++) {
        const changing = state.map(moon => ({
            moon,
            changes: state.map(otherMoon => velocityChange(moon.position, otherMoon.position))
        }));
        state = changing.map(x => {
            const velocity = computeTotalVelocity(x.moon.velocity, x.changes);
            const position = addTuples(x.moon.position, velocity);
            return {
                id: x.moon.id,
                position,
                velocity
            }
        });

        var currentX = state.map(x => x.position.x).toString();
        var currentY = state.map(x => x.position.y).toString();
        var currentZ = state.map(x => x.position.z).toString();

        if (!hasX && currentX == initialXs && state.every(m => m.velocity.x === 0)) {
            factors.push(findPrimeFactors(i + 1))
            hasX = true;
        }
        if (!hasY && currentY == initialYs && state.every(m => m.velocity.y === 0)) {
            factors.push(findPrimeFactors(i + 1))
            hasY = true;
        }
        if (!hasZ && currentZ == initialZs && state.every(m => m.velocity.z === 0)) {
            factors.push(findPrimeFactors(i + 1))
            hasZ = true;
        }
        if (hasX && hasY && hasZ) {
            break;
        }
    }

    // compute LCM
    const allNums = new Set(factors.map(x => Object.keys(x)).reduce((all, me) => all.concat(me), []));

    const LCM = [...allNums].map(key => factors.reduce((a, b) => {
        if (key in b) {
            let compute = Number(key) ** b[key]
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

    function addTuples(tup1, tup2) {
        return { x: tup1.x + tup2.x, y: tup1.y + tup2.y, z: tup1.z + tup2.z };
    }

    function computeTotalVelocity(velocity, changes) {
        return changes.reduce((prev, cur) => addTuples(prev, cur), { ...velocity });
    }
});

function findPrimeFactors(num) {

    var primeFactors = [];
    while (num % 2 === 0) {
        primeFactors.push(2);
        num = num / 2;
    }

    var sqrtNum = Math.sqrt(num);
    for (var i = 3; i <= sqrtNum; i++) {
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