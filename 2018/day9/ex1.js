const LinkedList = require('./utils.js');
const players = {};
const items = new LinkedList(0);
let currentPlayer = 0;
const numberOfPlayers = 413;

for (let j = 1; j <= 71082; j++) {
    if (j % 23 !== 0) {
        items.goRight(1);
        items.add(j);
    } else {
        if (players[currentPlayer] === undefined) players[currentPlayer] = 0;
        players[currentPlayer] += j;
        items.goLeft(7);
        const removedValue = items.remove();
        players[currentPlayer] += removedValue;
    }
    currentPlayer = (currentPlayer + 1) % numberOfPlayers;
}

console.log(Math.max(...Object.values(players)));