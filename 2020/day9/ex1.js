const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/gm).map(Number);
    const preamble = 5;
    for (let i = preamble; i < numbers.length; i++) {
        const current = numbers[i];
        const preambled = new Set(numbers.slice(i - preamble, i));
        const isValid = [...preambled].some(x => (x !== (current - x))
                                && preambled.has(x) 
                                && preambled.has(current - x));
        if (!isValid) {
            console.log(current);
            break;
        }
    }
});
