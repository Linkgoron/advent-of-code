require('fs').readFile('./ex1.input', (err, data) => {
    const moons = data.toString().trim()
        .split('\n').map(x => x.trim().substring(1, x.length - 1).split(',').map(x => x.trim().split('=')))
        .map((row, i) => ({
            id: i,
            position: {
                x: parseInt(row[0][1]),
                y: parseInt(row[1][1]),
                z: parseInt(row[2][1])
            },
            velocity: { x: 0, y: 0, z: 0 }
        }));


    let state = moons;
    for (let i = 0; i < 1000; i++) {
        const changing = state.map(moon => ({
            moon,
            changes: state.map(otherMoon => velocityChange(moon.position, otherMoon.position))
        }));
        state = changing.map(x => {
            var velocity = computeTotalVelocity(x.moon.velocity, x.changes);
            return {
                id: x.moon.id,
                position: addTuples(x.moon.position, velocity),
                velocity: velocity
            }
        });
    }

    const total = state.map(x => computeEnergy(x.position) * computeEnergy(x.velocity)).reduce((a, b) => a + b, 0);
    console.log(total);

    function velocityChange(pos1, pos2) {
        if (pos1 === pos2) {
            return { x: 0, y: 0, z: 0 };
        }
        const diff = (val2, val1) => val1 === val2 ? 0 : (val1 - val2) / Math.abs(val1 - val2);
        return { x: diff(pos1.x, pos2.x), y: diff(pos1.y, pos2.y), z: diff(pos1.z, pos2.z) };
    }

    function computeEnergy(pos) {
        return Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z);
    }

    function addTuples(tup1, tup2) {
        return { x: tup1.x + tup2.x, y: tup1.y + tup2.y, z: tup1.z + tup2.z };
    }

    function computeTotalVelocity(velocity, changes) {
        return changes.reduce((prev, cur) => addTuples(prev, cur), { ...velocity });
    }
});