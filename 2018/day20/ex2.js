const fs = require('fs');
const key = (x, y) => `${x},${y}`;
const coordinates = (key) => { const s = key.split(',').map(x => parseInt(x)); return { x: s[0], y: s[1] } };

fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error(err);
    const rd = rawData.toString();
    const map = new Map();
    map.set(key(0, 0), 'X');
    walk(rd, 1, { x: 0, y: 0 }, map, false);
    const m = [...map.keys()].map(coordinates);
    const minX = Math.min(...m.map(x => x.x));
    const minY = Math.min(...m.map(x => x.y));
    const maxX = Math.max(...m.map(x => x.x));
    const maxY = Math.max(...m.map(x => x.y));
    print(map, { min: minY, max: maxY }, { min: minX, max: maxX });
    const visited = new Set([key(0, 0)]);
    const toVisit = new Set([key(0, 0)]);
    const travel = [{ x: 0, y: 0, doors: 0 }];
    let howMany = 0;
    for (let i = 0; i < travel.length; i++) {
        const { x, y, doors } = travel[i];
        if (doors >= 1000) howMany++;
        visited.add(key(x, y));

        if ((map.get(key(x + 1, y)) === '|') && !visited.has(key(x + 2, y))) {
            travel.push({ x: x + 2, y, doors: doors + 1 });
            toVisit.add(key(x + 2, y));
        }
        if ((map.get(key(x - 1, y)) === '|') && !visited.has(key(x - 2, y))) {
            travel.push({ x: x - 2, y, doors: doors + 1 });
            toVisit.add(key(x - 2, y));
        }
        if ((map.get(key(x, y + 1)) === '-') && !visited.has(key(x, y + 2))) {
            travel.push({ x, y: y + 2, doors: doors + 1 });
            toVisit.add(key(x, y + 2));
        }
        if ((map.get(key(x, y - 1)) === '-') && !visited.has(key(x, y - 2))) {
            travel.push({ x, y: y - 2, doors: doors + 1 });
            toVisit.add(key(x, y - 2));
        }
    }
    console.log(howMany);
});

function print(map, xRange, yRange) {
    for (let y = yRange.min; y <= yRange.max; y++) {
        let row = '';
        for (let x = xRange.min; x <= xRange.max; x++) {
            row += map.get(key(x, y)) || '#';
        }
        console.log(row);
    }
}

function walk(road, pos, loc, map, continueTravelLocation) {
    let i = pos;
    for (; road[i] !== '(' && road[i] !== ')' && road[i] !== '|' && road[i] !== '$'; i++) {
        // need to handle ')';
        const letter = road[i];
        if (letter === 'W') {
            map.set(key(loc.x - 1, loc.y), '|');
            map.set(key(loc.x - 1, loc.y - 1), '#');
            map.set(key(loc.x - 1, loc.y + 1), '#');
            loc.x -= 2;
        } else if (letter === 'E') {
            map.set(key(loc.x + 1, loc.y), '|');
            map.set(key(loc.x + 1, loc.y - 1), '#');
            map.set(key(loc.x + 1, loc.y + 1), '#');
            loc.x += 2;
        } else if (letter === 'N') {
            map.set(key(loc.x, loc.y - 1), '-');
            map.set(key(loc.x - 1, loc.y - 1), '#');
            map.set(key(loc.x + 1, loc.y - 1), '#');
            loc.y -= 2;
        } else if (letter === 'S') {
            map.set(key(loc.x, loc.y + 1), '-');
            map.set(key(loc.x - 1, loc.y + 1), '#');
            map.set(key(loc.x + 1, loc.y + 1), '#');
            loc.y += 2;
        } else throw new Error(`bad letter, ${letter}`);
        map.set(key(loc.x, loc.y), '.');
    }
    if (road[i] === '$') return;
    if (road[i] === '|' || road[i] === ')') {
        if (continueTravelLocation === -1 || continueTravelLocation === undefined) return;
        return walk(road, continueTravelLocation, { ...loc }, map);
    }

    let nextClosing = i + 1;
    const travelContinuations = [i + 1];
    let count = 0;
    for (nextClosing = i + 1; road[nextClosing] !== ')' || count != 0; nextClosing++) {
        if (count === 0 && road[nextClosing] === '|') travelContinuations.push(nextClosing + 1);
        if (road[nextClosing] !== '(') count++;
        if (road[nextClosing] !== ')') count--;
    }
    const ignoreTravel = road[nextClosing - 1] === '|';
    if (ignoreTravel) travelContinuations.pop();
    for (const travel of travelContinuations) {
        walk(road, travel, { ...loc }, map, ignoreTravel ? undefined : nextClosing + 1);
    }
    if (ignoreTravel) {
        walk(road, nextClosing + 1, { ...loc }, map);
    }
}