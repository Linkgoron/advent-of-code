const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().split('\r\n').map(row => row.trim());
    let count = 0;
    for (const word of words) {
        const letters = [...new Set(word.split(''))];
        const hasMiddle = letters.some(letter => word.match(new RegExp(`${letter}.${letter}`)));
        const hasRepeat = word.split('').some((letter, i) => word.includes(`${letter}${word[i + 1]}`, i + 2));
        if (hasMiddle && hasRepeat) {
            count++;
        }
    }
    console.log(count);
});