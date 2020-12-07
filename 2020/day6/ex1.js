const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rows = data.toString().trim().split(/\r?\n\r?\n/gm).map(x => x.replace(/\r?\n/gm, ''));
    const answers = rows.map(x => new Set(x));
    const total = answers.reduce((acc, group) => group.size + acc, 0);
    console.log(total);
});