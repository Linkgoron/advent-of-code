const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const cells = data.toString().trim().split(/\r?\n/gm).map((row, y) => {
        return row.split('').map((char, x) => ({
            active: char === '#',
            x: Number(x),
            y: Number(y),
            z: 0,
        }));
    }).flat();

    let current = new Map(cells.map(x => [`${x.x},${x.y},0`, { x: x.x, y: x.y, z: x.z, active: x.active }]));
    let prev = new Map();
    const maxSteps = 6;
    for (let step = 0; step < maxSteps; step++) {
        prev = current;
        current = nextStep(current);
    }

    console.log(maxSteps, [...current.values()].filter(x => x.active).length);
});

function padMap(map) {
    const nextPadded = new Map(map);
    for (const [key, value] of map) {
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                for (let z = -1; z < 2; z++) {
                    const mapValue = map.get(`${value.x + x},${value.y + y},${value.z + z}`);
                    if (!mapValue) {
                        nextPadded.set(`${value.x + x},${value.y + y},${value.z + z}`, {
                            x: value.x + x,
                            y: value.y + y,
                            z: value.z + z,
                            active: false,
                        });
                    } else {
                        nextPadded.set(`${value.x + x},${value.y + y},${value.z + z}`,{ ...mapValue })
                    }
                }
            }
        }
    }
    return nextPadded;
}

function nextStep(map) {
    const nextMap = padMap(map);
    for (const [key, current] of nextMap) {
        const currentState = map.get(key) || { active: false };
        let alive = 0;
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                for (let z = -1; z < 2; z++) {
                    if (x === 0 && y === 0 && z === 0) {
                        continue;
                    }
                    const neighbour = map.get(`${current.x + x},${current.y + y},${current.z + z}`);
                    if (neighbour && neighbour.active) {
                        alive++;
                    }
                }
            }
        }
        if (currentState.active) {
            current.active = (alive === 2 || alive === 3);
        } else {
            current.active = alive === 3;
        }
    };

    return nextMap;
}