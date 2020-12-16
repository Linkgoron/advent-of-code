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
    const goodTickets = nearbyTickets.filter(ticket => {
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
                return false;
            }
        }
        return true;
    });

    const matching = rules.map(rule => {
        const matches = [];
        for (let i = 0; i < myTicket.length; i++) {
            let isValid = true;
            for (const ticket of goodTickets) {
                const value = ticket[i];
                const [low, high] = rule.ranges;
                if ((low.to < value || value < low.from) && (high.to < value || value < high.from)) {
                    isValid = false;
                }
            }
            if (isValid) {
                matches.push(i);
            }
        }
        return matches;
    });

    const solutions = matching.map((x, i) => ({ options: x, index: i }));
    solutions.sort((a, b) => a.options.length - b.options.length);
    const sol = findSolution(solutions, new Map());
    const namedTicket = [...sol].map(([key, value]) => ({
        name: rules[value].name,
        value: myTicket[key],
    }))
    
    const res = namedTicket.filter(x => x.name.includes('departure'))
        .reduce((acc, prop) => acc * prop.value, 1);
    console.log(res);
});

function findSolution(solutions, map, index = 0) {
    if (index === solutions.length) {
        return map;
    }
    const cur = solutions[index];
    for (const option of cur.options) {
        if (map.has(option)) {
            continue;
        }
        map.set(option, cur.index);
        const nextSolution = findSolution(solutions, map, index + 1);
        if (nextSolution) {
            return nextSolution;
        }
        map.delete(option);
    }
    return undefined;
}