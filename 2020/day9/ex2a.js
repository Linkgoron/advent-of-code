const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/gm).map(Number);
    const preamble = 25;
    const needed = findInvalid(numbers, preamble);
    for (let i = 0; i < numbers.length; i++) {
        const start = numbers[i];
        if (start >= needed) {
            continue;
        }
        let sum = start;
        let min = start;
        let max = start;
        for (let j = i + 1; j < numbers.length && sum < needed; j++) {
            const current = numbers[j];
            sum += current;
            if (min > current) {
                min = current;
            }
            if (max < current) {
                max = current;
            }
        }
        if (sum === needed) {
            console.log(min + max);
            return;
        }
    }

});

function findInvalid(numbers, preamble) {
    for (let i = preamble; i < numbers.length; i++) {
        const current = numbers[i];
        const preambled = new Set(numbers.slice(i - preamble, i));
        const isValid = [...preambled].some(x => (x !== (current - x))
            && preambled.has(x)
            && preambled.has(current - x));
        if (!isValid) {
            return current;
        }
    }
    return undefined
}
