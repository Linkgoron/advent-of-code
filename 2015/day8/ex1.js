const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const totalData = data.toString().replace(/\r\n/g, '').replace(/ +/g, '');
    let specialTriple = 0;
    let specialOne = 0;
    let captured = new Set();
    for (const [letter, index] of [...totalData].map((x, i) => [x, i])) {
        if (letter === '\\' && totalData[index + 1] == '\\') {
            if (!captured.has(index)) {
                captured.add(index + 1);
                specialOne++;
            }
            continue;
        }

        if (letter === '\"') {
            specialOne++;
        }

        if (letter === '\\' && totalData[index + 1] === 'x' && !captured.has(index)) {
            specialTriple++;
        }
    }
    console.log(specialTriple * 3 + specialOne);
});