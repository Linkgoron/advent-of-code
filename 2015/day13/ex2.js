const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const guests = new Map();
    const weights = data.toString().split('\r\n').map(x => x.trim().replace(".", ''));
    for (const rawRow of weights) {
        const row = rawRow.split(' ');
        const source = row[0];
        if (!guests.has(source)) {
            guests.set(source, { name: source, weights: new Map([['host', 0]]) })
        }
        const positive = row[2] === 'gain';
        const target = row[10];
        const absCost = parseInt(row[3]);
        const cost = positive ? absCost : (-1 * absCost);
        const guest = guests.get(source);
        guest.weights.set(target, cost);
    }
    const guestNames = [...guests.keys()];
    guests.set('host', {
        name: 'host',
        weights: new Map(guestNames.map(name => [name, 0]))
    })
    guestNames.push('host');
    const paths = perm(guestNames);
    const distances = paths.map(path => {
        let length = 0;
        const guestCount = path.length;
        for (const [guest, index] of path.map((x, i) => [x, i])) {
            const current = guests.get(guest);
            const leftNeighbour = index === 0 ? (guestCount - 1) : (index - 1);
            const rightNeighbour = (index === guestCount - 1) ? 0 : (index + 1);
            const neighbours = [path[leftNeighbour], path[rightNeighbour]];
            const currentCost = current.weights.get(neighbours[0]) + current.weights.get(neighbours[1]);
            length += currentCost;
        }
        return length;
    });
    const max = distances.reduce((acc, cur) => cur > acc ? cur : acc, distances[0]);
    console.log(max);
});

function perm(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}