const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const key = (x, y) => `${x},${y}`;
    const data = rawData.toString().split('\r\n').map((row, y) => row.split('').map((c, x) => ({ x, y, letter: c })))
        .reduce((acc, r) => acc.concat(r), []);
    const map = new Map();
    for (const { x, y, letter } of data) {
        if (letter !== ' ') {
            map.set(key(x, y), {
                isPlus: letter === '+',
                isLetter: letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90, orig: letter,
                x, y
            });
        }
    }

    function getNextByDirection(location, direction, map) {
        if (direction === 'right') return map.get(key(location.x + 1, location.y));
        if (direction === 'left') return map.get(key(location.x - 1, location.y));
        if (direction === 'up') return map.get(key(location.x, location.y - 1));
        if (direction === 'down') return map.get(key(location.x, location.y + 1));
        console.log('dir', direction);
        throw 'bad direction';
    }

    function getNext(travel, map) {
        if (!travel.location.isPlus) {
            return {
                location: getNextByDirection(travel.location, travel.direction, map),
                direction: travel.direction,
            }
        }
        for (const possibleDirection of [['right', 'left'], ['up', 'down']]) {
            const [dir1, dir2] = possibleDirection;
            if (travel.direction === dir1 || travel.direction === dir2) continue;

            if (getNextByDirection(travel.location, dir1, map)) {
                const nextLocation = getNextByDirection(travel.location, dir1, map);
                return {
                    direction: dir1,
                    location: nextLocation
                }
            }

            if (getNextByDirection(travel.location, dir2, map)) {
                const nextLocation = getNextByDirection(travel.location, dir2, map);
                return {
                    direction: dir2,
                    location: nextLocation
                }
            }
        }
        return undefined;
    }

    function isDeadEnd(travel, map) {
        return getNext(travel, map) === undefined;
    };

    const [_, value] = map.entries().next().value;
    let travel = {
        location: value,
        direction: 'down',
    }
    let res = '';
    console.log(travel);
    let steps = 0;
    while (travel.location !== undefined) {
        steps++;
        if (travel.location.isLetter) res += travel.location.orig;
        travel = getNext(travel, map);
    }
    console.log(res,steps);
});