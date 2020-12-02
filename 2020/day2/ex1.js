const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rules = data.toString().trim().split('\n').map(x => {
        const [limits, almostLetter, password] = x.split(' ');
        const [low, high] = limits.split('-');
        return {
            password,
            letter: almostLetter[0],
            low: Number(low),
            high: Number(high),
        };
    });
    const count = rules.filter(({ low, high, password, letter }) => {
        const shown = [...password].filter(x => x === letter).length;
        return shown >= low && shown <= high;
    }).length;

    console.log(count);
});