const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const input = data.toString().split(',');
    const pos = { x: 0, y: 0 };
    let maxDistance = 0;
    for (const step of input) {
        if (step === 'n') pos.y++
        else if (step === 's') pos.y--;
        else if (step === 'ne') { pos.y += 0.5; pos.x += 1; }
        else if (step === 'se') { pos.y -= 0.5; pos.x += 1; }
        else if (step === 'nw') { pos.y += 0.5; pos.x -= 1; }
        else if (step === 'sw') { pos.y -= 0.5; pos.x -= 1; }
        maxDistance = Math.max(maxDistance, computeDistance(pos.x, pos.y));
    }


    console.log(maxDistance);
});


function computeDistance(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    const diagonalSteps = Math.min(y / 0.5, x);
    const oneDirection = (x >= y / 0.5) ? (x - diagonalSteps) : (y - (0.5 * diagonalSteps));
    return diagonalSteps + oneDirection;
}