require('fs').readFile('./ex1.input', (err, data) => {
    const initialState = new Map([[0, new Map(data.toString().trim().split('\n')
        .map((row, rowInd) => row.trim().split('').map((char, colInd) => [`${colInd},${rowInd}`, char === '#']))
        .flat())]]);
    initialState.get(0).delete('2,2');
    let currentState = initialState;
    for (let i = 0; i < 200; i++) {
        const currentWithExtra = new Map(currentState);
        const minLevel = Math.min(...currentState.keys()) - 1;
        const maxLevel = Math.max(...currentState.keys()) + 1;
        currentWithExtra.set(minLevel, createEmptyGrid());
        currentWithExtra.set(maxLevel, createEmptyGrid());
        const levels = new Map();
        for (const [level, map] of currentWithExtra) {
            const nextMap = new Map();
            for (let [position, value] of map) {
                const nextValue = computeNextState(level, position, value, currentWithExtra);
                nextMap.set(position, nextValue);
            }
            levels.set(level, nextMap);
        }
        currentState = levels;
    }

    function computeNextState(level, position, value, maps) {
        const bugNeighbours = [...getNeighbourStates(level, position, maps)].filter(Boolean).length;
        if (value && bugNeighbours === 1) {
            return true;
        }
        if (!value && (bugNeighbours === 1 || bugNeighbours === 2)) {
            return true;
        }
        return false;
    }

    function* getNeighbourStates(level, position, maps) {
        const [x, y] = position.split(',').map(Number);
        const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [movX, movY] of options) {
            const nextX = x + movX;
            const nextY = y + movY;
            if (nextX === 2 && nextY === 2) {
                const lowerLevel = maps.get(level + 1) || new Map();
                if (position === '1,2') {
                    for (let i = 0; i < 5; i++) {
                        yield lowerLevel.get(`0,${i}`) || false;
                    }
                } else if (position === '3,2') {
                    for (let i = 0; i < 5; i++) {
                        yield lowerLevel.get(`4,${i}`) || false;
                    }
                } else if (position === '2,1') {
                    for (let i = 0; i < 5; i++) {
                        yield lowerLevel.get(`${i},0`) || false;
                    }
                } else if (position === '2,3') {
                    for (let i = 0; i < 5; i++) {
                        yield lowerLevel.get(`${i},4`) || false;
                    }
                }
                continue;
            }
            if (nextX === -1 || nextY === -1 || nextX === 5 || nextY === 5) {
                const upperLevel = maps.get(level - 1) || new Map();
                if (nextX === -1) {
                    yield upperLevel.get(`1,2`) || false;
                } else if (nextX === 5) {
                    yield upperLevel.get(`3,2`) || false;
                } else if (nextY === -1) {
                    yield upperLevel.get(`2,1`) || false;
                } else if (nextY === 5) {
                    yield upperLevel.get(`2,3`) || false;
                }
                continue;
            }

            yield maps.get(level).get(`${nextX},${nextY}`) || false;
        }
    }

    function createEmptyGrid() {
        let map = new Map();
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (x === 2 && y === 2) {
                    continue;
                }
                map.set(`${x},${y}`, false);
            }
        }
        return map;
    }
    const minLevel = Math.min(...currentState.keys());
    const maxLevel = Math.max(...currentState.keys());
    for (let level = minLevel; level <= maxLevel; level++) {
        const thisLevel = currentState.get(level);
        const curBugs = [...thisLevel.values()].filter(Boolean).length;
        if (curBugs > 0) {
            console.log(level, curBugs);
            console.log(thisLevel);
        }
    }
    const vals = [...currentState.values()].map(x => [...x.values()]).flat().filter(Boolean);
    console.log(vals.length);
});