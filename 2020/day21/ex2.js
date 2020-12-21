const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const stuff = data.toString().trim().split(/\r?\n/gm).map(x => {
        const [ingerdients, alergens = ''] = x.split(' (contains ');
        return {
            ingerdients: new Set(ingerdients.split(' ')),
            alergens: new Set(alergens.replace(/\)/g, '').replace(/,/g, '').split(' '))
        };
    });
    const allAlergens = stuff.reduce((acc, x) => union(acc, x.alergens), new Set());
    const solvedAlergens = new Set();
    const solvedIngredients = new Map();
    while (solvedAlergens.size !== allAlergens.size) {
        const missing = difference(allAlergens, solvedAlergens);
        for (const missingAlergen of missing) {
            const relevant = stuff.filter(x => x.alergens.has(missingAlergen));
            const allPossible = relevant.reduce((acc, x) => instersect(acc, x.ingerdients), relevant[0].ingerdients);
            const possible = difference(allPossible, new Set(solvedIngredients.keys()));
            if (possible.size === 1) {
                const found = [...possible][0];
                solvedIngredients.set(found, missingAlergen)
                solvedAlergens.add(missingAlergen);
            }
        }
    }

    const sorted = [...solvedIngredients].sort(([key, value], [key2, value2]) => value.localeCompare(value2));
    const sorting = sorted.map(([key, value]) => key).join(',');
    console.log(sorted, sorting);
});

function difference(seta, setb) {
    const newSet = new Set();
    for (const elem of seta) {
        if (!setb.has(elem)) {
            newSet.add(elem);
        }
    }
    return newSet;
}

function instersect(seta, setb) {
    const newSet = new Set();
    for (const elem of seta) {
        if (setb.has(elem)) {
            newSet.add(elem);
        }
    }
    return newSet;
}

function union(seta, setb) {
    const newSet = new Set(seta);
    for (const elem of setb) {
        newSet.add(elem)
    }
    return newSet;
}