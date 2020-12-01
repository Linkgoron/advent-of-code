const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split('\n').map(Number);
    const mul = findSum(numbers, 2020);
    console.log(mul);
});

function findSum(numbers, sum) {
    for (let i = 0; i < numbers.length - 1; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            const num = numbers[i] + numbers[j];
            if (num === sum) {
                return numbers[i] * numbers[j];
            }
        }
    }
    return undefined;
}