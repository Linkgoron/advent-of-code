const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const word = data.toString().trim();
    let password = '';
    for (let i = 0; password.length < 8; i++) {
        const toHash = word + i.toString();
        const hash = crypto.createHash('md5').update(toHash).digest("hex");
        if(hash.startsWith('00000')) {
            password+=hash[5];
            console.log('next letter');
        }
    }
    console.log(password)
});