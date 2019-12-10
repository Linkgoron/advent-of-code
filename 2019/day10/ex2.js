require('fs').readFile('./ex2.input', async (err, data) => {
    const rows = data.toString().trim().split('\n');
    const comets = rows.map((row, y) => row.split('').map((point, x) =>
        ({
            text: point,
            x, y
        })
    )).flat().filter(x => x.text === '#');
    const neighbours = comets.map(comet => ({
        comet,
        sees: new Set(comets.map(point => buildLine(comet.x, comet.y, point.x, point.y))).size - 1
    }));
    const source = [...neighbours].sort((a, b) => b.sees - a.sees)[0];
    source.closest = new Map();
    for (const comet of comets) {
        if (comet === source.comet) continue;
        const line = buildLine(source.comet.x, source.comet.y, comet.x, comet.y);
        if (!source.closest.has(line)) {
            source.closest.set(line, comet);
        } else {
            const prev = source.closest.get(line);
            const prevDist = Math.pow(prev.x - source.comet.x, 2) + Math.pow(prev.y - source.comet.y, 2);
            const dist = Math.pow(comet.x - source.comet.x, 2) + Math.pow(comet.y - source.comet.y, 2);
            if (dist < prevDist) {
                source.closest.set(line, comet);
            }
        }
    }
    const items = [...source.closest.entries()].map(([line, value]) => {
        const [m, dir] = line.split(',')
        return {
            m,
            target: value,
            quadrant: getQuadrant(dir)
        }
    }).sort(sorter);
    const selected = items[199];
    console.log(source.comet);
    console.log(selected, (selected.target.x * 100 + selected.target.y))
});

function buildLine(x0, y0, x, y) {
    const line = {
        m: (y0 - y) / (x0 - x),
        direction: lineDir(x0, y0, x, y)
    }

    return `${line.m},${line.direction}`;
}

function lineDir(x0, y0, x, y) {
    let dirs = [];
    if (y0 > y) dirs.push('up');
    if (y0 < y) dirs.push('down');
    if (x0 > x) dirs.push('left');
    if (x0 < x) dirs.push('right');
    return dirs.join(' ');
}

function getQuadrant(dir) {
    if (dir === 'up') return 1;
    if (dir === 'right') return 2;
    if (dir === 'down') return 3;
    if (dir === 'left') return 4;
    const [vertical, horizontal] = dir.split(' ');
    if (vertical === 'up') return horizontal === 'left' ? 4 : 1;
    if (vertical === 'down') return horizontal === 'left' ? 3 : 2;
    throw new Error('bad direction' + dir);
}

function sorter(a, b) {
    if (a.quadrant !== b.quadrant) return a.quadrant - b.quadrant;
    if (!isFinite(a.m)) {
        return -1;
    };
    if (!isFinite(b.m)) {
        return 1;
    };
    return a.m - b.m;
}