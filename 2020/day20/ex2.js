const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const tiles = data.toString().trim().split(/(\r?\n\r?\n)/gm).map(x => x.trim()).filter(Boolean).map(row => {
        const [numberRow, ...tile] = row.split(/\r?\n/g).map(x => x.trim());
        const number = numberRow.split(' ')[1].replace(':', '');
        const sides = [...getSides(tile)];
        return {
            number,
            sides,
            tile: tile,
            options: new Set(sides.map(x => [x, x.split('').reverse().join('').trim()]).flat()),
            canMatch: new Set(),
        }
    });

    for (let tile of tiles) {
        tile.canMatch = new Set(tiles.filter(other => other !== tile && other.sides.some(side => tile.options.has(side))).map(x => x.number));
    }
    tiles.sort((a, b) => (a.canMatch.size - b.canMatch.size));
    const res = search(tiles);
    const len = Math.sqrt(tiles.length) - 1;

    const finalRes = stitch(res, len + 1, tiles[0].tile[0].length);
    console.log(finalRes);
});

function stitch(map, rowCount, tileSize) {
    const rows = [];
    for (let row = 0; row < tileSize * rowCount; row++) {
        let rowStr = '';
        if (row % tileSize === 0 || ((row + 1) % tileSize === 0)) {
            continue;
        }
        for (let col = 0; col < tileSize * rowCount; col++) {
            const coords = `${Math.floor(col / tileSize)},${Math.floor(row / tileSize)}`;
            const cur = map.get(coords);
            if (col % tileSize === 0 || ((col + 1) % tileSize === 0)) {
                continue;
            }
            rowStr += cur.tile[row % tileSize][col % tileSize];
        }
        rows.push(rowStr);
    }
    let current = rows;
    const total = rows.reduce((acc, cur) => cur.split('').filter(x => x === '#').length + acc, 0);
    const monster = [/..................#./, /#....##....##....###/, /.#..#..#..#..#..#.../];
    const monsterSize = monster[0].source.concat(monster[1].source).concat(monster[2].source).split('').filter(x => x === '#').length;
    const monsterLength = monster[0].source.length;

    for (let v = 0; v < 2; v++) {
        for (let orientation = 0; orientation < 4; orientation++) {
            let cancel = 0;
            for (let row = 0; row < rows.length - 2; row++) {
                for (let col = 0; col < rows.length - monsterLength; col++) {
                    const firstLineMatch = monster[0].test(current[row].substring(col, col + monsterLength));
                    const secondLineMatch = monster[1].test(current[row + 1].substring(col, col + monsterLength));
                    const thirdLineMatch = monster[2].test(current[row + 2].substring(col, col + monsterLength));
                    if (firstLineMatch && secondLineMatch && thirdLineMatch) {
                        cancel += monsterSize;
                    }
                }
            }
            if (cancel > 0) {
                return total - cancel;
            }
            current = rotateRightString(current);
        }
        current = flipVertString(current);
    }
    throw new Error('wat');
}

function search(pieces, map = new Map(), taken = new Set(), location = { x: 0, y: 0 }) {
    if (taken.size === pieces.length) {
        return map;
    }

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

function doesFit(piece, up, left) {
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
    let newTile = [];
    for (let i = 0; i < tile.length; i++) {
        newTile[i] = [...getColumn(tile, i)].reverse().join('');
    }
    const res = {
        number,
        sides: [...getSides(newTile)],
        tile: newTile,
        options,
        canMatch,
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

    const newTile = [];
    for (let i = 0; i < tile.length; i++) {
        newTile[i] = tile[tile.length - 1 - i];
    }

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

function rotateRightString(tile) {
    let newTile = Array(tile.length);
    for (let i = 0; i < tile.length; i++) {
        newTile[i] = [...getColumn(tile, i)].reverse().join('');
    }
    return newTile;
}

function flipVertString(tile) {
    let newTile = [];
    for (let i = 0; i < tile.length; i++) {
        newTile[i] = tile[tile.length - 1 - i];
    }
    return newTile;
}