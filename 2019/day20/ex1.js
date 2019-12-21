
require('fs').readFile('./ex.input', (err, data) => {
    const map = new Map(data.toString().split('\n')
        .map((row, rowIndex) => row.split('').map((char, colIndex) => [`${colIndex},${rowIndex}`, { x: colIndex, y: rowIndex, char }]))
        .flat().filter(([key, x]) => x.char === '.' || (x.char.charCodeAt(0) <= 90 && x.char.charCodeAt(0) >= 65)));

    const parsedMap = parseMap(map);
    let point = [...parsedMap.values()].find(x => x.portalName === 'AA').exitAt;
    // console.log(parsedMap);
    const visited = new Set([point]);
    const toVisit = new Set([{ point, steps: 0 }]);
    for (const { point: curPoint, steps } of toVisit) {
        // console.log(curPoint, steps);
        const [x, y] = curPoint.split(',').map(Number);
        const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [movX, movY] of options) {
            const nextPoint = `${x + movX},${y + movY}`
            if (visited.has(nextPoint)) continue;
            const res = map.get(nextPoint);
            if (!res) continue;

            if (res.portalName) {
                if (res.portalName === 'ZZ') {
                    console.log('DONE', steps);
                    return;
                }
                if (res.portalName === 'AA') continue;
                // console.log('EA', res.portalName, res.exitAt);
                toVisit.add({ point: res.match, steps: steps + 1 });
                visited.add(res.match);
                continue;
            }
            toVisit.add({ point: nextPoint, steps: steps + 1 });
            visited.add(nextPoint);

        }
        // console.log(parsedMap);
    };
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
                    // name is top-bottom or left-right
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

    for (const [key, item] of map) {
        if (item.portalName) {
            const items = [...map.values()];
            const match = items.find(other => other !== item && (other.portalName === item.portalName));
            if (match) {
                item.match = match.exitAt;
            }
        }
    }
    return map;
}