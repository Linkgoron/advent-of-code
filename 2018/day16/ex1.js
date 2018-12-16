const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const rows = rawData.toString().split('\r\n').slice(0, 3220);

    const tests = [];
    for (let i = 0; i < rows.length - 3; i += 4) {
        const preMemory = rows[i].substring(9).split(',').map(x => x.trim().replace(']', '').replace('[', '')).map(x => parseInt(x));
        const op = rows[i + 1].trim().split(' ').map(x => parseInt(x));
        const postMemory = rows[i + 2].substring(9).split(',').map(x => x.trim().replace(']', '').replace('[', '')).map(x => parseInt(x));
        tests.push({
            preMemory: { 0: preMemory[0], 1: preMemory[1], 2: preMemory[2], 3: preMemory[3] },
            command: {
                op: op[0],
                first: op[1],
                second: op[2],
                result: op[3],
            },
            postMemory: { 0: postMemory[0], 1: postMemory[1], 2: postMemory[2], 3: postMemory[3] }
        });
    }

    let threeOrAbove = 0;
    for (const test of tests) {
        if (checkFits(test).length >= 3) {
            threeOrAbove++;
        }
    }
    console.log(threeOrAbove);
});


function checkFits(test) {
    const commands = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
    const matches = [];
    for (const command of commands) {
        const result = execute(test.preMemory, command, test.command);        
        if (result[0] === test.postMemory[0] &&
            result[1] === test.postMemory[1] &&
            result[2] === test.postMemory[2] &&
            result[3] === test.postMemory[3]) {
            matches.push(command);
        }
    }
    return matches;
}

function execute(memory, stringCommand, command) {
    const postMemory = { ...memory };
    switch (stringCommand) {
        case 'addr': {
            postMemory[command.result] = memory[command.first] + memory[command.second];
            return postMemory;
        }
        case 'addi': {
            postMemory[command.result] = memory[command.first] + command.second;
            return postMemory;
        }
        case 'mulr': {
            postMemory[command.result] = memory[command.first] * memory[command.second];
            return postMemory;
        }
        case 'muli': {
            postMemory[command.result] = memory[command.first] * command.second;
            return postMemory;
        }
        case 'banr': {
            postMemory[command.result] = memory[command.first] & memory[command.second];
            return postMemory;
        }
        case 'bani': {
            postMemory[command.result] = memory[command.first] & command.second;
            return postMemory;
        }
        case 'borr': {
            postMemory[command.result] = memory[command.first] | memory[command.second];
            return postMemory;
        }
        case 'bori': {
            postMemory[command.result] = memory[command.first] | command.second;
            return postMemory;
        }
        case 'setr': {
            postMemory[command.result] = memory[command.first];
            return postMemory;
        }
        case 'seti': {
            postMemory[command.result] = command.first;
            return postMemory;
        }
        case 'gtir': {
            postMemory[command.result] = command.first > memory[command.second] ? 1 : 0;
            return postMemory;
        }
        case 'gtri': {
            postMemory[command.result] = memory[command.first] > command.second ? 1 : 0;
            return postMemory;
        }
        case 'gtrr': {
            postMemory[command.result] = memory[command.first] > memory[command.second] ? 1 : 0;
            return postMemory;
        }
        case 'eqir': {
            postMemory[command.result] = command.first === memory[command.second] ? 1 : 0;
            return postMemory;
        }
        case 'eqri': {
            postMemory[command.result] = memory[command.first] === command.second ? 1 : 0;
            return postMemory;
        }
        case 'eqrr': {
            postMemory[command.result] = memory[command.first] === memory[command.second] ? 1 : 0;
            return postMemory;
        }
    }
    console.log(command);
}