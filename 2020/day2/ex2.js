const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const count = data.toString().trim().split('\n').filter(x => {
        const [limits, almostLetter, password] = x.split(' ');
        const [low, high] = limits.split('-');
        const letter = almostLetter[0];

        const lowGood = password[Number(low) - 1] === letter;
        const highGood = password[Number(high) - 1] === letter;
        return lowGood !== highGood;
    }).length;

    console.log(count);
});