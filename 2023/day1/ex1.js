const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const content = data.toString().trim().split('\n').map(x => {
        const firstNumber = Number([...x].find(x => x.charCodeAt(0) >= 48 && x.charCodeAt(0) <= 57));
        const lastNumber = Number([...x].findLast(x => x.charCodeAt(0) >= 48 && x.charCodeAt(0) <= 57));
        return (firstNumber * 10) + lastNumber
    }).reduce((acc, cur) => acc + cur, 0);

    console.log(content);
});