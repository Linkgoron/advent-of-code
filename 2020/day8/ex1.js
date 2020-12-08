const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const linesOfCode = data.toString().trim().split(/\r?\n/gm).map(x => {
        const [operation, argument] = x.split(' ');
        return {
            operation,
            argument: Number(argument),
        }
    });

    let accumulator = 0;
    let ip = 0;

    let executed = new Set();
    for (; ip >= 0 && ip < linesOfCode.length && !executed.has(ip); ip++) {
        executed.add(ip);
        const currentCommand = linesOfCode[ip];
        switch (currentCommand.operation) {
            case 'nop': {
                continue;
            }
            case 'acc': {
                accumulator += currentCommand.argument;
                continue;
            }
            case 'jmp': {
                ip += currentCommand.argument - 1;
            }
        }
    }
    console.log(accumulator);
});