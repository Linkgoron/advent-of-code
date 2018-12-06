const fs = require('fs');
const _ = require('lodash');

fs.readFile('./day5.input', (err, data) => {
    if (err) throw new Error("data :(");
    var x = data.toString();
    let minShortened = x.length;
    for (let j = 0; j < 26; j++) {
        const curBig = String.fromCharCode(65 + j);
        const fixedString = x.replace(new RegExp(curBig, 'gi'), '');
        const shortened = shorten(fixedString);
        if (shortened.length < minShortened) {
            minShortened = shortened.length;
        }
    }
    console.log(minShortened);
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