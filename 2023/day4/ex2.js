const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const cards = data.toString().trim().split('\n').map(x => x.trim()).map((row) => {
        const { 1: cards } = row.split(': ');
        const [winners, items] = cards.split('|').map(x => x.trim().split(/ +/g).map(Number)).map(n => new Set(n));
        const winningItems = [...items].filter(x => winners.has(x));
        return {
            count: 1,
            winning: winningItems.length,
        }
    });

    for (let i = 0; i < cards.length; i++) {
        for (let cur = i + 1; cur <= i + cards[i].winning; cur++) {
            cards[cur].count += cards[i].count;
        }
    }
    console.log([...cards.values()].reduce((acc, cur) => acc + cur.count, 0));
});
