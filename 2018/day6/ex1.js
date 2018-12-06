const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var dots = data.toString().split('\n')
        .map(x => x.split(',').map(x => Number(x.trim())))
        .map(([x, y]) => ({ x, y, closest: [], size: 0, isInfinite: false }));
    
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

    for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            const distances = dots.map(point => Math.abs(point.x - x) + Math.abs(point.y - y));
            const min = Math.min(...distances);
            const closestPoints = dots.filter(point => (Math.abs(point.x - x) + Math.abs(point.y - y)) === min);

            if (closestPoints.length === 1) {
                const currentPoint = closestPoints[0];
                currentPoint.size++;
                const isEdge = y === minY - 1 || y === maxY + 1 || x === minX - 1 || x === maxX + 1;
                if (isEdge) currentPoint.isInfinite = true;
            }
        }
    }

    const rp = dots.filter(x => !x.isInfinite);
    if (rp.length > 0) {
        const sizes = rp.map(x => x.size);
        const size = Math.max(...sizes);
        const bestPoint = rp.filter(r => r.size === size)[0];
        console.log(bestPoint.size);
    } else {
        console.log(0);
    }
});
