const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const all = numbers.join('|');
    const allRev = numbers.map(x => x.split('').reverse().join('')).join('|');
    const regex = new RegExp(all);
    const regexRev = new RegExp(allRev);
    const sum = data.toString().trim().split('\n').map(x => {
        const matches = x.match(regex);
        const firstMatch = digitNameToNumber(matches[0]);
        const revMatches = [...x].reverse().join('').match(regexRev);
        const lastMatch = digitNameToNumber([...revMatches[0]].reverse().join(''));
        return (firstMatch * 10) + lastMatch
    }).reduce((acc, cur) => acc + cur, 0);
    console.log(sum);
});



function digitNameToNumber(number) {
    if (number === 'one') return 1;
    if (number === 'two') return 2;
    if (number === 'three') return 3;
    if (number === 'four') return 4;
    if (number === 'five') return 5;
    if (number === 'six') return 6;
    if (number === 'seven') return 7;
    if (number === 'eight') return 8;
    if (number === 'nine') return 9;
    return Number(number);
}