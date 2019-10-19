const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    let initPlayers = parseInt(data.toString().trim());
    let players = new Array(initPlayers);
    for (let i = 0; i < initPlayers; i++) {
        players[i] = i + 1;
    }

    while (players.length > 1) {
        const initLength = players.length;
        players = players.filter((x, i) => i % 2 === 0);
        if (players.length > 1 && initLength % 2 === 1) {
            players.shift();
        }
    }
    console.log(players[0])
});