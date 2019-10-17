const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().split('\r\n').map(x => x.trim());
    const abbas = words.filter(x => {
        x = x + '[';
        const mapped = x.replace(/[\[\]]/g, x => `${x} `).split(' ').filter(Boolean);
        const lookForAba = mapped.filter(word => word[word.length - 1] === '[').map(x => x.substring(0, x.length - 1));
        const abas = lookForAba.map(x => getAbas(x)).flat();
        const canContainBab = mapped.filter(word => word[word.length - 1] === ']').map(x => x.substring(0, x.length - 1));
        return abas.some(aba => canContainBab.some(word => containsBab(word, aba)));
    });
    console.log(abbas.length);
});

function containsBab(word, threeLetter) {
    const [a, b] = threeLetter;
    for (let i = 0; i < word.length - 2; i++) {
        if (b === word[i] && b === word[i + 2] && a === word[i + 1]) {
            return true;
        }
    }
    return false;
}

function getAbas(word) {
    const abas = [];
    for (let i = 0; i < word.length - 2; i++) {
        if (word[i] === word[i + 2] && word[i] !== word[i + 1]) {
            abas.push(`${word[i]}${word[i + 1]}${word[i + 2]}`);
        }
    }
    return abas;
}