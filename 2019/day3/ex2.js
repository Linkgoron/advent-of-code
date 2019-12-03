require('fs').readFile('./ex2.input', (err, data) => {
    const [first, second] = data.toString().split('\n')
        .map(x => x.split(',').map(x => ({ dir: x[0], amount: parseInt(x.substring(1)) })));
    const locations = new Map();
    traverse(first, locations, '1');
    traverse(second, locations, '2');
    const res = [...locations.values()].filter(item => item.size === 2).map(val => val.get('1') + val.get('2')).sort((a, b) => a - b);
    console.log(res[0]);

    function traverse(items, map, name) {
        let position = { x: 0, y: 0 }
        let dist = 0;
        for (const { dir, amount } of items) {
            for (let count = 0; count < amount; count++) {
                dist++;
                if (dir === 'L') position.x--;
                else if (dir === 'R') position.x++;
                else if (dir === 'U') position.y--;
                else if (dir === 'D') position.y++;
                var coordinates = `${position.x},${position.y}`;
                var currentValue = map.get(coordinates) || new Map()
                if (!currentValue.has(name, dist)) {
                    currentValue.set(name, dist);
                    map.set(coordinates, currentValue);
                }
            }
        }
    }
});