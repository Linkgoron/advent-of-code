const fs = require('fs');

fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const data = rawData.toString().split('\n');
    const initialState = data[0].substring("initial state: ".length);
    console.log(initialState);
    const rules = data.slice(2).map(x => ({ value: x.trim().substring(0, 5), key: x.trim()[x.trim().length - 1] }));
    const ruleMap = new Map()
    for (const rule of rules) {
        ruleMap.set(rule.value, rule.key === '#' ? 1 : 0);
    }
    const size = 3000;
    const init = size / 2;
    const world = new Array(size);
    const worldNext = new Array(size);
    for (let k = 0; k < size; k++) {
        world[k] = 0;
        worldNext[k] = 0;
    }
    let loc = 0;
    for (const state of initialState) {
        world[init + loc] = state === '#' ? 1 : 0;
        loc++;
    }

    function toPrint(slice) {
        return slice.map(x => x === 0 ? '.' : '#').join('');
    }

    function score(w) { return w.map((x, i) => x === 0 ? 0 : (i - init)).reduce((acc, item) => acc + item, 0) };

    // console.log(toPrint(world));
    for (let turn = 0; turn < 1001; turn++) {
        const current = score(world);
        for (let j = 3; j < size - 3; j++) {
            const slice = world.slice(j - 2, j + 3);
            const print = toPrint(slice);
            const rule = ruleMap.get(print) || 0;
            worldNext[j] = rule;
        }
        for (let k = 0; k < size; k++) {
            world[k] = worldNext[k];
        }

        const next = score(world);
        console.log(turn, 'diff', next - current, next, current);
    }

    // console.log(toPrint(world));
    console.log(score(world));
});