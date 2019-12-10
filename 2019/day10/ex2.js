require('fs').readFile('./ex2.input', (err, data) => {
    const comets = data.toString().split('\n').map((row, y) => row.split('').map((point, x) =>
        ({
            text: point,
            x, y
        })
    )).flat().filter(x => x.text === '#');
    const visibilityMap = buildVisibilityMap(comets);
    const source = [...visibilityMap].sort((a, b) => b.seen.size - a.seen.size)[0];
    let alreadyFound = 0;
    const aliveComets = new Set(comets);
    const whichToFind = 200;
    while (alreadyFound < whichToFind) {
        const cometVisibilityMap = buildCometVisibility(source.comet, aliveComets);
        if (cometVisibilityMap.size === 0) {
            console.log('no more to destroy');
            return;
        }
        const items = [...cometVisibilityMap.entries()].map(([line, { point }]) => {
            const [m, dir] = line.split(',');
            return {
                m,
                target: point,
                half: dir === 'after' ? 1 : 2
            }
        }).sort(sorter);

        const found = cometVisibilityMap.size;
        if (alreadyFound + found >= whichToFind) {
            const selected = items[whichToFind - alreadyFound - 1];
            console.log(selected, (selected.target.x * 100 + selected.target.y))
            return;
        }
        for (const { point } of cometVisibilityMap.values()) {
            if (aliveComets.has(point)) {
                aliveComets.delete(point);
            }
        }
        alreadyFound += found;
    }
});

function buildVisibilityMap(comets) {
    return comets.map(comet => ({
        comet,
        seen: buildCometVisibility(comet, comets)
    }));
}
function buildCometVisibility(comet, comets) {
    const seen = new Map();
    for (const point of comets) {
        if (comet === point) continue;
        let dist = (point.x - comet.x) ** 2 + (point.y - comet.y) ** 2;
        let line = buildLine(comet.x, comet.y, point.x, point.y);
        if (!seen.has(line)) {
            seen.set(line, { point, dist });
            continue;
        }

        const { dist: prevDist } = seen.get(line);
        if (dist < prevDist) {
            seen.set(line, { point, dist });
        }
    }
    return seen;
}

function buildLine(x0, y0, x, y) {
    const m = (y0 - y) / (x0 - x);
    const direction = x0 === x ? ((y0 < y) ? 'after' : 'before') : x0 < x ? 'after' : 'before';
    return `${m},${direction}`;
}

function sorter(a, b) {
    if (a.half !== b.half) return a.half - b.half;
    if (!isFinite(a.m)) {
        return -1;
    };
    if (!isFinite(b.m)) {
        return 1;
    };
    return a.m - b.m;
}