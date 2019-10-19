const fs = require('fs');
const crypto = require('crypto');

const multiCache = new Map();

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const salt = data.toString().trim();
    let found = 0;
    for (let index = 0; found < 64; index++) {
        const hash = multiHash(salt + index.toString());
        const letter = repeatingLetter(hash);
        if (letter !== false) {
            for (let j = 1; j < 1001; j++) {
                const fiveRepHash = multiHash(salt + (index + j).toString());
                if (repeatingFiveTimes(fiveRepHash, letter)) {
                    found++;
                    console.log('found', found, index, hash);
                    break;
                }
            }
        }
        multiCache.delete(salt + index.toString());
    }
});

function regularHash(str) {    
    return crypto.createHash('md5').update(str).digest("hex");    
}


function multiHash(string) {
    if (multiCache.has(string)) {
        return multiCache.get(string);
    }
    let hash = regularHash(string);

    for (let i = 0; i < 2016; i++) {
        hash = regularHash(hash);
    }
    multiCache.set(string, hash);
    return hash;
}

function repeatingFiveTimes(hex, letter) {
    let counter = 0;
    for (let i = 0; i < hex.length; i++) {
        if (hex[i] === letter) {
            counter++;
            if (counter === 5) return true;
        } else {
            counter = 0;
        }
    }
    return false;
}

function repeatingLetter(hex) {
    for (let i = 0; i < hex.length - 2; i++) {
        if ((hex[i] === hex[i + 1]) && (hex[i + 1] === hex[i + 2])) {
            return hex[i];
        }
    }
    return false;
}
