const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const numbers = data.toString().split('\r\n').map(x => x.trim()).map(num => parseInt(num));
    console.log(count(numbers, 0, 0, 150));

    function count(numbers, index, sum, limit) {
        if (sum === limit) return 1;
        if (sum > limit) return 0;
        if (index === numbers.length) return 0;

        return count(numbers, index + 1, sum + numbers[index], limit) + count(numbers, index + 1, sum, limit);
    }
});