const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const count = data.toString().trim().split('\n').map(x => {
        const [min1, max1, min2, max2] = x.split(/[-,]/g).map(Number);
        if ((min1 <= min2 && max1 >= max2) || (min2 <= min1 && max2 >= max1)) {
            return 1;
        }
        return 0;
    }).reduce((a, b) => a + b, 0);
    console.log(count);
});