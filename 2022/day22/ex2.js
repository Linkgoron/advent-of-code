const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const [rawMap, rawPath] = data.toString().split(/\r?\n\r?\n/);
    const rawMapRows = rawMap.split(/\r?\n/);
    const faces = readFaces(rawMapRows);
    buildNeighbours(faces);
    const map = new Map(rawMapRows.map((row, y) => {
        const chars = row.split('');
        const items = [];
        for (let x = 0; x < row.length; x++) {
            if (chars[x] === ' ') continue;
            items.push([`${x}, ${y}`, chars[x]]);
        }
        return items;
    }).flat());
    const maxX = rawMapRows.reduce((a, b) => a > b.length ? a : b.length, 0);
    const maxY = rawMapRows.length;
    let size = Math.min(rawMapRows.reduce((a, b) => a > b.length ? a : b.length, 0), rawMapRows.length) / 3;

    let state = {
        position: {
            face: faces[0],
            x: 0,
            y: 0,
        },
        direction: 'right',
    }
    const commands = [...rawPath.match(/\d+\D?/g)].map(x => ({
        count: x.match(/^\d+$/) ? Number(x) : Number(x.slice(0, -1)),
        turnDirection: x.match(/^\d+$/) ? undefined : x[x.length - 1],
    }))

    for (const command of commands) {
        for (let i = 0; i < command.count; i++) {
            const nextPos = computeStep(state.direction, state.position, size);
            if (!nextPos.canMove) break;
            state.position = nextPos.position;
            if (nextPos.newDirection) {
                state.direction = nextPos.newDirection
            }
        }
        if (command.turnDirection) {
            state.direction = dirMap[state.direction].turn[command.turnDirection];
        }
    }
    const realX = state.position.face.initX + state.position.x;
    const realY = state.position.face.initY + state.position.y;
    console.log((1000 * (realY + 1)) + 4 * (1 + realX) + dirMap[state.direction].score);
});

function buildNeighbours(faces) {
    const dirs = ['left', 'right', 'up', 'down'];

    // find adjacent to face
    for (const face of faces) {
        face.neighbours.down = faces.find(x => x.quadrent.y === face.quadrent.y + 1 && x.quadrent.x === face.quadrent.x);
        face.neighbours.up = faces.find(x => x.quadrent.y === face.quadrent.y - 1 && x.quadrent.x === face.quadrent.x);
        face.neighbours.right = faces.find(x => x.quadrent.x === face.quadrent.x + 1 && x.quadrent.y === face.quadrent.y);
        face.neighbours.left = faces.find(x => x.quadrent.x === face.quadrent.x - 1 && x.quadrent.y === face.quadrent.y);
    }

    // find non-adjacent to face but must be right (because of cube shape, all right/left in the same "col" are the same)
    // and all up/down in the same "row" are the same.
    for (const face of faces) {
        if (!face.neighbours.up) {
            const otherUp = faces.find(x => x.quadrent.y === face.quadrent.y && x.neighbours.up);
            face.neighbours.up = otherUp?.neighbours?.up;
        }
        if (!face.neighbours.down) {
            const otherdown = faces.find(x => x.quadrent.y === face.quadrent.y && x.neighbours.down);
            face.neighbours.down = otherdown?.neighbours?.down;
        }
        if (!face.neighbours.right) {
            const otherRight = faces.find(x => x.quadrent.x === face.quadrent.x && x.neighbours.right);
            face.neighbours.right = otherRight?.neighbours?.right;
        }
        if (!face.neighbours.left) {
            const otherLeft = faces.find(x => x.quadrent.x === face.quadrent.x && x.neighbours.left);
            face.neighbours.left = otherLeft?.neighbours?.left;
        }
    }

    // go around the cube to find the other side.
    for (const face of faces) {
        if (!face.neighbours.left) {
            const thatFace = stepsInCubeDirection(face, 'right', 3);
            if (thatFace) {
                face.neighbours.left = thatFace;
            }
        }
        if (!face.neighbours.right) {
            const thatFace = stepsInCubeDirection(face, 'left', 3);
            if (thatFace) {
                face.neighbours.right = thatFace;
            }
        }
        if (!face.neighbours.up) {
            const thatFace = stepsInCubeDirection(face, 'down', 3);
            if (thatFace) {
                face.neighbours.up = thatFace;
            }
        }
        if (!face.neighbours.down) {
            const thatFace = stepsInCubeDirection(face, 'up', 3);
            if (thatFace) {
                face.neighbours.down = thatFace;
            }
        }

        // try to see if we have some missing things, that are only connected from one side.
        for (const neighbour of Object.values(face.neighbours)) {
            if (neighbour !== undefined) {
                const neighbourNeighbours = Object.values(neighbour.neighbours);
                const isConnected = neighbourNeighbours.some(x => x === face);
                if (isConnected) continue;
                if (neighbourNeighbours.filter(x => x === undefined).length === 0) {
                    throw new Error('zzz');
                }
                if (neighbourNeighbours.filter(x => x === undefined).length !== 1) continue;
                for (const dir of dirs) {
                    if (neighbour.neighbours[dir] === undefined) {
                        neighbour.neighbours[dir] = face;
                    }
                }
            }
        }
    }
    const missingStill = faces.filter(x => Object.values(x.neighbours).some(x => x === undefined));
    if (missingStill.length !== 0) {
        console.log(faces.map(x => ({ ...x, face: undefined })));
        throw new Error('can\'t solve this for now');
    }
}

function readFaces(rawMapRows) {
    let size = Math.min(rawMapRows.reduce((a, b) => a > b.length ? a : b.length, 0), rawMapRows.length) / 3;
    let faces = [];
    for (let yDir = 0; yDir < 4; yDir++) {
        for (let xDir = 0; xDir < 4; xDir++) {
            let initX = size * xDir;
            let initY = size * yDir;
            if (initY >= rawMapRows.length) {
                continue;
            }
            if (rawMapRows[initY][initX] === ' ' || rawMapRows[initY][initX] === undefined) {
                continue;
            }
            const face = new Map();
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (rawMapRows[initY + y][initX + x] === ' ') continue;
                    face.set(`${x}, ${y}`, rawMapRows[initY + y][initX + x]);
                }
            }
            faces.push({
                quadrent: { y: yDir, x: xDir },
                initX,
                initY,
                face,
                yQuad: yDir,
                xQuad: xDir,
                neighbours: { up: undefined, down: undefined, right: undefined, left: undefined }
            });
        }
    }
    return faces;
}

let dirMap = {
    'right': { xDiff: 1, yDiff: 0, score: 0, char: '>', turn: { L: 'up', R: 'down' }, opposite: 'left' },
    'down': { xDiff: 0, yDiff: 1, score: 1, char: 'v', turn: { L: 'right', R: 'left' }, opposite: 'up' },
    'left': { xDiff: -1, yDiff: 0, score: 2, char: '<', turn: { L: 'down', R: 'up' }, opposite: 'right' },
    'up': { xDiff: 0, yDiff: -1, score: 3, char: '^', turn: { L: 'left', R: 'right' }, opposite: 'down' },
}
function computeStep(direction, position, size) {
    const { x, y, face } = position;
    const { xDiff, yDiff } = dirMap[direction];
    let nextX = x + xDiff;
    let nextY = y + yDiff
    if (nextX === -1 || nextX === size || nextY === -1 || nextY === size) {
        return computeFaceChangeStep(position, direction, size)
    }
    const pos = face.face.get(`${nextX}, ${nextY}`);
    if (pos === '#') {
        return {
            canMove: false,
        }
    }
    return {
        canMove: true,
        position: {
            x: nextX,
            y: nextY,
            face,
        }
    }
}

function computeFaceChangeStep(position, dir, size) {
    const dirs = ['left', 'right', 'up', 'down'];
    const { face } = position;
    const changeTo = face.neighbours[dir];
    const neighbourToMeDir = dirs.find(nDir => changeTo.neighbours[nDir] === face);
    let nextX;
    let nextY;
    if (neighbourToMeDir === 'up') {
        nextY = 0;
        nextX = dir === 'down' ? position.x : (dir === 'up' ? (size - position.x - 1) : dir === 'left' ? position.y : (size - position.y - 1));
    } else if (neighbourToMeDir === 'down') {
        nextY = size - 1;
        nextX = dir === 'up' ? position.x : (dir === 'down' ? (size - position.x - 1) : dir === 'right' ? position.y : (size - position.y - 1));
    } else if (neighbourToMeDir === 'left') {
        nextY = dir === 'right' ? position.y : (dir === 'left' ? (size - position.y - 1) : dir === 'up' ? position.x : (size - position.x - 1));
        nextX = 0;
    } else if (neighbourToMeDir === 'right') {
        nextY = dir === 'left' ? position.y : (dir === 'right' ? (size - position.y - 1) : dir === 'down' ? position.x : (size - position.x - 1));
        nextX = size - 1;
    }

    if (changeTo.face.get(`${nextX}, ${nextY}`) === '#') {
        return {
            canMove: false,
        }
    }
    // console.log('switching endPos', nextX, nextY, neighbourToMeDir, dir, { ...face, face: undefined });
    return {
        canMove: true,
        position: {
            face: changeTo,
            x: nextX,
            y: nextY,
        },
        newDirection: dirMap[neighbourToMeDir].opposite
    }
}

function printMap(map, realPosition, direction, minX, maxX, minY, maxY) {
    for (let y = minY; y < maxY; y++) {
        let row = '';
        for (let x = minX; x < maxX; x++) {
            if (realPosition.x === x && realPosition.y === y) {
                row += dirMap[direction].char;
            } else if (map.has(`${x}, ${y}`)) {
                row += map.get(`${x}, ${y}`)
            } else {
                row += ' ';
            }
        }
        console.log(row);
    }
    console.log('----------');
}


function getRealPosition(state) {
    return {
        x: state.position.face.initX + state.position.x,
        y: state.position.face.initY + state.position.y,
    }
}

function printableFace(face) {
    return { ...face, face: undefined };
}

function continueInDirection(face, direction) {
    const newNeighbour = face.neighbours[direction];
    if (!newNeighbour) {
        return undefined;
    }
    const nextDirection = Object.entries(newNeighbour.neighbours).find(([key, value]) => value === face);
    if (nextDirection === undefined) {
        return undefined;
    }

    return {
        face: newNeighbour,
        direction: dirMap[nextDirection[0]].opposite,
    }
}

function stepsInCubeDirection(face, direction, count) {
    let nextify = continueInDirection(face, direction);
    for (let i = 0; i < (count - 1) && nextify; i++) {
        if (nextify) {
            nextify = continueInDirection(nextify.face, nextify.direction);
        }
    }

    return nextify?.face;
}