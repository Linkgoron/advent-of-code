const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const parseRegexp = new RegExp("<[^>]+>", "gi")
    var points = data.toString().split('\n')
        .map(x => {
            const infos = x.match(parseRegexp);
            [x, y] = infos[0].split(',').map(x => x.replace('<', '').replace('>', '').trim()).map(x => parseInt(x));
            [speedX, speedY] = infos[1].split(',').map(x => x.replace('<', '').replace('>', '').trim()).map(x => parseInt(x));
            return {
                location: { x, y },
                velocity: { speedX, speedY },
            }
        });

    for (let i = 0; i < 100000; i++) {
        if (print(points)) { break; };
        points = nextIteration(points);
    }

});

function nextIteration(points) {
    return points.map(p => ({ location: { x: p.location.x + p.velocity.speedX, y: p.location.y + p.velocity.speedY }, velocity: p.velocity }));
}

function print(points) {
    const world = new Map();
    const maxX = Math.max(...points.map(x => x.location.x));
    const minX = Math.min(...points.map(x => x.location.x));
    const maxY = Math.max(...points.map(x => x.location.y));
    const minY = Math.min(...points.map(x => x.location.y));
    if (maxX - minX !== 61) {
        return false;
    }
    if (maxY - minY !== 9) {
        return false;
    }

    for (const p of points) {
        world.set(`${p.location.x},${p.location.y}`, '#');
    }

    for (let j = minY - 5; j < maxY + 6; j++) {
        let row = '';
        for (let i = minX - 5; i < maxX + 6; i++) {
            const loc = `${i},${j}`;
            if (world.has(loc)) {
                row += world.get(loc);
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
    return true;

}