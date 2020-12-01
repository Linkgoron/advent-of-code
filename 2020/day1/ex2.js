const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split('\n').map(Number);
    const mul = findSum(numbers, 2020);
    console.log(mul);
});

function findSum(numbers, sum) {
    for (let i = 0; i < numbers.length - 2; i++) {
        for (let j = i + 1; j < numbers.length - 1; j++) {
            for (let k = i + 2; k < numbers.length; k++) {
                const num = numbers[i] + numbers[j] + numbers[k];
                if (num === sum) {
                    return numbers[i] * numbers[j] * numbers[k];
                }
            }
        }
    }
    return undefined;
}