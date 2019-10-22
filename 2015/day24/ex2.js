const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const weights = data.toString().split('\r\n').map(x => parseInt(x.trim()));
    const totalSize = weights.reduce((acc, cur) => cur + acc, 0);
    const packageWeight = totalSize / 4;
    const val = computeEntangled(1, 0, 0, weights, packageWeight);
    console.log(val);

});

function computeEntangled(entanglment, sum, index, numbers, limit) {
    if (sum === limit) {
        return entanglment;
    }
    if (sum > limit) return 29728298883;
    if (index === numbers.length) return 29728298883;
    current = numbers[index];
    return Math.min(computeEntangled(entanglment * current, current + sum, index + 1, numbers, limit),
        computeEntangled(entanglment, sum, index + 1, numbers, limit))

}
