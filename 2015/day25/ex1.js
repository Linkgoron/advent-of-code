const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().trim().split(/ +/g);
    const row = parseInt(words[15]);
    const col = parseInt(words[17]);    
    const initialCol = col + row;
    const total = col + ((initialCol - 1) * (initialCol - 2)) / 2;

    let item = 20151125;
    for (let i = 1; i < total; i++) {
        item = (item * 252533) % 33554393;
    }
    console.log(item);
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
