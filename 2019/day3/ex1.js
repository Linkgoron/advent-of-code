require('fs').readFile('./ex1.input', (err, data) => {
    const [first, second] = data.toString().split('\n')
        .map(x => x.split(',').map(x => ({ dir: x[0], amount: parseInt(x.substring(1)) })));
    const locations = new Map();
    traverse(first, locations, '1');
    traverse(second, locations, '2');

    function toDist(str) {
        var item = str.split(',');
        return Math.abs(parseInt(item[0])) + Math.abs(parseInt(item[1]));
    }

    var res1 = [...locations.entries()]
        .filter(x => x[1].size === 2).map(([key, val]) => ({ key, val, dist: toDist(key) }))
        .sort((a, b) => a.dist - b.dist);
    console.log(res1[0].dist);

    function traverse(items, map, name) {
        let position = { x: 0, y: 0 }
        for (const { dir, amount } of items) {
            for (let count = 0; count < amount; count++) {
                if (dir === 'L') position.x--;
                else if (dir === 'R') position.x++;
                else if (dir === 'U') position.y--;
                else if (dir === 'D') position.y++;
                var coordinates = `${position.x},${position.y}`;
                var currentValue = map.get(coordinates) || new Set()
                currentValue.add(name);
                map.set(coordinates, currentValue);
            }
        }
    }
});