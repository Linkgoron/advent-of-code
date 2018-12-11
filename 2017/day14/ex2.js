const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const input = data.toString();
    // const input = 'flqrgnkx';
    const items = new Set();
    for (let i = 0; i < 128; i++) {
        const result = computeKnotHash(`${input}-${i}`);
        const item = result.split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0')).join('');
        for (let j = 0; j < 128; j++) {
            if (item[j] === '1') {
                items.add(coordinates(i, j));
            }
        }
    }

    let numOfSets = 0;
    while (items.size > 0) {
        numOfSets++;
        const start = items.keys().next().value;
        const [x, y] = start.split(',');
        travel(parseInt(x), parseInt(y), items);
    }
    console.log(numOfSets);
});

function travel(x, y, /** @type Set<string> */ items) {
    if (!items.has(coordinates(x, y))) return;
    items.delete(coordinates(x, y));
    travel(x + 1, y, items);
    travel(x - 1, y, items);
    travel(x, y + 1, items);
    travel(x, y - 1, items);
}

function coordinates(x, y) {
    return `${x},${y}`;
}

function computeKnotHash(/** @type string */str) {
    const input = str.toString().split('').map(x => x.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
    const numOfItems = 256;
    const arr = new Array(numOfItems);
    for (let i = 0; i < numOfItems; i++) arr[i] = i;
    let pos = 0;
    let skipSize = 0;

    for (let j = 0; j < 64; j++) {
        for (const size of input) {
            if (size > arr.length) continue;
            const tempo = [...arr, ...arr];
            const toReplace = tempo.slice(pos, pos + size).reverse();
            for (let i = 0; i < size; i++) {
                const toPlacePos = (pos + i) % numOfItems;
                arr[toPlacePos] = toReplace[i];
            }
            pos = (pos + size + skipSize) % numOfItems;
            skipSize++;
        }
    }
    const res = [];
    for (let j = 0; j < 16; j++) {
        res.push(arr.slice(j * 16, j * 16 + 16).reduce((acc, item) => acc ^ item, 0));
    }
    return res.map(x => (x < 16 ? '0' : '') + x.toString(16)).join('');
}