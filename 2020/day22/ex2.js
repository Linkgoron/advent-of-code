const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const { decks } = data.toString().trim().split(/\r?\n/gm).map(x => x.trim()).filter(Boolean).reduce((acc, row) => {
        if (row === 'Player 1:') {
            acc.mode = 0;
            return acc;
        }
        if (row === 'Player 2:') {
            acc.mode = 1;
            return acc;
        }
        acc.decks[acc.mode].push(Number(row));
        return acc;
    }, {
        mode: 0,
        decks: [[], []],
    });
    const res = playGame(decks[0], decks[1]);
    const score = res.deck.slice().reverse().reduce((acc, cur, i) => {
        return acc + cur * (i + 1);
    });
    console.log(score);
});


function playGame(deck1, deck2) {
    const history = new Set();
    while (deck1.length > 0 && deck2.length > 0) {
        if (history.has(deckKeys(deck1, deck2))) {
            return { winner: '1', deck: deck1 };
        }

        history.add(deckKeys(deck1, deck2));
        const card1 = deck1.shift();
        const card2 = deck2.shift();
        if (card1 <= deck1.length && card2 <= deck2.length) {
            const result = playGame(deck1.slice(0, card1), deck2.slice(0, card2));
            const d1Winner = result.winner === '1';
            const intoDeck = d1Winner ? deck1 : deck2;
            intoDeck.push(d1Winner ? card1 : card2);
            intoDeck.push(d1Winner ? card2 : card1);
            continue;
        }

        const d1Winner = card1 > card2;
        const intoDeck = d1Winner ? deck1 : deck2;
        intoDeck.push(d1Winner ? card1 : card2);
        intoDeck.push(d1Winner ? card2 : card1);
    }
    return {
        winner: deck1.length === 0 ? '2' : '1',
        deck: deck1.length === 0 ? deck2 : deck1,
    };
}

function deckKeys(deck1, deck2) { return deck1.join(',') + '-' + deck2.join(','); };
