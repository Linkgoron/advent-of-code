const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const fillSize = 272;
    let content = data.toString().trim();

    while (content.length < fillSize) {
        content = lengthen(content);
    }
    content = content.substring(0, fillSize);
    const checkSum = checksum(content)
    console.log(checkSum);
});

function checksum(data) {
    let sum = '';
    for (let i = 0; i < data.length; i += 2) {
        sum += data[i] === data[i + 1] ? '1' : '0'
    }
    return (sum.length % 2) === 1 ? sum : checksum(sum);
}

function lengthen(a) {
    let b = a.split('').map(oppositize).reverse().join('');
    return a + '0' + b;
}

function oppositize(letter) {
    return letter === '0' ? '1' : '0';
}