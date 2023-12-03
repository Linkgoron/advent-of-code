const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const row = data.toString().trim();
    const len = 14;
    for (let i = 0; i< row.length - len + 1; i++) {
        if (new Set(row.slice(i, i + len)).size === len) {
            console.log(i + len);
            return;
        }
    }
});