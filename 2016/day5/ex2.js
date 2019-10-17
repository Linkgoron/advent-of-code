const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const word = data.toString().trim();
    const password = [];
    let letters = 0;
    for (let i = 0; letters < 8; i++) {
        const toHash = word + i.toString();
        const hash = crypto.createHash('md5').update(toHash).digest("hex");
        if (hash.startsWith('00000')) {
            const location = parseInt(hash[5]);
            if (location >= 0 && location < 8 && password[location] === undefined) {
                console.log('next letter');
                letters++;
                const letter = hash[6];
                password[location] = letter;
            }            
        }
    }
    console.log(password.join(''));
});