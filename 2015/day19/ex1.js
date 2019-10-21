const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allPoints = data.toString().split('\r\n');
    const startingPoint = allPoints[allPoints.length - 1];
    const rules = allPoints.slice(0, allPoints.length - 2).map(row => row.split(' => ')).map(row => ({
        from: row[0],
        to: row[1]
    }));
    const transformations = new Set();
    for (const rule of rules) {
        for (let i = 0; i < startingPoint.length - rule.from.length + 1; i++) {
            let match = true;
            for (let j = 0; j < rule.from.length; j++) {
                if (startingPoint[i + j] !== rule.from[j]) {
                    match = false;
                }
            }
            if (match) {
                const nextWordArr = [...startingPoint];
                nextWordArr.splice(i, rule.from.length, rule.to);
                const nextWord = nextWordArr.join('');
                transformations.add(nextWord);
            }
        }
    }
    console.log(transformations.size);
});