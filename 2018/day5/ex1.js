const fs = require('fs');
const _ = require('lodash');

fs.readFile('./day5.input', (err, data) => {
    if (err) throw new Error("data :(");
    var x = data.toString();
    const firstShortened = shorten(x);
    console.log(firstShortened.length);
});

function shorten(str) {
    for (let i = 0; i < str.length - 1; i++) {
        const curCharCode = str.charCodeAt(i);
        const nextCharCode = str.charCodeAt(i + 1);
        if (Math.abs(curCharCode - nextCharCode) === 32) {
            str = str.substring(0, i) + str.substring(i + 2);
            i = Math.max(-1, i - 2);
        }
    }
    return str;
}
