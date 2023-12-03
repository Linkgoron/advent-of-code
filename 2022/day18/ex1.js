const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const cubes = data.toString().trim().split(/\r?\n/).map(row => {
        const [x, y, z] = row.trim().split(',').map(Number);
        return { x, y, z };
    });

    const coordinates = new Set(cubes.map(x => `${x.x}, ${x.y}, ${x.z}`));
    let total = 0;
    for (const { x, y, z } of cubes) {
        let clearSides = 6;
        for (const [xDiff, yDiff, zDiff] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
            if (coordinates.has(`${x + xDiff}, ${y + yDiff}, ${z + zDiff}`)) {
                clearSides -= 1;
            }
        }
        total += clearSides;
    }
    console.log(total);
});