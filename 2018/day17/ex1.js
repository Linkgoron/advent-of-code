const fs = require('fs');
const _ = require('lodash');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const key = (x, y) => `${x},${y}`;
    const coordinates = (key) => { const s = key.split(',').map(x => parseInt(x)); return { x: s[0], y: s[1] } };

    const yRange = {};
    const xRange = {};
    const map = new Map();
    for (const [first, second] of rawData.toString().split('\r\n').map(x => x.split(','))) {
        const [r1, r2] = second.split('=')[1].split('..').map(x => parseInt(x))
        const basis = parseInt(first.split(',')[0].split('=')[1]);

        if (first[0] === "y") {
            if (yRange.min === undefined || basis < yRange.min) {
                yRange.min = basis;
            }
            if (yRange.max === undefined || basis > yRange.max) {
                yRange.max = basis;
            }
            if (xRange.min === undefined || r1 < xRange.min) {
                xRange.min = r1;
            }
            if (xRange.max === undefined || r2 > xRange.max) {
                xRange.max = r2;
            }
            for (let i = r1; i <= r2; i++) {
                map.set(key(i, basis), '#');
            }
        } else {
            if (xRange.min === undefined || basis < xRange.min) {
                xRange.min = basis;
            }
            if (xRange.max === undefined || basis > xRange.max) {
                xRange.max = basis;
            }
            if (yRange.min === undefined || r1 < yRange.min) {
                yRange.min = r1;
            }
            if (yRange.max === undefined || r2 > yRange.max) {
                yRange.max = r2;
            }
            for (let i = r1; i <= r2; i++) {
                map.set(key(basis, i), '#');
            }
        }
    };

    xRange.min--;
    xRange.max++;
    let nextWater = [{ x: 500, y: yRange.min - 1 }];
    const maxTurn = 4000;
    for (var turn = 0; turn < maxTurn && nextWater.length > 0; turn++) {
        const water = _.uniqBy(nextWater, x => key(x.x, x.y));

        nextWater = [];
        for (let { x, y } of water) {
            if (y > yRange.max) continue;
            map.set(key(x, y), '|')
            const below = map.get(key(x, y + 1));
            if (below === '|') {
                continue;
            }
            if (below === undefined) {
                nextWater.push({ x, y: y + 1 });
                continue;
            }

            const additional = [{ x, y }];
            let curX = x;
            while (map.get(key(curX, y + 1)) !== undefined && map.get(key(curX, y + 1)) !== '|' && map.get(key(curX, y)) !== '#') {
                if (curX !== x) {
                    additional.push({ x: curX, y: y });
                }
                curX--;
            }

            let foundExit = false;
            if (map.get(key(curX, y)) !== '#') {
                nextWater.push({ x: curX, y: y });
                additional.push({ x: curX, y: y });
                foundExit = true;
            }

            curX = x;
            while (map.get(key(curX, y + 1)) !== undefined  && map.get(key(curX, y + 1)) !== '|' && map.get(key(curX, y)) !== '#') {
                if (curX !== x) {
                    additional.push({ x: curX, y: y });
                };
                curX++;
            }

            if (map.get(key(curX, y)) !== '#') {
                nextWater.push({ x: curX, y: y });
                additional.push({ x: curX, y: y });
                foundExit = true;
            }

            if (!foundExit) {
                nextWater.push({ x: x, y: y - 1, up: true });
                for (const p of additional) {
                    map.set(key(p.x, p.y), '~');
                }
            } else {
                for (const p of additional) {
                    map.set(key(p.x, p.y), '|');
                }
            }
        }
    }

    print(map, xRange, yRange);
    const relevant = [...map.entries()].filter(([k, v]) => {
        const { x, y } = coordinates(k);
        return y <= yRange.max && yRange.min <= y;
    }).filter(([k, v]) => v === '|' || v === '~');
    console.log(turn, relevant.length);

    function print(map, xRange, yRange) {
        for (let y = yRange.min; y <= yRange.max; y++) {
            let row = '';
            for (let x = xRange.min; x <= xRange.max; x++) {
                row += map.get(key(x, y)) || ' ';
            }
            console.log(row);
        }
    }
});