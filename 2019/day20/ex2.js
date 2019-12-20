
require('fs').readFile('./ex.input', (err, data) => {
    const map = new Map(data.toString().split('\n')
        .map((row, rowIndex) => row.split('').map((char, colIndex) => [`${colIndex},${rowIndex}`, { x: colIndex, y: rowIndex, char }]))
        .flat().filter(([key, x]) => x.char === '.' || (x.char.charCodeAt(0) <= 90 && x.char.charCodeAt(0) >= 65)));

    const parsedMap = parseMap(map);
    let point = [...parsedMap.values()].find(x => x.portalName === 'AA').exitAt;
    // console.log(parsedMap);
    const visited = new Set([point + ',0']);
    const toVisit = new Set([{ point, level: 0, steps: 0 }]);
    for (const { point: curPoint, steps, level } of toVisit) {
        const [x, y] = curPoint.split(',').map(Number);
        const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [movX, movY] of options) {
            const nextPoint = `${x + movX},${y + movY}`
            const res = map.get(nextPoint);
            if (!res) continue;

            if (res.portalName) {
                if (res.portalName === 'ZZ' && level === 0) {
                    console.log("DONE", steps);
                    return;
                }
                if (res.portalName === 'AA' || res.portalName === 'ZZ') continue;
                if (level === 0 && res.isOuter) continue;
                const nextLevel = res.isInner ? level + 1 : level - 1;
                if (visited.has(nextPoint + ',' + nextLevel)) continue;
                toVisit.add({ point: res.match, steps: steps + 1, level: nextLevel });
                visited.add(res.match + ',' + nextLevel);
                continue;
            }
            if (visited.has(nextPoint + ',' + level)) continue;
            toVisit.add({ point: nextPoint, steps: steps + 1, level });
            visited.add(nextPoint + ',' + level);

        }
        // console.log(parsedMap);
    };
});

function parseMap(map) {
    for (const [key, point] of map) {
        const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        if (point.char !== '.') {
            for (const [movX, movY] of options) {
                const res = map.get(`${point.x + movX},${point.y + movY}`);
                if (res) {
                    if (res.char !== '.') {
                        point.portalName = point.char + res.char;
                    }
                    if (res.char === '.') {
                        point.exitAt = `${point.x + movX},${point.y + movY}`;
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
            }
            item.isOuter = item.x == minX || item.x === maxX || item.y === maxY || item.y === minY;
            item.isInner = !item.isOuter;
        }
    }
    return map;
}