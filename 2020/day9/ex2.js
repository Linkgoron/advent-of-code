const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/gm).map(Number);
    const preamble = 25;
    const needed = findInvalid(numbers, preamble);
    let start = 0;
    let end = 1;
    let sum = numbers[start] + numbers[end];
    while (sum !== needed || start === end) {
        if (sum > needed) {
            sum -= numbers[start++];
        } else if (sum < needed) {
            sum += numbers[++end];
        }

        if (end === start) {
            end++;
        }
    }
    const min = Math.min(...numbers.slice(start, end));
    const max = Math.max(...numbers.slice(start, end));
    console.log(min + max);
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
