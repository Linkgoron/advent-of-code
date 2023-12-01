const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const allPoints = data.toString().trim().split(/\r?\n/).map(row => {
        const [x, y, z] = row.trim().split(',').map(Number);
        return { x, y, z };
    });

    const coordinates = new Set(allPoints.map(x => `${x.x}, ${x.y}, ${x.z}`));
    const maxX = Math.max(...allPoints.map(x => x.x));
    const minX = Math.min(...allPoints.map(x => x.x));
    const maxY = Math.max(...allPoints.map(x => x.y));
    const minY = Math.min(...allPoints.map(x => x.y));
    const maxZ = Math.max(...allPoints.map(x => x.z));
    const minZ = Math.min(...allPoints.map(x => x.z));
    let count = 0;
    for (const point of allPoints) {
        count += countTouching(point, coordinates, minX, maxX, minY, maxY, maxZ, minZ);
    }
    console.log(count);
});

function countTouching(point, coordinates, minX, maxX, minY, maxY, maxZ, minZ) {
    let count = 0;
    for (const [initXDiff, initYDiff, initZDiff] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const initPoint = `${point.x + initXDiff}, ${point.y + initYDiff}, ${point.z + initZDiff}`;
        if (coordinates.has(initPoint)) {
            continue;
        }

        const toVisit = new Set([initPoint]);
        for (const point of toVisit) {
            const [x, y, z] = point.split(', ').map(Number);
            if (x < minX || x > maxX || y < minY || y > maxY || z < minZ || z > maxZ) {
                count++;
                break;
            }
            for (const [xDiff, yDiff, zDiff] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
                const nextPoint = `${x + xDiff}, ${y + yDiff}, ${z + zDiff}`;
                if (coordinates.has(nextPoint)) {
                    continue;
                }
                toVisit.add(nextPoint);
            }
        }
    }
    return count;
}
