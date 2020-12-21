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
    const allIngredients = stuff.reduce((acc, x) => union(acc, x.ingerdients), new Set());
    const solvedAlergens = new Set();
    const solvedIngredients = new Map();
    while (solvedAlergens.size !== allAlergens.size) {
        const missing = subtract(allAlergens, solvedAlergens);
        for (const missingAlergen of missing) {
            const relevant = stuff.filter(x => x.alergens.has(missingAlergen));
            const allPossible = relevant.reduce((acc, x) => intersect(acc, x.ingerdients), relevant[0].ingerdients);
            const possible = subtract(allPossible, new Set(solvedIngredients.keys()));
            if (possible.size === 1) {
                const found = [...possible][0];
                solvedIngredients.set(found, missingAlergen)
                solvedAlergens.add(missingAlergen);
            }
        }
    }
    const noAlergens = subtract(allIngredients, new Set(solvedIngredients.keys()));
    const count = stuff.reduce((acc, x) => acc + intersect(noAlergens, x.ingerdients).size, 0);
    console.log(count);
});

function subtract(seta, setb) {
    const newSet = new Set();
    for (const elem of seta) {
        if (!setb.has(elem)) {
            newSet.add(elem);
        }
    }
    return newSet;
}

function intersect(seta, setb) {
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