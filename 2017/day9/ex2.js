const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const ignoreSign = new RegExp("!.", "g");
    const garbageSign = new RegExp("<[^>]*>", "g");
    let sum = 0;
    data.toString().replace(ignoreSign, '').replace(garbageSign, (str) => { sum += str.length - 2; return ''; });
    console.log(sum);
});
