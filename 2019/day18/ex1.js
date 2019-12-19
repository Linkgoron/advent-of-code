
require('fs').readFile('./ex2.input', (err, data) => {
    const map = new Map(data.toString().split('\n')
        .map((row, rowIndex) => row.trim().split('').map((char, col) => [`${col},${rowIndex}`, char]))
        .flat().filter(x => x[1] !== '#'));

    const allPaths = new Map([...map].filter(([x, char]) => char === '@' || (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122))
        .map(([pos, char]) => [char, BFS(pos, map)]));

    const res = solver('@', allPaths);
    console.log(res);
});

function heuristic(state, map, allKeys) {
    return 0;
    const leftKeys = allKeys.filter(key => key !== '@' && state.keys.has(key));
    const missingKeys = allKeys.filter(key => key !== '@' && !state.keys.has(key));
    const missing = [...map.get(state.key)]
        .filter(([key, x]) => x.doors.some(door => !state.keys.has(door.toLowerCase())))

    const closestMissingKeys = missingKeys.map(key => {
        const matching = missing.filter(([key, node]) => node.doors.includes(key.toLowerCase()));
        const wat = matching.map(([m, val]) => m);
        return MST([key, ...wat], map);
    }).reduce((a, b) => a + b, 0);
    return MST(leftKeys, map);
}

let hardBound = 4544;
let cnt = 0
function solver(initialState, maps) {
    const nxt = [{ keys: new Set(), keys: initialState, steps: [0, 0, 0, 0] }];
    const states = new Set(nxt);
    const travel = new Set(nxt);
    const uniqueKeySets = new Map();
    const allKeys = [...maps.keys()].filter(x => x !== '@');
    for (const cur of travel) {
        const { key, keys, steps: curStep } = cur;
        if (curStep > hardBound) continue;
        states.delete(cur);
        if (keys.size === maps.size - 1) {
            return curStep;
        }
        const computedKeys = new Set();
        const currentMap = maps.get(key);
        for (const [nextKey, curM] of currentMap) {
            const { keysInPath, steps, doors } = curM;
            if ((curStep + steps) > hardBound) continue;
            if (keys.has(nextKey)) continue;
            if (doors.some(door => !keys.has(door.toLowerCase()))) continue;
            if ([...keysInPath].some(x => computedKeys.has(x))) continue;
            const uniqueString = [...keys].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).toString() + ',' + nextKey;
            if (uniqueKeySets.has(uniqueString)) {
                const res = uniqueKeySets.get(uniqueString);
                if (res <= steps + curStep) {
                    continue;
                }
            }
            uniqueKeySets.set(uniqueString, steps + curStep);
            computedKeys.add(nextKey);
            const nextKeys = new Set(keys);
            nextKeys.add(nextKey);
            states.add({ key: nextKey, keys: nextKeys, steps: curStep + steps });
        }

        let nextStep = undefined;
        let curMin = undefined;
        for (const option of states) {
            const gn = option.steps;
            const hn = heuristic(option, maps, allKeys);
            const fn = gn + hn;
            if (!curMin || fn < curMin) {
                nextStep = option;
                curMin = fn;
            }
        }
        travel.add(nextStep);
    }
}

function BFS(starting, map) {
    const visited = new Set([starting]);
    const neighbours = new Map();
    const toVisit = new Set([{ pos: starting, doors: [], keysInPath: new Set(), steps: 0 }]);

    for (const { pos, doors, steps, keysInPath } of toVisit) {
        const options = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const [x, y] = pos.split(',').map(Number);
        const curChar = map.get(pos);

        const nextKeys = new Set(keysInPath);
        if (steps > 0 && curChar.charCodeAt(0) >= 97 && curChar.charCodeAt(0) <= 122) {
            neighbours.set(curChar, { x, y, doors, steps, key: curChar, keysInPath })
            nextKeys.add(curChar);
        }

        const nextDoors = new Array(...doors);
        if (curChar.charCodeAt(0) >= 65 && curChar.charCodeAt(0) <= 95) {
            nextDoors.push(curChar);
        }

        for (const [changeX, changeY] of options) {
            const nextLoc = `${x + changeX},${y + changeY}`;
            if (map.has(nextLoc) && !visited.has(nextLoc)) {
                visited.add(nextLoc);
                toVisit.add({ pos: nextLoc, doors: nextDoors, steps: steps + 1, keysInPath: new Set(nextKeys) });
            }
        }
    }

    return neighbours;
}

const mstCache = new Map();
function MST(nodes, map) {
    const nds = [...nodes].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(b)).toString();
    if (mstCache.has(nds)) {
        return mstCache.get(nds);
    }
    const firstNode = [...nodes][0]
    const taken = new Set([firstNode]);
    const remaining = new Set([...nodes].filter((x, i) => i !== 0));
    let total = 0;
    while (remaining.size > 0) {
        let wat = [...taken].map(x => [...map.get(x)]
            .filter(([key, node]) => remaining.has(key)))
            .flat().sort((a, b) => a[1].steps - b[1].steps);
        const [source, next] = wat[0]
        remaining.delete(next.key);
        taken.add(next.key);
        total += next.steps;
    }
    mstCache.set(nds, total);

    return total;
}