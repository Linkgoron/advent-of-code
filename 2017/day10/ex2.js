const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const input = data.toString().split('').map(x => x.charCodeAt(0)).concat([17, 31, 73, 47, 23]);

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
    const val = res.map(x => (x < 16 ? '0' : '') + x.toString(16)).join('');
    console.log(val);
});
