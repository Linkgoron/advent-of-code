const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/gm).map(Number);
    if (!numbers.includes(0)) {
        numbers.push(0);
    }
    numbers.push(Math.max(...numbers) + 3);
    const joltify = numbers.sort((a, b) => a - b);
    console.log(findAllLegals(joltify, 0, new Map()))
});

function findAllLegals(input, location, map) {
    if (map.get(location)) {
        return map.get(location);
    }
    if (location === input.length - 1) {
        return 1;
    }

    let total = 0;
    for (let i = 1; i <= 3 && (location + i) < input.length && (input[location + i] - input[location]) <= 3; i++) {
        const res = findAllLegals(input, location + i, map);
        map.set(location + i, res);
        total += res;
    }
    return total;
}