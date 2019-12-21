require('fs').readFile('./ex.input', (err, data) => {
    const map = new Map(data.toString().split('\n')
        .map((row, rowIndex) => row.split('').map((char, colIndex) => [`${colIndex},${rowIndex}`, { x: colIndex, y: rowIndex, char }]))
        .flat().filter(([key, x]) => x.char === '.' || (x.char.charCodeAt(0) <= 90 && x.char.charCodeAt(0) >= 65)));

    const parsedMap = parseMap(map);
    const point = `AA:${[...parsedMap.values()].find(x => x.portalName === 'AA').exitAt}`;
    const { infoMap, distMap } = portalsMap(parsedMap);
    const visited = new Set();
    const toVisit = new Map();
    const travel = new Set([{ point, level: 0, steps: 0 }]);
    for (const current of travel) {
        const { point: curPoint, steps, level } = current;
        if (curPoint.startsWith('ZZ')) {
            console.log("WINNER", steps - 1);
            return;
        }
        travel.delete(current);
        visited.add(curPoint + "," + level);

        const options = distMap.get(curPoint);
        for (const [name, dist] of options) {
            const [portalName, loc] = name.split(':');
            if (portalName === 'ZZ' && level !== 0) continue;
            if (portalName === 'AA') continue;
            const res = infoMap.get(name);
            const nextLevel = res.isInner ? level + 1 : level - 1;
            if (nextLevel < 0) continue;
            const uniqueLabel = `${res.matchName}:${res.match},${nextLevel}`;
            if (visited.has(uniqueLabel)) continue;
            const val = toVisit.get(uniqueLabel);

            if (!val || (val.steps < steps + dist + 1)) {
                const next = { point: `${res.matchName}:${res.match}`, steps: steps + dist + 1, level: nextLevel };
                toVisit.set(uniqueLabel, next);
            }
        }
        if (toVisit.size) {
            let curMin = undefined;
            for (const [key, option] of toVisit) {
                if (curMin === undefined || option.steps < curMin.dist) {
                    curMin = { option, dist: option.steps, key }
                }
            }

            travel.add(curMin.option);
            toVisit.delete(curMin.key);
        }
    }
});

function parseMap(map) {
    for (const [key, point] of map) {
        if (point.char !== '.') continue;
        const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [movX, movY] of options) {
            const res = map.get(`${point.x + movX},${point.y + movY}`);
            if (res) {
                if (res.char !== '.') {
                    res.exitAt = `${point.x},${point.y}`;
                    const extraLetter = map.get(`${point.x + movX + movX},${point.y + movY + movY}`);
                    res.portalName = res.char + extraLetter.char;
                    if (movY === -1 || movX === -1) {
                        res.portalName = extraLetter.char + res.char;
                    }
                }
            }
        }
    }
    for (const [key, item] of map) {
        if (item.char !== '.' && !item.exitAt) {
            map.delete(key);
        }
    }
    const xs = [...map.values()].map(p => p.x);
    const ys = [...map.values()].map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    for (const [key, item] of map) {
        if (item.portalName) {
            const items = [...map.values()];
            const meReversed = [...item.portalName].reverse().join('');
            const match = items.find(other => other !== item && (other.portalName === meReversed || other.portalName === item.portalName));
            if (match) {
                item.match = match.exitAt;
                item.matchName = match.portalName;
            }
            item.isOuter = item.x == minX || item.x === maxX || item.y === maxY || item.y === minY;
            item.isInner = !item.isOuter;

            if (item.portalName === 'ZZ') {
                item.match = item.exitAt;
                item.matchName = 'ZZ';
                item.isOuter = false;
                item.isInner = true;
            }
        }
    }
    return map;
}

function portalsMap(map) {
    let portals = [...map.values()].filter(b => b.portalName);
    const distMap = new Map(portals.map(x => [`${x.portalName}:${x.exitAt}`, BFS(x.exitAt, map)]));
    const infoMap = new Map(portals.map(x => [`${x.portalName}:${x.exitAt}`, x]));
    return { distMap, infoMap };
}

function BFS(point, map) {
    const visited = new Set([point]);
    const toVisit = new Set([{ point, steps: 0 }]);
    const portalMap = new Map();
    for (const { point: curPoint, steps } of toVisit) {
        const [x, y] = curPoint.split(',').map(Number);
        const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [movX, movY] of options) {
            const nextPoint = `${x + movX},${y + movY}`
            if (visited.has(nextPoint)) continue;
            const res = map.get(nextPoint);
            if (!res) continue;
            if (res.portalName && steps > 0) {
                portalMap.set(`${res.portalName}:${res.exitAt}`, steps);
                continue;
            }

            toVisit.add({ point: nextPoint, steps: steps + 1 });
            visited.add(nextPoint);
        }
    };
    return portalMap;
}