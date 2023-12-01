const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const [rawStacks, rawCommands] = data.toString().trimEnd().split(/\r?\n\r?\n/);
    const stacks = []
    const rawStacksRows = rawStacks.split(/\r?\n/);
    const numberOfStacks = Math.max(0, rawStacksRows[1].length - 3) / 4 + 1;
    for (let i = 0; i < numberOfStacks; i++) stacks.push([]);
    for (let i = 0; rawStacksRows[i][1] !== '1'; i++) {
        for (let j = 1; j < rawStacksRows[i].length; j += 4) {
            const crate = rawStacksRows[i][j];
            if (crate !== ' ') {
                stacks[(j - 1) / 4].push(rawStacksRows[i][j]);
            }
        }
    }
    const commands = rawCommands.split(/\r?\n/).map(row => {
        const { 1: howMany, 3: from, 5: to } = row.split(' ');
        return {
            howMany: Number(howMany),
            from: Number(from),
            to: Number(to),
        };
    });

    
    for (const command of commands) {        
        const deleted = stacks[command.from-1].splice(0, command.howMany);
        stacks[command.to-1] = deleted.reverse().concat(stacks[command.to-1]);
    }

    const word = stacks.reduce((agg, next) => `${agg}${next[0]}`, '');
    console.log(word);
});