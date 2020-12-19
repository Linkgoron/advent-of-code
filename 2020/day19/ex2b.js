const fs = require('fs');
fs.promises.readFile('./ex2.input').then(data => {

    const { rules, words } = data.toString().trim().split(/\r?\n/gm).reduce((acc, x) => {
        if (x === '') {
            return acc;
        }
        if (x.includes(':')) {
            const [number, rest] = x.split(': ');

            const rules = rest.replace(/\"/g, '').split(' | ');
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

    const res = unpackify(rules, words);
    const sol = new RegExp('^' + res.get('0') + '$');
    console.log(res.size, words.filter(x => sol.test(x)).length);
});

function unpackify(rules) {
    const initialStates = rules.filter(x => x.needs.size === 0);
    const toVisit = new Set(initialStates);
    const visited = new Set();
    const unpack = new Map(initialStates.map(x => [x.number, x.rules.join('')]));

    for (let rule of toVisit) {
        visited.add(rule.number);
        const good = rule.needsMe.filter(x => [...x.needs].every(x => visited.has(x)));
        for (const newGood of good) {
            toVisit.add(newGood);
        }
        if (initialStates.includes(rule)) {
            continue;
        }

        const myUnpack = rule.rules.length === 1 ?
            rule.rules[0].split(' ').map(x => unpack.get(x)).join('') :
            '((' + rule.rules.map(x => {
                const unpacking = x.split(' ').map(x => unpack.get(x));
                return unpacking.join('');
            }, []).join(')|(') + '))'
        unpack.set(rule.number, myUnpack);
    }
    return unpack;
}