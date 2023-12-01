const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const wind = data.toString().trim().split('');
    const shapes = [{
        form: ['####'],
    }, {
        form: [' # ', '###', ' # ']
    }, {
        form: ['  #', '  #', '###'],
    }, {
        form: ['#', '#', '#', '#'],
    }, {
        form: ['##', '##'],
    }];

    const map = new Set();
    let maxY = -1;
    let winder = 0;
    for (let i = 0; i < 2022; i++) {
        const shape = shapes[i % shapes.length];
        let wasStopped = false;
        let position = getStartLocation(2, maxY + 3, shape);
        let prevLocation;
        while (!wasStopped) {
            drawShapeLocs(map, position, prevLocation);
            // printMap(map);
            const dir = wind[winder];
            winder = (winder + 1) % wind.length;
            const windMove = canMove(map, position, dir);
            if (windMove.canMove) {
                drawShapeLocs(map, windMove.nextPositions, position);
                position = windMove.nextPositions;
            }

            const moveDown = canMove(map, position);
            if (!moveDown.canMove) {
                wasStopped = true;
            } else {
                prevLocation = position;
                position = moveDown.nextPositions;
            }
        }
        maxY = Math.max(maxY, ...position.map(x=>x.y));
    }
    printMap(map);
    console.log(maxY + 1);
});

function getStartLocation(startX, startY, shape) {
    const positions = [];
    let topY = startY + shape.form.length;
    for (let y = 0; y < shape.form.length; y++) {
        const row = shape.form[y];
        for (let x = 0; x < row.length; x++) {
            const xCoordinate = startX + x;
            const yCoordinate = topY - y;
            if (row[x] !== ' ') {
                positions.push({ x: xCoordinate, y: yCoordinate });
            }
        }
    }
    return positions;
}

function drawShapeLocs(map, nextLocation, prevLocation) {
    if (prevLocation) {
        for (const loc of prevLocation) {
            map.delete(`${loc.x}, ${loc.y}`);
        }
    }
    for (const loc of nextLocation) {
        map.add(`${loc.x}, ${loc.y}`);
    }
}

function canMove(map, shapePosition, direction) {
    if (direction === '>') {
        const r = Math.max(...shapePosition.map(x => x.x));
        if (r === 6) {
            return { canMove: false };
        }
        const myPoints = new Set(shapePosition.map(x => `${x.x}, ${x.y}`));
        const nextPositions = shapePosition.map(x => ({ x: x.x + 1, y: x.y }));
        const canMove = nextPositions.every(pos => myPoints.has(`${pos.x}, ${pos.y}`) || !map.has(`${pos.x}, ${pos.y}`));
        if (!canMove) {
            return { canMove: false };
        }
        return { canMove: true, nextPositions };
    }

    if (direction === '<') {
        const r = Math.min(...shapePosition.map(x => x.x));
        if (r === 0) {
            return { canMove: false };
        }
        const myPoints = new Set(shapePosition.map(x => `${x.x}, ${x.y}`));
        const nextPositions = shapePosition.map(x => ({ x: x.x - 1, y: x.y }));
        const canMove = nextPositions.every(pos => myPoints.has(`${pos.x}, ${pos.y}`) || !map.has(`${pos.x}, ${pos.y}`));
        if (!canMove) {
            return { canMove: false };
        }
        return { canMove: true, nextPositions };
    }

    const r = Math.min(...shapePosition.map(x => x.y));
    if (r === 0) {
        return { canMove: false };
    }
    const myPoints = new Set(shapePosition.map(x => `${x.x}, ${x.y}`));
    const nextPositions = shapePosition.map(x => ({ x: x.x, y: x.y - 1 }));
    const canMove = nextPositions.every(pos => myPoints.has(`${pos.x}, ${pos.y}`) || !map.has(`${pos.x}, ${pos.y}`));
    if (!canMove) {
        return false;
    }
    return { canMove: true, nextPositions };
}

function printMap(map) {
    const minX = 0;
    const maxX = 7;
    const minY = 0;
    const maxY = Math.max(3, ...[...map].map(x=>Number(x.split(', ')[1])));    
    for (let y = maxY; y >= minY; y--) {
        let row = '|';
        for (let x = minX; x < maxX; x++) {
            const key = `${x}, ${y}`;
            if (map.has(key)) {
                row += '#';
            } else {
                row += ' ';
            }
        }
        row += '|'
        console.log(row);
    }
    let lastRow = '|';
    for (let x = minX; x < maxX; x++) {
        lastRow += '-';
    }
    lastRow += '|';
    console.log(lastRow);
    console.log();
}