const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split('\n').map(Number);
    const mul = findSum(numbers, 2020);
    console.log(mul);
});

function findSum(numbers, sum) {
    const seen = new Set();
    for (const number of numbers) {
        const missing = sum - number;
        if (seen.has(missing)) {
            return number * missing;
        }
        seen.add(number);
    }
    return undefined;
}