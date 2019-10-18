const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split('\r\n').map(x => x.trim().split(' ')).map(parseCommand);
    const program = new Program(commands);    
    const result = program.executeAll();
    console.log(result);
});


class Program {
    constructor(commands) {
        this.memory = { a: 0, b: 0, c: 1, d: 0, inst: 0 };
        this.commands = commands.slice();
    }

    isDone() {
        return this.memory.inst >= this.commands.length;
    }

    executeCommand() {
        let executed = false;
        const current = this.commands[this.memory.inst];
        if (current.command === 'inc' || current.command === 'dec') {
            this.memory[current.register] += current.command === 'inc' ? 1 : -1;
            executed = true;
        } else if (current.command === 'cpy') {
            this.memory[current.to] = current.fromRegister ? this.memory[current.value] : current.value;
            executed = true;
        } else if (current.command === 'jnz') {
            const compareTo = current.shouldByRegister ? this.memory[current.nonZeroValue] : current.nonZeroValue;
            // console.log(compareTo);
            if (compareTo !== 0) {
                this.memory.inst += current.jumpByRegister ? this.memory[current.jumpBy] : current.jumpBy;
                // console.log('jmp',this.memory);
            }
            executed = true;
        }
        if (!executed) throw new error('failed to execute');
        this.memory.inst++;
    }

    executeAll() {
        // console.log(this.memory);
        while (!this.isDone()) {
            // console.log(this.commands[this.memory.inst]);
            this.executeCommand();
            // console.log(this.memory);
        }

        return this.memory;
    }
}

function parseCommand(x) {
    switch (x[0]) {
        case 'dec':
        case 'inc': {
            return {
                command: x[0],
                register: x[1]
            };
        }
        case 'cpy': {
            const fromRegister = x[1].charCodeAt(0) > 96;
            return {
                command: 'cpy',
                to: x[2],
                fromRegister: fromRegister,
                value: fromRegister ? x[1] : parseInt(x[1])
            };
        }
        case 'jnz': {
            const compareToRegister = x[1].charCodeAt(0) > 96;
            const value = compareToRegister ? x[1] : parseInt(x[1])
            const jumpByRegister = x[2].charCodeAt(0) > 96;
            const jumpBy = jumpByRegister ? x[2] : parseInt(x[2])
            return {
                command: 'jnz',
                shouldByRegister: compareToRegister,
                nonZeroValue: value,
                jumpByRegister: jumpByRegister,
                jumpBy: jumpByRegister ? jumpBy : jumpBy - 1,
            };
        }
    }
}