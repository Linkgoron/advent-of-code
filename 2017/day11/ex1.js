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

    pos.y = Math.abs(pos.y);
    pos.x = Math.abs(pos.x);
    const diagonalSteps = Math.min(pos.y / 0.5, pos.x);
    const onedirection = (pos.x >= pos.y / 0.5) ? (pos.x - diagonalSteps) : (pos.y - (0.5 * diagonalSteps));
    console.log(diagonalSteps + onedirection);
});
