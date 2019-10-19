const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const seed = data.toString().trim();
    const path = travel(seed);
    console.log(path);
});

function travel(seed) {
    const toVisit = [{ x: 0, y: 0, path: '', step: 0 }];
    while (toVisit.length > 0) {
        const current = toVisit.shift();
        if (current.x === 3 && current.y === 3) {
            return current.path;
        }

        for (const pos of nextPositions(seed, current)) {
            toVisit.push(pos);
        }
    }
}

function* nextPositions(seed, current) {
    const hashing = hash(seed + current.path);
    const doorState = openDoors(hashing);
    if (current.y > 0 && doorState.up) {
        yield { x: current.x, y: current.y - 1, step: current.step + 1, path: current.path + 'U' };
    }
    if (current.y < 3 && doorState.down) {
        yield { x: current.x, y: current.y + 1, step: current.step + 1, path: current.path + 'D' };
    }
    if (current.x > 0 && doorState.left) {
        yield { x: current.x - 1, y: current.y, step: current.step + 1, path: current.path + 'L' };
    }
    if (current.x < 3 && doorState.right) {
        yield { x: current.x + 1, y: current.y, step: current.step + 1, path: current.path + 'R' };
    }
}

function hash(toHash) {
    return crypto.createHash('md5').update(toHash).digest("hex").substring(0, 4);
}

const allowedLetters = new Set(['b', 'c', 'd', 'e', 'f']);
function isOpen(letter) {
    return allowedLetters.has(letter);
}

function openDoors(computation) {
    return {
        up: isOpen(computation[0]),
        down: isOpen(computation[1]),
        left: isOpen(computation[2]),
        right: isOpen(computation[3]),
    }
}