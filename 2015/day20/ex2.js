const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const num = parseInt(data.toString().split('\r\n'));

    for (let i = 1; i < 1000000; i++) {
        if (getDivisors(i) * 11 >= num) {
            console.log('done', i);
            return;
        }
    }
    console.log('failed');

});

function getDivisors(number) {
    // 1 is a special case where "1 and itself" are only one divisor rather than 2
    if (number === 1) {
        return 1;
    }

    var sum = number; // acounts for "1 and itself"
    if (number <= 50) {
        sum++;
    }
    var mod = 2;
    while (mod * mod <= number) {
        if (number % mod === 0) {
            if (mod * mod < number) {
                const divizor1 = number / mod;
                const divizor2 = mod;
                if (mod <= 50) {
                    sum += divizor1;
                }
                if (divizor2 <= 50) {
                    sum += mod;
                }
            }
            else {
                if (mod <= 50) {
                    // mod == number/mod is a divisor
                    sum += mod;
                }
            }
        }
        mod++;
    }

    return sum;
}