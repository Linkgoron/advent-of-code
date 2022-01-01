const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const [template, _, ...rawRules] = data.toString().trim().split(/\n/g);
    const initalState = stateFromString(template);
    const rules = new Map(rawRules.map(x => x.split(' -> ')).map(x => {
        const [template, newVal] = x;
        return [template, {
            template,
            result: [template[0] + newVal, newVal + template[1]]
        }];
    }));

    let state = initalState;
    for (let i = 0; i < 10; i++) {
        const nextState = new Map();
        for (const [pair, count] of state) {
            const relevantRule = rules.get(pair);
            for (const newString of relevantRule.result) {
                const currentNewState = nextState.get(newString) || 0;
                nextState.set(newString, currentNewState + count);
            }
        }
        state = nextState;
    }

    let res = {};
    for (const [pair, count] of state) {
        const letter1 = pair[0];
        const letter2 = pair[1];
        res[letter1] = (res[letter1] || 0) + count;
        res[letter2] = (res[letter2] || 0) + count;
    }
    for (const [key, value] of Object.entries(res)) {
        res[key] = Math.ceil(value / 2);
    }
    const max = Object.entries(res).reduce((agg, [key, value]) => {
        if (value > agg) {
            return value;
        }
        return agg;
    }, 0);
    const min = Object.entries(res).reduce((agg, [key, value]) => {
        if (value < agg) {
            return value;
        }
        return agg;
    }, Number.POSITIVE_INFINITY);
    console.log(max, min, max - min);
});

function stateFromString(string) {
    let map = new Map();

    for (let i = 0; i < string.length - 1; i++) {
        const subString = string.slice(i, i + 2);
        map.set(subString, (map.get(subString) || 0) + 1)
    }
    return map;
}