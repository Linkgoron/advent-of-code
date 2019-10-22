const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const num = parseInt(data.toString().split('\r\n')) / 10;

    for (let i = 1; i < 1000000; i++) {
        if (getDivisors(i) >= num) {
            console.log('done', i);
            return;
        }
    }
    console.log('failed');

});

function getDivisors(n) {
    // 1 is a special case where "1 and itself" are only one divisor rather than 2
    if (n === 1) {
        return 1;
    }

    var sum = 1 + n; // acounts for "1 and itself"

    var mod = 2;
    while (mod * mod <= n) {
        if (n % mod === 0) {
            if (mod * mod < n) {
                // mod and number/mod are (different) divisors
                sum += mod + (n / mod);
            }
            else {
                // mod == number/mod is a divisor
                sum += mod;
            }
        }
        mod++;
    }

    return sum;
}