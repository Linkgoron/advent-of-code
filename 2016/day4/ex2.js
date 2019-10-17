const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const correctRows = data.toString().split('\r\n').map(x => x.trim()).map(x => x.split('-'))
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
                .slice(0, 5)
                .map(x => x.letter).join('');

            const [sector, checksum] = x[x.length - 1].replace(']', '').split('[');
            return {
                correct: sorting === checksum,
                name: x.slice(0, x.length - 1),
                sector: parseInt(sector)
            }
        }).filter(x => x.correct);

    const cypher = correctRows.map(x => ({
        name: x.name.map(word => [...word].map(letter => ((letter.charCodeAt(0) - 97) + x.sector) % 26).map(x => String.fromCharCode(x + 65)).join('')).join(' '),
        sector: x.sector
    })).filter(x=>x.name === 'NORTHPOLE OBJECT STORAGE');
    console.log(cypher);
});