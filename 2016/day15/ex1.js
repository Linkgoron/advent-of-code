const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const discs = data.toString().split('\r\n').map(x => x.trim().replace('.', '').replace(';', '').replace(',', '')).map(row => {
        const words = row.split(/ +/g);
        return {
            positions: parseInt(words[3]),
            current: parseInt(words[words.length - 1])
        }
    });

    let success = false;
    let state = discs;
    for (let i = 0; !success; i++) {
        if (canDrop(state)) {
            console.log('done', i);
            success = true;
        } else {
            state = nextTick(state);
        }
    }
});

function nextTick(discs) {
    return discs.map(x => ({
        positions: x.positions,
        current: (x.current + 1) % x.positions
    }))
}

function canDrop(discs) {
    let discState = discs;
    let ballPosition = (discState[0].current + 1) % discState[0].positions;
    for (let i = 0; i < discs.length; i++) {
        discState = nextTick(discState);
        if (discState[i].current !== ballPosition) {
            return false;
        }
    }
    return true;
}