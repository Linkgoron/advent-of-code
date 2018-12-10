const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const input = data.toString().split(',');
    const pos = { x: 0, y: 0 };

    for (const step of input) {
        if (step === 'n') pos.y++
        else if (step === 's') pos.y--;
        else if (step === 'ne') { pos.y += 0.5; pos.x += 1; }
        else if (step === 'se') { pos.y -= 0.5; pos.x += 1; }
        else if (step === 'nw') { pos.y += 0.5; pos.x -= 1; }
        else if (step === 'sw') { pos.y -= 0.5; pos.x -= 1; }
    }

    let stepsBack = 0;
    while (pos.x !== 0 || pos.y !== 0) {
        stepsBack++;
        if (pos.x === 0) {
            if (pos.y > 0) pos.y--
            else pos.y++;
            continue;
        }

        if (pos.x > 0) { pos.x -= 1; }
        else { pos.x += 1; }

        if (pos.y > 0) { pos.y -= 0.5; }
        else { pos.y += 0.5; }
    }

    console.log(stepsBack);
});
