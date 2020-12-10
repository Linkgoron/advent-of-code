const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/gm).map(Number);
    if (!numbers.includes(0)) {
        numbers.push(0);
    }
    numbers.push(Math.max(...numbers) + 3);
    const joltify = numbers.sort((a, b) => a - b);
    const threeDiffs = joltify.map((num, loc) => ({ num, loc })).filter(({ num }, i) => (num - joltify[i - 1]) === 3, []);

    const parts = threeDiffs.map((item, i) => joltify.slice((threeDiffs[i - 1] || { loc: 0 }).loc, item.loc));
    const total = parts.reduce((acc, part) => acc * findAllLegals(part, 1), 1);
    console.log(total);
});


function findAllLegals(input, location) {
    if (!isLegal(input)) {
        return 0;
    }
    if (location >= input.length - 1) {
        return 1;
    }
    let inp = [...input];
    inp.splice(location, 1);
    return findAllLegals(inp, location) + findAllLegals(input, location + 1);
}

function isLegal(input) {
    const wat = input.slice(1).filter((num, i) => num - input[i] > 3);
    return wat.length === 0;
}