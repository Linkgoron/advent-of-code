const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const [cardKey, doorKey] = data.toString().trim().split(/\r?\n/gm).map(Number);
    const cardLoopSize = unTransform(7, cardKey);
    const doorLoopSize = unTransform(7, doorKey);

    const cardRes = transform(doorKey, cardLoopSize);
    const doorRes = transform(cardKey, doorLoopSize);
    console.log(cardRes, doorRes);
});

function transform(subjectNumber, loopSize) {
    let value = 1;
    for (let i = 0; i < loopSize; i++) {
        value *= subjectNumber;
        value = value % 20201227;
    }
    return value;
}

function unTransform(subjectNumber, result) {
    let value = 1;
    let loop = 0;
    for (; value !== result; loop++) {
        value *= subjectNumber;
        value = value % 20201227;
    }
    return loop;
}