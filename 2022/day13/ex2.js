const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const pairs = data.toString().trim().split(/\r?\n\r?\n/).map((row) => {
        const [first, second] = row.trim().split(/\r?\n/);
        return [JSON.parse(first), JSON.parse(second)];
    }).flat();
    pairs.push([[6]]);
    pairs.push([[2]]);
    pairs.sort((a,b) => {
        const compare = sameValue(a,b);
        if (typeof compare === 'boolean') {
            return compare ? -1 : 1;
        }
        return 0;
    });
    const twoInd = pairs.findIndex(x => JSON.stringify(x) === '[[2]]') + 1;
    const sixInd = pairs.findIndex(x => JSON.stringify(x) === '[[6]]') + 1;
    console.log(twoInd * sixInd);
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

/// 19292 too low