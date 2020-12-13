const fs = require('fs');
fs.promises.readFile('./ex.input').then(raw => {
    const [_, busses] = raw.toString().trim().split(/\r?\n/gm);
    const allNums = busses.split(',').map((x, i) => x === 'x' ? x : { x: Number(x), i }).filter(x => x !== 'x');
    const extra = allNums.map(x => ({ ...x, mod: x.x - x.i }));
    const cr = chineseRemainder(extra.map(x => BigInt(findIt(x.mod, x.x))), extra.map(x => BigInt(x.x)));
    console.log(cr.toString());
});

function findIt(num, mod) {
    let endNum = num;
    while (endNum < 0) {
        endNum += mod;
    }

    if (endNum === mod) {
        return 0;
    }
    return endNum;
}

/**
* Base on http://rosettacode.org/wiki/Chinese_remainder_theorem (python implementation)
* solve a system of linear congruences by applying the Chinese Remainder Theorem
*
* 	X = a1  (mod n1)
*  	X = a2  (mod n2)
*
* This function will be called as:
*
* chineseRemainder( [a1, a2], [n1, n2])
* @return {integer}
*/

function mul_inv(a, b) {

    var b0 = BigInt(b);
    var x0 = BigInt(0);
    var x1 = BigInt(1);
    var q, tmp;
    if (b == BigInt(1)) {
        return BigInt(1);
    }
    while (a > BigInt(1)) {
        q = BigInt(a / b);
        tmp = a;
        a = b;
        b = tmp % b;
        tmp = x0;
        x0 = x1 - (q * x0);
        x1 = tmp;
    }
    if (x1 < BigInt(0)) {
        x1 = x1 + b0;
    }
    return x1;
}

function chineseRemainder(a, n) {
    let p = BigInt(1);
    let prod = BigInt(1);
    let sm = BigInt(0);
    for (let i = 0; i < n.length; i++) {
        prod = BigInt(prod) * BigInt(n[i]);
    }
    for (let i = 0; i < n.length; i++) {
        p = prod / n[i];
        sm = sm + (a[i] * BigInt(mul_inv(p, n[i])) * p);
    }
    return BigInt(sm) % prod;
}


module.exports = chineseRemainder;