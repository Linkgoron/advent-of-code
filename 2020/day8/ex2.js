const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const linesOfCode = data.toString().trim().split(/\r?\n/gm).map((x, i) => {
        const [operation, argument] = x.split(' ');
        return {
            operation,
            argument: Number(argument),
            line: i,
        }
    });

    for (const nop of linesOfCode.filter(x => x.operation === 'nop')) {
        const newProgram = linesOfCode.map(x => ({ ...x }));
        newProgram[nop.line].operation = 'jmp';
        const prog = runProgram(newProgram);
        if (prog.success) {
            console.log(prog.accumulator, 'jmp->nop');
            return;
        }
    }

    for (const nop of linesOfCode.filter(x => x.operation === 'jmp')) {
        const newProgram = linesOfCode.map(x => ({ ...x }));
        newProgram[nop.line].operation = 'nop';
        const prog = runProgram(newProgram);
        if (prog.success) {
            console.log(prog.accumulator, 'nop->jmp');
            return;
        }
    }

    console.log('no program succeeded.');
});

function runProgram(linesOfCode) {
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
    return {
        success: ip === linesOfCode.length,
        accumulator,
        ip,
        loop: executed.has(ip),
    }
}