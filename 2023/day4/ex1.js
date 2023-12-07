const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allScore = data.toString().trim().split('\n').map(x => x.trim()).map((row) => {
        const { 1: cards } = row.split(': ');
        const [winners, items] = cards.split('|').map(x => x.trim().split(/ +/g).map(Number)).map(n => new Set(n));
        const winningItems = [...items].filter(x => winners.has(x));
        return winningItems.length === 0 ? 0 : 2 ** (winningItems.length - 1);
    }).reduce((acc, cur) => acc + cur, 0);
    console.log(allScore);
});
