const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split('\r\n').map(x => x.trim().split(' ')).map(parseCommand);    
    for (let i = 1; i < 1_000_000_000; i++) {
        try {
            const program = new Program(commands, i);
            program.executeAll(100000);
            console.log('SUCCESS', i);
            return
        } catch (e) {
        }
    }
});

class Program {
    constructor(commands, init) {
        this.memory = { a: init, b: 0, c: 0, d: 0, inst: 0 };
        this.commands = commands.slice();
        this.prevOut = 1;
    }

    toggle(index) {
        if (index < 0 || index >= this.commands.length) {
            return;
        }
        const toToggle = this.commands[index];
        if (toToggle.command === 'inc' || toToggle.command === 'dec' || toToggle.command === 'tgl') {
            this.commands[index] = {
                command: toToggle.command === 'inc' ? 'dec' : 'inc',
                register: toToggle.register,
                toggled: toToggle
            }
            return;
        }
        if (toToggle.command === 'jnz' || toToggle.command === 'cpy') {
            this.commands[index] = {
                command: toToggle.command === 'jnz' ? 'cpy' : 'jnz',
                firstArgReg: toToggle.firstArgReg,
                firstArg: toToggle.firstArg,
                secondArgReg: toToggle.secondArgReg,
                secondArg: toToggle.secondArg,
                toggled: toToggle
            }
            return;
        }
        throw new Error('did not toggle');
    }

    isDone() {
        return this.memory.inst >= this.commands.length;
    }

    executeCommand() {
        let executed = false;
        const current = this.commands[this.memory.inst];
        // console.log('executing', this.memory.inst, current,this.memory);
        if (current.command === 'inc' || current.command === 'dec') {
            this.memory[current.register] += current.command === 'inc' ? 1 : -1;
            executed = true;
        } else if (current.command === 'tgl') {
            this.toggle(this.memory.inst + this.memory[current.register])
            executed = true;
        } else if (current.command === 'out') {
            const curOut = this.memory[current.register];
            if (curOut === this.prevOut) {
                throw new Error(`same output ${curOut},${this.prevOut}`);
            }
            this.prevOut = curOut;
            executed = true;
        } else if (current.command === 'cpy') {
            if (current.secondArgReg) {
                this.memory[current.secondArg] = current.firstArgReg ? this.memory[current.firstArg] : current.firstArg;
            }
            executed = true;
        } else if (current.command === 'jnz') {
            const compareTo = current.firstArgReg ? this.memory[current.firstArg] : current.firstArg;
            if (compareTo !== 0) {
                this.memory.inst += current.secondArgReg ? (this.memory[current.secondArg] - 1) : (current.secondArg - 1);
            }
            executed = true;
        }
        if (!executed) throw new error('failed to execute');
        this.memory.inst++;
    }

    executeAll(numOfSteps) {
        let stepCount = 0;
        const shouldCount = typeof numOfSteps === 'number';
        while (!this.isDone()) {
            if (shouldCount) {
                if (stepCount >= numOfSteps) {
                    break;
                }
                stepCount++;
            }
            this.executeCommand();
            // console.log(this.memory);
        }

        return this.memory;
    }
}

function parseCommand(x) {
    switch (x[0]) {
        case 'out':
        case 'tgl':
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
                firstArgReg: fromRegister,
                firstArg: fromRegister ? x[1] : parseInt(x[1]),
                secondArg: x[2],
                secondArgReg: true
            };
        }
        case 'jnz': {
            const compareToRegister = x[1].charCodeAt(0) > 96;
            const value = compareToRegister ? x[1] : parseInt(x[1])
            const secondArgReg = x[2].charCodeAt(0) > 96;
            const jumpBy = secondArgReg ? x[2] : parseInt(x[2])
            return {
                command: 'jnz',
                firstArgReg: compareToRegister,
                firstArg: value,
                secondArg: jumpBy,
                secondArgReg: secondArgReg,
            };
        }
        case 'tgl': {
            const register = x[1]
            return {
                command: 'tgl',
                register
            };
        }
    }
}