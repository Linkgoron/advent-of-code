const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const info = data.toString().split(',').map(x => x.trim()).map(x => ({
        side: x[0],
        steps: parseInt(x.substring(1))
    }));

    let location = { x: 0, y: 0 };
    let direction = 'north';
    const key = (x, y) => `${x},${y}`;

    const visited = new Set([key(0, 0)]);

    for (const step of info) {
        direction = getNewDirection(direction, step.side);
        for (let i = 0; i < step.steps; i++) {
            location = computeStep(direction, location, 1);
            if (visited.has(key(location.x, location.y))) {
                console.log(Math.abs(location.x) + Math.abs(location.y));
                return;
            }
            visited.add(key(location.x, location.y));
        }
    }
});

function getNewDirection(currentDirection, side) {
    if (currentDirection === 'north') {
        return side === 'R' ? 'east' : 'west';
    }
    if (currentDirection === 'east') {
        return side === 'R' ? 'south' : 'north';
    }
    if (currentDirection === 'south') {
        return side === 'R' ? 'west' : 'east';
    }
    if (currentDirection === 'west') {
        return side === 'R' ? 'north' : 'south';
    }
}

function computeStep(direction, location, numSteps) {
    if (direction === 'north') {
        return {
            x: location.x,
            y: location.y + numSteps
        }
    }

    if (direction === 'south') {
        return {
            x: location.x,
            y: location.y - numSteps
        }
    }

    if (direction === 'east') {
        return {
            x: location.x + numSteps,
            y: location.y
        }
    }

    if (direction === 'west') {
        return {
            x: location.x - numSteps,
            y: location.y
        }
    }
}