const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const phrases = data.toString().split('\n')
        .map(x => x.split(' ').map(x => [...x.trim()].sort().join())).map(words => ({
            words,
            numOfTotalWords: words.length,
            numOfUniqueWords: new Set(words).size,
            isGood: words.length === new Set(words).size
        }));

    console.log(phrases.filter(x => x.isGood).length);
});