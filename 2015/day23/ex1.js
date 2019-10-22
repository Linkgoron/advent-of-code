const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split('\r\n').map(x => x.trim().replace(',', '').split(' ')).map(parseCommand);
    const program = new Program(commands);
    const result = program.executeAll();
    console.log(result);
});

class Program {
    constructor(commands) {
        this.memory = { a: 0, b: 0, inst: 0 };
        this.commands = commands.slice();
    }

    isDone() {
        return this.memory.inst >= this.commands.length || this.memory.inst < 0;
    }

    executeCommand() {
        const current = this.commands[this.memory.inst];
        switch (current.command) {
            case 'hlf':
            case 'tpl': {
                this.memory[current.register] *= current.by;
                break;
            };
            case 'inc': {
                this.memory[current.register] += 1;
                break;
            }
            case 'jmp': {
                this.memory.inst += current.by - 1;
                break;
            }
            case 'jie': {
                if (this.memory[current.register] % 2 === 0) {
                    this.memory.inst += current.by - 1;
                }
                break;
            }
            case 'jio': {
                if (this.memory[current.register] === 1) {
                    this.memory.inst += current.by - 1;
                }
                break;
            }
        }
        this.memory.inst++;
    }

    executeAll() {
        while (!this.isDone()) {            
            this.executeCommand();            
        }

        return this.memory;
    }
}

function parseCommand(x) {
    switch (x[0]) {
        case 'hlf':
        case 'tpl': {
            return {
                command: x[0],
                register: x[1],
                by: x[0] === 'hlf' ? 0.5 : 3
            };
        }
        case 'inc': {
            return {
                command: x[0],
                register: x[1]
            }
        }
        case 'jmp': {
            return {
                command: 'jmp',
                by: parseInt(x[1])
            };
        }
        case 'jie':
        case 'jio': {
            return {
                command: x[0],
                register: x[1],
                by: parseInt(x[2])
            };
        }
    }
}