const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const snafuNumbers = data.toString().trim().split(/\r?\n/);
    const nums = snafuNumbers.map(x => snafuToDecimal(x.trim()));
    const fullSum = nums.reduce((a, b) => a + b, 0);
    console.log(decimalToSnafu(fullSum));
});

function snafuToDecimal(num) {
    let sum = 0;
    for (let pos = (num.length - 1); pos >= 0; pos--) {
        const curNum = num[pos];
        const reversePos = (num.length - pos - 1);
        const cur = curNum === '=' ? -2 : curNum === '-' ? -1 : Number(curNum);
        sum = sum + (5 ** reversePos) * cur;
    }
    return sum;
}

function decimalToSnafu(num) {
    let len = 1;
    for (; snafuToDecimal('2'.repeat(len)) < num; len++);
    let curInSnafu = '2'.repeat(len);
    const options = ['2', '1', '0', '-', '='];
    for (let position = 0; position < len; position++) {
        for (const opt of options) {
            let nextOption = `${curInSnafu.slice(0, position)}${opt}${curInSnafu.slice(position + 1)}`;
            if (snafuToDecimal(nextOption) === num) { 
                return nextOption;
            }
            if (snafuToDecimal(nextOption) < num) {
                break;
            }
            curInSnafu = nextOption;
        }
    }
}

const cache = new Map()