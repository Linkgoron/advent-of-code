const fs = require('fs');

const cards = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
const handTypes = ['high card', 'one pair', 'two pair', 'three of a kind', 'full house', 'four of a kind', 'five of a kind'];
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const hands = data.toString().trim().split('\n').map(row => {
        const [cards, bid] = row.split(' ');
        const cardsList = cards.split('');
        batchedCards = cardsList.reduce((acc, cur) => {
            acc[cur] = acc[cur] ? acc[cur] + 1 : 1
            return acc;
        }, {});
        return {
            cards,
            bid,
            batchedCards,
            handType: handType(batchedCards),
        }
    });

    const items = hands.sort(sortHands).map((x, i) => ({ ...x, rank: hands.length - i, score: (hands.length - i) * x.bid }))
    const score = items.reduce((acc, cur) => acc + cur.score, 0);
    console.log(score);
});

function handType(batchedCards) {
    const reHand = { ...batchedCards };
    if (reHand['J']) {
        const toAdd = reHand['J'];
        reHand['J'] = 0;
        const maxValue = Math.max(...Object.values(reHand));
        const [key] = Object.entries(reHand).find(([key, value]) => value === maxValue);
        reHand[key] = toAdd + reHand[key];
    }
    const values = Object.values(reHand);
    if (values.some(x => x === 5)) { return 'five of a kind' };
    if (values.some(x => x === 4)) { return 'four of a kind' };
    if (values.some(x => x === 3) && values.some(x => x === 2)) { return 'full house' };
    if (values.some(x => x === 3)) { return 'three of a kind' };
    if (values.filter(x => x === 2).length === 2) { return 'two pair' };
    if (values.some(x => x === 2)) { return 'one pair' };
    return 'high card';
}

function sortHands(a, b) {
    if (a.handType !== b.handType) {
        return handTypes.indexOf(b.handType) - handTypes.indexOf(a.handType);
    }
    for (let i = 0; i < 5; i++) {
        if (a.cards[i] === b.cards[i]) {
            continue;
        }
        return cards.indexOf(a.cards[i]) - cards.indexOf(b.cards[i]);
    }

    return 0;
}
