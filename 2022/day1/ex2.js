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
    const { 0: first, 1: second, 2: third } = elves.sort((a, b) => b.sum - a.sum);
    console.log(first.sum + second.sum + third.sum);
});