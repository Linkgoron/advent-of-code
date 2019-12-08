require('fs').readFile('./ex2.input', (err, data) => {
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

    for (let row = 0; row < rows; row++) {
        let rowString = '';
        for (let col = 0; col < cols; col++) {
            rowString += getPixel(image, row, col);
        }
        console.log(rowString);
    }

    function getPixel(layers, row, col) {
        for (const layer of layers.values()) {
            if (layer[cols * row + col] === '2') continue;
            if (layer[cols * row + col] === '0') return ' ';
            return layer[cols * row + col];
        }
    }
});