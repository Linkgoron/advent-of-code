const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const [allTestRows, allCommandRows] = rawData.toString().split('\r\n\r\n\r\n\r\n');
    const testRows = allTestRows.split('\n').map(x => x.trim());
    console.log(testRows.length);
    const commands = allCommandRows.split('\n').map(x => x.trim().split(' ').map(x => parseInt(x)))
        .map(op => ({
            op: op[0],
            first: op[1],
            second: op[2],
            result: op[3],
        }));
    const tests = [];
    for (let i = 0; i < testRows.length - 3; i += 4) {
        const preMemory = testRows[i].substring(9).split(',').map(x => x.trim().replace(']', '').replace('[', '')).map(x => parseInt(x));
        const op = testRows[i + 1].trim().split(' ').map(x => parseInt(x));
        const postMemory = testRows[i + 2].substring(9).split(',').map(x => x.trim().replace(']', '').replace('[', '')).map(x => parseInt(x));
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

    const foundCommands = new Set();
    const opToString = {};
    const opSets = {};

    for (const test of tests) {
        const currentOp = test.command.op;
        const sols = checkFits(test);
        if (sols.size === 1) {
            const { value: command } = sols.values().next();
            opToString[currentOp] = command;
            foundCommands.add(command);
        } else if (opToString[currentOp] === undefined) {
            if (opSets[currentOp] === undefined) {
                opSets[currentOp] = sols;
            } else {
                const toDelete = new Set();
                for (const item of opSets[currentOp]) {
                    if (!sols.has(item)) toDelete.add(item);
                }
                for (const toDel of toDelete) {
                    opSets[currentOp].delete(toDel);
                }
            }
            if (opSets[currentOp].size === 1) {
                const { value: command } = opSets[currentOp].values().next();
                opToString[currentOp] = command;
                foundCommands.add(command);
            }
        }
    }

    while (foundCommands.size < 16) {
        for (const op in opSets) {
            if (opToString[op] !== undefined) continue;
            const possibleCommand = opSets[op];
            for (const found of foundCommands) {
                possibleCommand.delete(found);
            }

            if (possibleCommand.size === 1) {
                const { value: command } = possibleCommand.values().next();
                opToString[op] = command;
                foundCommands.add(command);
            }
        }
    }

    let memory = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (const command of commands) {
        memory = execute(memory, opToString[command.op], command);
    }
    console.log(memory);
});


function checkFits(test) {
    const commands = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
    const matches = new Set();
    for (const command of commands) {
        const result = execute(test.preMemory, command, test.command);
        if (result[0] === test.postMemory[0] &&
            result[1] === test.postMemory[1] &&
            result[2] === test.postMemory[2] &&
            result[3] === test.postMemory[3]) {
            matches.add(command);
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
    throw 'err';
}