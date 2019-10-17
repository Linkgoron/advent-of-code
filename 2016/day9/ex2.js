const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const text = data.toString().replace('\r\n', '').replace(' ', '');
    console.log(parseSize(text, 0, text.length));
});

function parseSize(text, start, end) {
    let totalSize = 0;
    for (let i = start; i < end; i++) {
        if (text[i] === '(') {
            for (var howManyEnd = i + 1; text[howManyEnd] !== 'x'; howManyEnd++);
            const letterCount = parseInt(text.substring(i + 1, howManyEnd));
            for (var timesEnd = howManyEnd + 1; text[timesEnd] !== ')'; timesEnd++);
            const times = parseInt(text.substring(howManyEnd + 1, timesEnd));
            const startText = timesEnd + 1;
            const innerSize = parseSize(text, startText, startText + letterCount);
            totalSize += innerSize * times;
            i = startText + letterCount - 1;
            continue;
        }

        totalSize ++;
    }
    return totalSize;
}