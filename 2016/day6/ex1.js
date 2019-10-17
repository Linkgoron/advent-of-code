const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().split('\r\n').map(x => x.trim());
    const rowLength = words[0].length;
    let message = '';
    for (let i = 0; i < rowLength; i++) {
        const occurences = words.map(x => x[i]).reduce((acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
        }, {});
        message += Object.entries(occurences).sort(([a, b], [c, d])=> d - b)[0][0];
    }
    console.log(message);
});