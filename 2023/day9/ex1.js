const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().trim().split('\n').map(x => x.split(' ').map(Number));

    let finals = [];
    for (const row of rows) {
        let histogram = [[...row]];
        while (!histogram[histogram.length - 1].every(x => x === 0)) {
            const curRow = histogram[histogram.length - 1];
            histogram.push(computeNextRow(curRow));
        }

        histogram[histogram.length - 1].push(0);
        for (let i = histogram.length - 2; i >= 0; i--) {
            const currentHistory = histogram[i];
            const currentDiffHistory = histogram[i + 1];
            currentHistory.push(currentDiffHistory[currentDiffHistory.length - 1] + currentHistory[currentHistory.length - 1])
        }
        const firstRow = histogram[0];
        finals.push(firstRow[firstRow.length - 1]);
    }
    console.log(finals.reduce((a, b) => a + b, 0));
});

function computeNextRow(currentRow) {
    let nextRow = [];
    for (let i = 1; i < currentRow.length; i++) {
        nextRow.push(currentRow[i] - currentRow[i - 1]);
    }
    return nextRow;
}