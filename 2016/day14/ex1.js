const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const salt = data.toString().trim();
    let found = 0;
    for (let index = 0; found < 64; index++) {
        const hash = crypto.createHash('md5').update(salt + index.toString(10)).digest("hex");
        const letter = repeatingLetter(hash);
        if (letter !== false) {
            for (let j = 1; j < 1001; j++) {
                const fiveRepHash = crypto.createHash('md5').update(salt + (index+j).toString(10)).digest("hex");
                if (repeatingFiveTimes(fiveRepHash, letter)) {
                    found++;
                    console.log('found', found, index, hash);
                    break;
                }
            }
        }
    }

});

function repeatingFiveTimes(hex, letter) {
    for (let i = 0; i < hex.length - 4; i++) {
        if (hex[i] === letter && hex[i + 1] === letter && hex[i + 2] === letter && hex[i + 3] === letter && hex[i + 4] === letter) {
            return true;
        }
    }
    return false;
}

function repeatingLetter(hex) {
    for (let i = 0; i < hex.length - 2; i++) {
        if (hex[i] === hex[i + 1] && hex[i + 1] === hex[i + 2]) {
            return hex[i];
        }
    }
    return false;
}
