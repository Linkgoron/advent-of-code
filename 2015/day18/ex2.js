const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allPoints = data.toString().split('\r\n').map((row, y) => row.split('')
        .map((p, x) => p === '#' ? `${x},${y}` : undefined)).reduce((acc, cur) => acc.concat(cur), []).filter(Boolean);
    let on = new Set(allPoints);
    on.add(`0,0`);
    on.add(`0,99`);
    on.add(`99,99`);
    on.add(`99,0`);
    const gridSize = 100;
    const steps = 100;
    for (let i = 0; i < steps; i++) {
        on = oneRound(on, gridSize);
    }
    console.log(on.size);
});

function oneRound(onLights, gridSize) {
    const nextStep = new Set(onLights);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if([0,99].includes(x) && [0,99].includes(y)) continue;
            const isOn = onLights.has(`${x},${y}`);
            const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            const onNeighbours = neighbours
                .filter(([dirX, dirY]) => onLights.has(`${x + dirX},${y + dirY}`)).length;
            if (isOn) {
                if (onNeighbours < 2 || onNeighbours > 3) {
                    nextStep.delete(`${x},${y}`);
                }
            } else {
                if (onNeighbours === 3) {
                    nextStep.add(`${x},${y}`);
                }
            }
        }
    }
    return nextStep;
}
