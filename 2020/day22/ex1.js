const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const { decks } = data.toString().trim().split(/\r?\n/gm).map(x => x.trim()).reduce((acc, row) => {
        if (row === 'Player 1:') {
            acc.mode = 0;
            return acc;
        }
        if (row === 'Player 2:') {
            acc.mode = 1;
            return acc;
        }
        if (row === '') {
            return acc;
        }
        acc.decks[acc.mode].push(Number(row));
        return acc;
    }, {
        mode: 0,
        decks: [[], []],
    });

    const [deck1, deck2] = decks;
    while (deck1.length > 0 && deck2.length > 0) {
        const card1 = deck1.shift();
        const card2 = deck2.shift();
        const d1Winner = card1 > card2;
        const intoDeck = d1Winner ? deck1 : deck2;
        intoDeck.push(d1Winner ? card1 : card2);
        intoDeck.push(d1Winner ? card2 : card1);
    }

    const winner = deck1.length > deck2.length ? deck1 : deck2;
    const score = winner.slice().reverse().reduce((acc, cur, i) => {
        return acc + cur * (i + 1);
    });
    console.log(deck1.length > 0)
    console.log(score);
});
