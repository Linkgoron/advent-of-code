const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const tiles = data.toString().trim().split(/(\r?\n\r?\n)/gm).map(x => x.trim()).filter(Boolean).map(row => {
        const [numberRow, ...tile] = row.split(/\r?\n/g);
        const number = numberRow.split(' ')[1].replace(':', '');
        const sides = [...getSides(tile)];
        const expandedSides = sides.map(x => [x, x.split('').reverse().join('')]);
        return {
            number,
            sides,
            tile,
            options: new Set(expandedSides.flat()),
            canMatch: new Set(),
        }
    });
    for (let tile of tiles) {
        tile.canMatch = new Set(tiles.filter(other => other !== tile && [...other.options].some(option => tile.options.has(option))).map(x => x.number));
    }

    tiles.sort((a, b) => (a.canMatch.size - b.canMatch.size));
    const res = search(tiles);
    const len = Math.sqrt(tiles.length) - 1;
    console.log(res.get(`0,0`).number * res.get(`0,${len}`).number * res.get(`${len},${len}`).number * res.get(`${len},0`).number);
});

function search(pieces, map = new Map(), taken = new Set(), location = { x: 0, y: 0 }) {
    const up = map.get(`${location.x},${location.y - 1}`);
    const left = map.get(`${location.x - 1},${location.y}`);
    const locationAfterThis = {
        x: location.x === Math.sqrt(pieces.length) - 1 ? 0 : location.x + 1,
        y: location.x === Math.sqrt(pieces.length) - 1 ? location.y + 1 : location.y,
    }

    for (const piece of pieces) {
        if (taken.has(piece.number)) {
            continue;
        }
        if ((up && !up.canMatch.has(piece.number)) || (left && !left.canMatch.has(piece.number))) {
            continue;
        }

        let currentPiece = piece;
        for (let v = 0; v < 2; v++) {
            for (let dir = 0; dir < 4; dir++) {
                if (doesFit(currentPiece, up, left)) {
                    const key = `${location.x},${location.y}`;
                    map.set(key, currentPiece);
                    taken.add(currentPiece.number);
                    if (taken.size === pieces.length) {
                        return map;
                    }
                    const sol = search(pieces, map, taken, locationAfterThis);
                    if (sol) {
                        return sol;
                    }
                    map.delete(key);
                    taken.delete(currentPiece.number);
                }
                currentPiece = rotateRight(currentPiece);
            }
            currentPiece = flipVertical(currentPiece);
        }
    }

    return undefined;
}

function doesFit(piece, up, left, print = false) {
    const upMatch = !up || up.sides[2] === piece.sides[0];
    const leftMatch = !left || left.sides[1] === piece.sides[3];
    return upMatch && leftMatch;
}

function* getSides(tile) {
    yield tile[0];
    yield [...getColumn(tile, tile.length - 1)].join('');
    yield tile[tile.length - 1];
    yield [...getColumn(tile, 0)].join('');
}

function* getColumn(tile, column) {
    for (let y = 0; y < tile.length; y++) {
        yield tile[y][column];
    }
}

const rotationMap = new Map();
function rotateRight(fullTile) {
    if (rotationMap.has(fullTile)) {
        return rotationMap.get(fullTile);
    }
    const { tile, number, options, canMatch } = fullTile;
    const newTile = [];
    for (let i = 0; i < tile.length; i++) {
        newTile[i] = [...getColumn(tile, i)].reverse().join('');
    }
    const res = {
        number,
        sides: [...getSides(newTile)],
        tile: newTile,
        options,
        canMatch
    };

    rotationMap.set(fullTile, res);
    return res;
}

const flipVerticalMap = new Map();
function flipVertical(fullTile) {
    if (flipVerticalMap.has(fullTile)) {
        return flipVerticalMap.get(fullTile);
    }
    const { tile, number, options, canMatch } = fullTile;

    const newTile = tile.slice().reverse();
    const res = {
        number,
        sides: [...getSides(newTile)],
        tile: newTile,
        options,
        canMatch,
    };

    flipVerticalMap.set(fullTile, res);
    return res;
}