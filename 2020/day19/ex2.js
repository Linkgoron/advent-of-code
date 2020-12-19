const fs = require('fs');
fs.promises.readFile('./ex2.input').then(data => {

    const { rules, words } = data.toString().trim().split(/\r?\n/gm).reduce((acc, x) => {
        if (x === '') {
            return acc;
        }
        if (x.includes(':')) {
            const [number, rest] = x.split(': ');

            const rules = rest.split(' | ');
            acc.rules.push({
                number: number,
                rules,
                needs: new Set(rules.flat().join(' ').split(' ').filter(x => !x.includes('a') && !x.includes('b'))),
            });
            return acc;
        }
        acc.words.push(x);
        return acc;
    }, { rules: [], words: [] });

    for (const rule of rules) {
        rule.needsMe = rules.filter(x => x.needs.has(rule.number));
    }
    console.log(rules.length);
    const res = unpackify(rules, words);

    console.log(res.size, words.filter(x => res.get('0').includes(x)).length);
});

function unpackify(rules, watAboutism) {
    const initialStates = rules.filter(x => x.rules.some(rule => rule.includes('a')) || x.rules.some(rule => rule.includes('b')));
    const toVisit = new Set(initialStates);
    const visited = new Set();
    const unpack = new Map(initialStates.map(x => [x.number, [x.rules.join('').replace(/\"/g, '')]]));

    for (let rule of toVisit) {
        visited.add(rule.number);
        const good = rule.needsMe.filter(x => [...x.needs].every(x => visited.has(x)));
        for (const newGood of good) {
            toVisit.add(newGood);
        }
        if (initialStates.includes(rule)) {
            continue;
        }
        const myUnpack = rule.rules.map(x => {
            const unpacking = x.split(' ').map(x => unpack.get(x));
            return unpacking.reduce((acc, rightSide) => {
                if (acc.length === 0) {
                    return rightSide;
                }
                let newRes = [];
                for (const left of acc) {
                    for (const right of rightSide) {
                        const next = left + right;
                        if (watAboutism.some(x => x.includes(next))) {
                            newRes.push(next);
                        }
                    }
                }
                return newRes;
            }, []);
        })

        unpack.set(rule.number, [...new Set(myUnpack.flat())]);
    }
    return unpack;
}