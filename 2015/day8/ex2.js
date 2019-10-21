const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const content = data.toString();
    const addition = content.split("\r\n").length * 2;
    const letters = data.toString().replace(/\r\n/g, '').replace(/ +/g, '');
    console.log(addition + letters.split('').filter(x => x === '\\' || x === "\"").length);

});