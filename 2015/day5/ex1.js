const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().split('\r\n').map(row => row.trim());
    console.log(words);
    let count = 0;
    for (const word of words) {
        const letters = [...new Set(word.slice())];
        const hasVowel = [...word].reduce((acc, letter) => acc + ('aeiou'.includes(letter) ? 1 : 0), 0) >= 3;
        const hasDouble = letters.some(letter => word.includes(`${letter}${letter}`))
        const noThis = ['ab', 'cd', 'pq', 'xy'].every(pair => !word.includes(pair));
        if (hasVowel && hasDouble && noThis) {
            count++;
        }
    }
    console.log(count);
});