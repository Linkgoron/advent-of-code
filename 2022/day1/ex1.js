const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const elfRows = data.toString().trim().split('\n\n');
    const elves = elfRows.map(nums => {
        const rows = nums.trim().split('\n').map(Number);
        return {
            nums: rows,
            sum: rows.reduce((a, b) => a + b, 0),
        }
    });
    const maximum = max(elves, x => x.sum);
    console.log(maximum.sum);
});

function max(items, func) {
    if (items.length === 0) {
        return undefined;
    }
    let maxIndex = 0;
    let maxValue = func(items[0]);
    for (let i = 1; i < items.length; i++) {
        const val = func(items[i]);
        if (val > maxValue) {
            maxIndex = i;
            maxValue = val;
        }
    }
    return items[maxIndex];
}
