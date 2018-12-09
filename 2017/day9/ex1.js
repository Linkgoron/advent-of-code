const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const ignoreSign = new RegExp("!.", "g");
    const garbageSign = new RegExp("<[^>]*>", "g");
    const str = data.toString().replace(ignoreSign, '').replace(garbageSign, '');
    let depth = 0;
    let sum = 0;
    for (const char of str) {
        if (char === ',') {
            continue;
        }
        if (char === '{') {
            depth++;
            continue;
        }
        if (char === '}') {
            sum += depth;
            depth--;
        }
    }
    console.log(sum);
});
