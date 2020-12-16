const fs = require('fs');
fs.promises.readFile('./ex.input').then(raw => {
    const { rules, tickets } = raw.toString().trim().split(/\r?\n/gm).reduce((acc, x) => {
        if (x === '') return acc;
        if (x === 'your ticket:' || x === 'nearby tickets:') return acc;
        if (x.includes(':')) {
            const [name, rawRanges] = x.split(': ');
            const actualRanges = rawRanges.split(' or ');
            const ranges = actualRanges.map(x => {
                const vals = x.split('-');
                return {
                    from: Number(vals[0]),
                    to: Number(vals[1]),
                }
            })
            acc.rules.push({ name, ranges });
            return acc;
        }
        acc.tickets.push(x.split(',').map(Number));
        return acc;
    }, { rules: [], tickets: [] });
    const [myTicket, ...nearbyTickets] = tickets;
    const errorRate = nearbyTickets.reduce((acc, ticket) => {
        let sum = 0;
        for (const prop of ticket) {
            let isValid = false
            for (const rule of rules) {
                for (const range of rule.ranges) {
                    if (range.to >= prop && prop >= range.from) {
                        isValid = true;
                    }
                }
            }
            if (!isValid) {
                sum += prop;
            }
        }
        return acc + sum;
    }, 0);
    console.log(errorRate)
});