const fs = require('fs');

const correct = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
}
const props = Object.keys(correct);

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const aunts = data.toString().split('\r\n').map(x => x.trim()).map((x, i) => {
        const start = x.indexOf(':') + 1;
        const almostAunt = x.substring(start).replace(/[^ ]+:/g, x => `\"${x.replace(':', '')}\":`);
        const aunt = JSON.parse(`{${almostAunt}}`);
        aunt.number = i + 1;
        return aunt;
    });
    const matching = aunts.filter(aunt => {
        return props.every(x => aunt[x] === correct[x] || typeof aunt[x] === 'undefined')
    })
    console.log(matching);
});