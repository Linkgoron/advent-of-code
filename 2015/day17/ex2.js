const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const numbers = data.toString().split('\r\n').map(x => x.trim()).map(num => parseInt(num));
    console.log(count(numbers, 150));

    function count(numbers, limit) {
        let min = numbers.length;
        let minCount = 0;
        realCount(0, 0, 0);
        return minCount;

        function realCount(index, sum, holding) {
            if (sum === limit) {
                if (holding === min) {
                    minCount++;
                } else if (holding < min) {
                    min = holding;
                    minCount = 1;
                }
                return 1
            }
            if (sum > limit || holding > min) return 0;
            if (index === numbers.length) return 0;

            return realCount(index + 1, sum + numbers[index], holding + 1) + realCount(index + 1, sum, holding);
        }
    }
});