const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const magicNumber = parseInt(data.toString().trim());
    function code(x, y) { return ((x * x) + (3 * x) + (2 * x * y) + y + (y * y)) + magicNumber; }
    function binaryRep(number) { return number.toString(2).split(''); }
    function codeify(binaryString) { return binaryString.map(x => parseInt(x)).reduce((acc, cur) => ((acc + cur) % 2), 0) }
    function isOpenSpace(point) { return (codeify(binaryRep(code(point.x, point.y))) % 2) === 0 }

    const key = (x, y) => `${x},${y}`;
    const keyPoint = (point) => key(point.x, point.y);
    const visited = new Set([key(1, 1)]);
    const toVisit = [{ x: 1, y: 1, step: 0 }];
    while (toVisit.length > 0) {
        const current = toVisit.shift(0);
        for (const [dirX, dirY] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nextPlace = {
                x: current.x + dirX,
                y: current.y + dirY,
                step: current.step + 1
            }

            if (nextPlace.x < 0 || nextPlace.y < 0) continue;
            if (!visited.has(keyPoint(nextPlace)) && isOpenSpace(nextPlace) && nextPlace.step < 51) {
                visited.add(keyPoint(nextPlace));
                toVisit.push(nextPlace);
            }
        }
    }
    console.log(visited.size);

});
