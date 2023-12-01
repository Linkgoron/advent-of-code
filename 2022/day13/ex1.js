const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const pairs = data.toString().trim().split(/\r?\n\r?\n/).map((row) => {
        const [first, second] = row.trim().split(/\r?\n/);
        return { first: JSON.parse(first), second: JSON.parse(second) }
    });

    let sum = 0;
    let index = 0;
    for (const { first, second } of pairs) {
        index++;
        if (sameValue(first, second)) {
            sum += index;
        }
    }
    console.log(sum);
});

function sameValue(left, right) {
    if (typeof left === 'number' && typeof right === 'number') {
        if (left < right) {
            return true;
        }
        if (left > right) {
            return false;
        }
        return undefined;
    }

    const leftVal = Array.isArray(left) ? left : [left];
    const rightVal = Array.isArray(right) ? right : [right];

    for (let i = 0; i < leftVal.length; i++) {
        if (rightVal.length <= i) {
            return false;
        }
        const sameVal = sameValue(leftVal[i], rightVal[i]);
        if (typeof sameVal === 'boolean') {
            return sameVal;
        }
    }

    if (leftVal.length < rightVal.length) {
        return true;
    }

    return undefined;
}