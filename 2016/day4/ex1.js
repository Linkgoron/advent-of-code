const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => x.trim()).map(x => x.split('-'))
        .map(x => {
            const letters = x.slice(0, x.length - 1).join('');
            const grouping = [...letters].reduce((acc, cur) => {
                acc[cur] = (acc[cur] || 0) + 1;
                return acc;
            }, {})

            const sorting = Object.entries(grouping).map(([key, count]) =>
                ({
                    letter: key,
                    length: count
                })).sort((a, b) => (b.length - a.length) || (a.letter.charCodeAt(0) - b.letter.charCodeAt(0)))
                .slice(0,5)
                .map(x => x.letter).join('');

            const [sector, checksum] = x[x.length - 1].replace(']', '').split('[');
            console.log(sorting, checksum);
            return {
                correct: sorting === checksum,
                sector: parseInt(sector)
            }
        }).filter(x => x.correct);
    const sum = rows.reduce((acc, cur) => acc + cur.sector, 0);
    console.log(sum);
});