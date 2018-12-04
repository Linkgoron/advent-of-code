const fs = require('fs');
const _ = require('lodash');

function diffWords(a, b) {
    let acc = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) acc++;
    }
    return acc;
}

function sameLetters(a, b) {
    let acc = '';
    for (let i = 0; i < a.length; i++) {
        if (a[i] == b[i]) acc += a[i];
    }
    return acc;
}

fs.readFile('./ex2.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const words = actualInput.split('\n').map(x => x.trim());

    for (let baseWordIndex = 0; baseWordIndex < words.length; baseWordIndex++) {
        const baseWord = words[baseWordIndex];
        for (let compWordIndex = baseWordIndex + 1; compWordIndex < words.length; compWordIndex++) {
            const compWord = words[compWordIndex];
            if (baseWord == compWord) {
                console.log('same word', baseWord, compWord)
                continue;
            }
            if (diffWords(baseWord, compWord) == 1) {
                console.log(baseWord, compWord);
                console.log(sameLetters(baseWord, compWord));
                return;
            }
        }
    }
});

