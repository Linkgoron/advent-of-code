const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const bags = data.toString().trim().split('\n').map(x => new Set(x.split('')));
    let sum = 0;
    for (let i = 0; i < bags.length; i += 3) {
        const { [i]: first, [i + 1]: second, [i + 2]: third } = bags;
        let joint = undefined;
        for (const item of first) {
            if (second.has(item) && third.has(item)) {
                joint = item;
                break;
            }
        }
        sum += (joint.charCodeAt(0) - 38) % 58;
    }
    console.log(sum);
});