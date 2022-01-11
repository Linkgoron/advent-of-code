const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const [p1Start, p2Start] = data.toString().trim().split(/\r?\n/gi).map(x => Number(x.trim().split('starting position:')[1]));
    const players = [
        {
            num: 1,
            score: 0,
            pos: p1Start
        },
        {
            num: 2,
            score: 0,
            pos: p2Start
        },
    ]

    let curPlayerIndex = 0;
    let die = 100;
    let throws = 0;
    while (players.every(x => x.score < 1000)) {
        throws += 3;
        const throwOne = nextDie(die);
        const throwTwo = nextDie(throwOne);
        const throwThree = nextDie(throwTwo);
        const movement = throwOne + throwTwo + throwThree;
        die = throwThree;
        const curPlayer = players[curPlayerIndex];
        const newPos = nextPos(curPlayer.pos, movement);
        curPlayer.score += newPos
        curPlayer.pos = newPos;
        curPlayerIndex = curPlayerIndex === 0 ? 1 : 0;
    }
    const winner = players.find(x => x.score >= 1000);
    const loser = players.find(x => x.score < 1000);
    console.log(loser.score * throws);
});

function nextDie(die) {
    return die === 100 ? 1 : (die + 1);
}

function nextPos(pos, movement) {
    let next = (pos + movement) % 10;
    return next === 0 ? 10 : next;
}