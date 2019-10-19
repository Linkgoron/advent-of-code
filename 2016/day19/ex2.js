const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    let initPlayers = parseInt(data.toString().trim());
    console.log(result(initPlayers));
});

function result(initPlayers) {
    let players = new Array(initPlayers);
    for (let i = 0; i < initPlayers; i++) {
        players[i] = i + 1;
    }

    while (players.length > 1) {
        const oneAfterMiddle = Math.floor(players.length / 2);
        const modifier = (players.length % 2) ? 0 : 1;
        const secondHalfSurvivor = (1 + oneAfterMiddle + modifier) % 3;
        const secondHalfAlive = players.filter((x, i) => (i >= oneAfterMiddle) && (i % 3) === secondHalfSurvivor);
        // played until players.length/3 before players start wrapping around.
        const played = players.filter((x, i) => i < Math.ceil(players.length / 3))
        const nextToPlay = players.slice(played.length, oneAfterMiddle);
        players = nextToPlay.concat(secondHalfAlive).concat(played);
    }

    // avoid edge cases if there are any in small situation
    // while (players.length > 10) {
    //     for (let currentPlayer = 0; currentPlayer < players.length; currentPlayer++) {
    //         const against = Math.floor(currentPlayer + (players.length / 2)) % players.length;
    //         players.splice(against, 1);
    //         if (against < currentPlayer) {
    //             currentPlayer--;
    //         }
    //     }
    // }
    return players[0];
}