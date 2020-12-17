const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const cells = data.toString().trim().split(/\r?\n/gm).map((row, y) => {
        return row.split('').map((char, x) => ({
            active: char === '#',
            x: Number(x),
            y: Number(y),
            z: 0,
            w: 0,
        }));
    }).flat();

    let current = new Map(cells.map(x => [getCoordinateKey(x), { ...x }]));
    const maxSteps = 6;
    for (let step = 0; step < maxSteps; step++) {
        current = nextStep(current);
    }

    console.log(maxSteps, [...current.values()].filter(x => x.active).length);
});

function getCoordinateKey(value, { x, y, z, w } = { x: 0, y: 0, z: 0, w: 0 }) {
    return `${value.x + x},${value.y + y},${value.z + z},${value.w + w}`;
}

function padMap(map) {
    const nextPadded = new Map(map);
    for (const [key, value] of map) {
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                for (let z = -1; z < 2; z++) {
                    for (let w = -1; w < 2; w++) {
                        const mapValue = map.get(getCoordinateKey(value, { x, y, z, w }));
                        if (!mapValue) {
                            nextPadded.set(getCoordinateKey(value, { x, y, z, w }), {
                                x: value.x + x,
                                y: value.y + y,
                                z: value.z + z,
                                w: value.w + w,
                                active: false,
                            });
                        } else {
                            nextPadded.set(getCoordinateKey(value, { x, y, z, w }), { ...mapValue })
                        }
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
                    for (let w = -1; w < 2; w++) {
                        if (x === 0 && y === 0 && z === 0 && w === 0) {
                            continue;
                        }
                        const neighbour = map.get(getCoordinateKey(current, { x, y, z, w }));
                        if (neighbour && neighbour.active) {
                            alive++;
                        }
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