const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const sum = data.toString().trim().split('\n').map(x => {
        const items = x.split('');
        const len = items.length;
        const compartmentOne = new Set(items.slice(0, len/2));
        const compartmentTwo = new Set(items.slice(len/2));
        let joint = undefined;
        for (const item of compartmentOne) {
            if (compartmentTwo.has(item)) {
                joint = item;
                break;
            }
        }
        return (joint.charCodeAt(0) - 38) % 58;
    }).reduce((a,b) => a+b, 0);
    console.log(sum);
});