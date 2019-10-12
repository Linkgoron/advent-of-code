const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error(err);
    const [bindCommand, ...rawCommands] = rawData.toString().split('\n')
    const iRegister = parseInt(bindCommand.substring(3));
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
    const memory = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    memory[0] = 720163;
    const memPrnt = (mem) => ({ i: (mem[2] + 2), '1': mem[1], '3': mem[3], '4': mem[4], '5': mem[5] });

    for (let j = 1; j < 6; j++) memory[j] = 0;
    // console.log(memory);
    for (let instruction = 0; instruction >= 0 && instruction < commands.length; instruction++) {
        const command = commands[instruction];
        memory[iRegister] = instruction;
        const pre = { ...memory };
        execute(memory, command);
        // console.log(memPrnt(pre),command.original, '->',':', memPrnt(memory));
        instruction = memory[iRegister];
    }
    // console.log(memPrnt(memory));
    // console.log(memory);
});

const seen = new Set();
let last = 0;
function execute(memory, command) {
    if (command.original === 'eqrr 4 0 3') {
        if(seen.has(memory[4])) {
            console.log('the solution is', last);
            return;
        }
        seen.add(memory[4]);
        last = memory[4];
        if(seen.size % 1000 === 0) {
            console.log('loop', seen.size);
        }
    }
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
        case 'divi': {
            memory[command.result] = Math.ceil(memory[command.first]/command.second);
            return;
        }
        case 'divr': {
            memory[command.result] = Math.ceil(memory[command.first]/memory[command.second]);
            return;
        }
    }
    throw new Error(command);
}