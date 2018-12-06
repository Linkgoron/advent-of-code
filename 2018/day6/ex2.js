const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var dots = data.toString().split('\n')
        .map(x => x.split(',').map(x => Number(x.trim())))
        .map(([x, y]) => ({ x, y, closest: [], size: 0, isInfinite: false }))
    const firstPoint = dots[0];
    let minX = firstPoint.x;
    let maxX = firstPoint.x;
    let minY = firstPoint.y;
    let maxY = firstPoint.y;

    for (const { x, y } of dots) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    const maxDistance = 10000;
    let safeRegion = 0;
    for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            const distances = dots.map(point => Math.abs(point.x - x) + Math.abs(point.y - y));
            const totalSum = distances.reduce((acc, item) => acc + item, 0);
            if (totalSum < maxDistance) {
                // the edge logic is actually not needed for this exercise input, 
                // but I wanted to do it anyway.
                safeRegion += computeToAdd(x, y);
            }
        }
    }

    function computeToAdd(x, y) {
        const isEdgeX = x === minX - 1 || x === maxX + 1;
        const isEdgeY = y === minY - 1 || y === maxY + 1;
        if (isEdgeX && isEdgeY) {
            const needToAdd = Math.floor((maxDistance - totalSum - 1) / dots.length);
            // compute triangle size.
            return (needToAdd ** 2) / 2 + 1;
        }
        if (isEdgeX || isEdgeY) {
            // compute line size.
            return Math.floor((maxDistance - totalSum) / dots.length);
        }
        return 1;
    }

    console.log(safeRegion);
});
