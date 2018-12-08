const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const info = data.toString();
    let sum = 0;
    for (let i = 0; i < info.length; i++) {
        const next = (i + 1) % info.length;
        const currentChar = info.charCodeAt(i) - 48;
        const nextChar = info.charCodeAt(next) - 48;
        if (currentChar === nextChar) {
            sum += currentChar;
        }
    }
    console.log(sum);
});