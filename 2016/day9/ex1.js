const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const text = data.toString().replace('\r\n', '').replace(' ', '');
    let count = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') {
            for (var howManyEnd = i + 1; text[howManyEnd] !== 'x'; howManyEnd++);
            const letterCount = parseInt(text.substring(i + 1, howManyEnd));
            for (var timesEnd = howManyEnd + 1; text[timesEnd] !== ')'; timesEnd++);
            const times = parseInt(text.substring(howManyEnd + 1, timesEnd));
            count += letterCount * times;
            i = timesEnd + letterCount;
            continue;
        }

        count++;
    }
    console.log(count);
});