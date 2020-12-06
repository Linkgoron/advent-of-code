const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rows = data.toString().trim().split('\n\n').map(x => x.replace(/\n/gm, ''));
    const answers = rows.map(x => new Set(x));
    const total = answers.reduce((acc, group) => group.size + acc, 0);
    console.log(total);
});