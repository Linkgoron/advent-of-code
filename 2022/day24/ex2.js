const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rawRows = data.toString().trim().split(/\r?\n/);
    const storms = rawRows.map((row, y) => {
        return row.trim().split('').map((char, x) => {
            if (char === '.' || char === '#' || char === 'E') return;
            return {
                direction: char,
                x: x - 1,
                y: y - 1,
            }
        }).filter(Boolean)
    }).flat();

    const minX = 0;
    const minY = 0;
    const maxY = rawRows.length - 2;
    const maxX = rawRows[0].length - 2;
    // console.log(minX, maxX, minY, maxY);
    let currentStartPosition = `0, -1`;
    let expeditionPositions = new Set([`0, -1`]);
    const goals = [{ x: maxX - 1, y: maxY }, { x: 0, y: -1 }, { x: maxX - 1, y: maxY }];
    let currentGoalIndex = 0;
    for (let i = 0; i < 5000; i++) {
        if (currentGoalIndex > 0) {
            // console.log(i, expeditionPositions);
        }
        const currentGoal = goals[currentGoalIndex];
        for (const storm of storms) {
            const { xDiff, yDiff } = dirMap[storm.direction];
            storm.x += xDiff;
            storm.y += yDiff;
            // console.log(storm, { maxX, minX, maxY, minY });
            if (storm.x === maxX) {
                storm.x = 0;
            } else if (storm.x < minX) {
                storm.x = maxX - 1;
            }

            if (storm.y === maxY) {
                storm.y = 0;
            } else if (storm.y < minY) {
                storm.y = maxY - 1;
            }
        }
        const takenPositions = new Set(storms.map(s => `${s.x}, ${s.y}`));
        let nextTurnPositions = new Set();
        for (const position of expeditionPositions) {
            let [x, y] = position.split(', ').map(Number);
            const nextPos = generateNextPositions({ x, y }, minX, maxX, minY, maxY, currentGoal);
            const okNextPos = nextPos.filter(x => !takenPositions.has(`${x.x}, ${x.y}`));
            for (const pos of okNextPos) {
                nextTurnPositions.add(`${pos.x}, ${pos.y}`);
            }
        }

        if (nextTurnPositions.has(`${currentGoal.x}, ${currentGoal.y}`)) {
            nextTurnPositions.clear();
            nextTurnPositions.add(`${currentGoal.x}, ${currentGoal.y}`);
            currentGoalIndex++;
            if (currentGoalIndex === goals.length) {
                console.log('done all goals', i + 1);
                return;
            }
        }

        expeditionPositions = nextTurnPositions;
    }
});

const dirMap = {
    '>': {
        xDiff: 1,
        yDiff: 0,
    },
    'v': {
        xDiff: 0,
        yDiff: 1,
    },
    '^': {
        xDiff: 0,
        yDiff: -1,
    },
    '<': {
        xDiff: -1,
        yDiff: 0,
    },
}

function printIt(storms, minX, maxX, minY, maxY, expeditionPositions, minute) {
    if (minute) {
        console.log('minute', minute);
    }
    const takenPositions = new Map();
    for (const storm of storms) {
        const coordinate = `${storm.x}, ${storm.y}`;
        if (takenPositions.has(coordinate)) {
            const currentValue = takenPositions.get(coordinate);
            if (typeof currentValue === 'number') {
                takenPositions.set(coordinate, currentValue + 1)
            } else {
                takenPositions.set(coordinate, 2);
            }
        } else {
            takenPositions.set(coordinate, storm.direction);
        }
        storms.map(elf => `${elf.x}, ${elf.y}`)
    }
    console.log(`#${expeditionPositions.has('0, -1') ? 'E' : ' '}${'#'.repeat(maxX)}`)
    for (let y = minY; y < maxY; y++) {
        let row = '#';
        for (let x = minX; x < maxX; x++) {
            if (takenPositions.has(`${x}, ${y}`)) {
                row += takenPositions.get(`${x}, ${y}`);
            } else if (expeditionPositions.has(`${x}, ${y}`)) {
                row += 'E';
            } else {
                row += '.';
            }
        }
        console.log(row + '#');
    }
    console.log('#'.repeat(maxX) + ' #')
}

function generateNextPositions(position, minX, maxX, minY, maxY, currentGoal) {
    let positions = [];
    for (const [xDiff, yDiff] of [[0, 1], [0, -1], [1, 0], [-1, 0], [0, 0]]) {
        const nextX = position.x + xDiff;
        const nextY = position.y + yDiff;
        if (nextX === currentGoal.x && nextY === currentGoal.y) {
            positions.push({ x: nextX, y: nextY });
        }
        if (xDiff === 0 && yDiff === 0) {
            positions.push({ x: nextX, y: nextY});
        }
        if (nextX >= maxX) continue
        if (nextX < minX) continue
        if (nextY >= maxY) continue;
        if (nextY < minY) continue;
        positions.push({ x: nextX, y: nextY });
    }
    return positions;
}

// 203 too low