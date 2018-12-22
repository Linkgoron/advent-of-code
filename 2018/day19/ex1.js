const fs = require('fs');
fs.readFile('/programming/advent of code/2018/day19/ex.input', (err, rawData) => {
    if (err) throw new Error(err);
    const [bindCommand, ...rawCommands] = rawData.toString().split('\n')
    const iRegister = parseInt(bindCommand.substring(3));
    const memory = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    const commands = rawCommands.map(x => {
        const [command, ...registers] = x.trim().split(' ');
        const op = registers.map(x => parseInt(x));
        return {
            op: command,
            first: op[0],
            second: op[1],
            result: op[2],
            original: x.trim()
        }
    });
    console.log(iRegister, commands);
    for (let instruction = 0; instruction >= 0 && instruction < commands.length; instruction++) {
        const command = commands[instruction];        
        memory[iRegister] = instruction;
        console.log('pre', instruction, memory, command.original);
        execute(memory, command);
        instruction = memory[iRegister];
        // console.log('post', instruction, memory);
    }
    console.log(memory);
});


function execute(memory, command) {
    switch (command.op) {
        case 'addr': {
            memory[command.result] = memory[command.first] + memory[command.second];
            return;
        }
        case 'addi': {
            memory[command.result] = memory[command.first] + command.second;
            return;
        }
        case 'mulr': {
            memory[command.result] = memory[command.first] * memory[command.second];
            return;
        }
        case 'muli': {
            memory[command.result] = memory[command.first] * command.second;
            return;
        }
        case 'banr': {
            memory[command.result] = memory[command.first] & memory[command.second];
            return;
        }
        case 'bani': {
            memory[command.result] = memory[command.first] & command.second;
            return;
        }
        case 'borr': {
            memory[command.result] = memory[command.first] | memory[command.second];
            return;
        }
        case 'bori': {
            memory[command.result] = memory[command.first] | command.second;
            return;
        }
        case 'setr': {
            memory[command.result] = memory[command.first];
            return;
        }
        case 'seti': {
            memory[command.result] = command.first;
            return;
        }
        case 'gtir': {
            memory[command.result] = command.first > memory[command.second] ? 1 : 0;
            return;
        }
        case 'gtri': {
            memory[command.result] = memory[command.first] > command.second ? 1 : 0;
            return;
        }
        case 'gtrr': {
            memory[command.result] = memory[command.first] > memory[command.second] ? 1 : 0;
            return;
        }
        case 'eqir': {
            memory[command.result] = command.first === memory[command.second] ? 1 : 0;
            return;
        }
        case 'eqri': {
            memory[command.result] = memory[command.first] === command.second ? 1 : 0;
            return;
        }
        case 'eqrr': {
            memory[command.result] = memory[command.first] === memory[command.second] ? 1 : 0;
            return;
        }
    }
    throw new Error(command);
}