const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const input = data.toString().split(',').map(x => parseInt(x.trim()));
    const numOfItems = 256;
    const arr = new Array(numOfItems);
    for (let i = 0; i < numOfItems; i++) arr[i] = i;
    let pos = 0;
    let skipSize = 0;
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
    console.log(arr[0] * arr[1]);
});
