const fs = require('fs');
const crypto = require('crypto');
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const salt = data.toString();
    let i = 1;
    let found = false;
    for (; !found; i++) {
        const toHash = salt + i.toString();
        const hash = crypto.createHash('md5').update(toHash).digest("hex");
        if (hash.startsWith('000000')) {
            break;
        }
    }
    console.log(i);
});