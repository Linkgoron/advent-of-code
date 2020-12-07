const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rows = data.toString().trim().split(/\r?\n\r?\n/gm).map(x => x.split(/\r?\n/gm));
    const answers = rows.map(group => {
        const min = group.reduce((acc, x) => x.length < acc.length ? x : acc, group[0]);
        const intersection = new Set(min);
        for (const person of group) {
            for (const ans of intersection) {
                if (!person.includes(ans)) {
                    intersection.delete(ans);
                }
            }
        }
        return intersection;
    });
    const total = answers.reduce((acc, group) => group.size + acc, 0);
    console.log(total);
});