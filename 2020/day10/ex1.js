const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/gm).map(Number);
    if (!numbers.includes(0)) {
        numbers.push(0);
    }
    numbers.push(Math.max(...numbers) + 3);
    const joltify = numbers.sort((a, b) => a - b);
    const oneDiff = joltify.reduce((acc, num, i) => i === 0 ? 0 : acc + (((num - joltify[i - 1]) === 1) ? 1 : 0), 0);
    const threeDiff = joltify.reduce((acc, num, i) => i === 0 ? 0 : acc + (((num - joltify[i - 1]) === 3) ? 1 : 0), 0);
    console.log(oneDiff * threeDiff);
});
