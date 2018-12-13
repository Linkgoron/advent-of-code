const fs = require('fs');
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split('\n').map(line => {
        const [command, ...params] = line.trim().split(' ');
        if (command === 'snd' || command === 'rcv') {
            return {
                command,
                register: params[0].trim()
            }
        }
        if (command === 'set' || command === 'add' || command === 'mul' || command === 'mod' || command == 'jgz') {
            const isNumber = params[1].charCodeAt(0) < 58;
            return {
                command,
                register: params[0].trim(),
                isNumber: isNumber,
                value: isNumber ? parseInt(params[1].trim()) : params[1].trim()
            }
        }
    });

    const registers = {};
    let res = undefined;
    for (let j = 0; j < 100000; j++) {
        const cur = commands[j];        
        const { mov, rcv } = execute(cur, registers);
        if (rcv !== undefined) {
            res = rcv;
            break;
        }
        j += mov;
    }
    if (res === undefined) console.log('error, res is undefined');
    console.log(res);
});

function formalizeValue(command) {
    if (command.isNumber) return command.value;
    return `registers['${command.value}']`;
}

const toOp = {
    'set': (command) => `registers['${command.register}'] = ${formalizeValue(command)}; 0;`,
    'add': (command) => `registers['${command.register}'] += ${formalizeValue(command)}; 0;`,
    'mul': (command) => `registers['${command.register}'] *= ${formalizeValue(command)}; 0;`,
    'mod': (command) => `registers['${command.register}'] = (registers['${command.register}'] % ${formalizeValue(command)}); 0;`,
    'jgz': (command) => `registers['${command.register}'] > 0 ? (${formalizeValue(command)}-1) : 0`,
}

function execute(command, registers) {
    if (registers[command.register] === undefined) registers[command.register] = 0;
    if (command.command in toOp) {
        // console.log('before', registers);
        const mov = eval(toOp[command.command](command));
        // console.log('after', registers);
        // console.log('mov', mov);
        return { mov };
    }
    if (command.command === 'snd') {
        registers.lastSound = registers[command.register];
        return { mov: 0 };
    }

    if (command.command === 'rcv') {
        if (registers[command.register] !== 0) {
            return { mov: 0, rcv: registers.lastSound };
        }
        return { mov: 0 };
    }
}