require('fs').readFile('./ex1.input', (err, data) => {
    const rows = 6;
    const cols = 25;
    const layerPixels = rows * cols;
    const image = data.toString().trim().split('')
        .reduce((map, x, i) => {
            const layer = Math.floor(i / layerPixels);
            if (!map.has(layer)) {
                map.set(layer, []);
            }
            map.get(layer).push(x);
            return map;
        }, new Map());
    const vals = [...image.values()];
    const minRow = vals.sort((a, b) => a.filter(x => x === '0').length - b.filter(x => x === '0').length)[0];
    console.log(minRow.filter(x => x === '1').length * minRow.filter(x => x === '2').length);
});