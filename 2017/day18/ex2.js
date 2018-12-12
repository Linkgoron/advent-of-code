const fs = require('fs');
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split('\n').map((line, l) => {
        l = l + 1;
        const [command, ...params] = line.trim().split(' ');
        if (command === 'snd') {
            const firstLetter = params[0].charCodeAt(0);
            const isNumber = (firstLetter <= 57 && firstLetter >= 48) || firstLetter === 45;
            return {
                command,
                // line: l,
                isNumber: isNumber,
                registerValue: isNumber ? undefined : params[0].trim(),
                value: isNumber ? parseInt(params[0].trim()) : undefined,
                val(registers) { return this.isNumber ? this.value : (registers[this.registerValue] || 0) }
                // rawLine: line.trim()
            }
        }
        if (command === 'rcv') {
            return {
                command,
                // line: l,
                register: params[0].trim(),
                // rawLine: line.trim()
            }
        }
        if (command == 'jgz') {
            const leftFirstLetter = params[0].charCodeAt(0);
            const leftIsNumber = (leftFirstLetter <= 57 && leftFirstLetter >= 48) || leftFirstLetter === 45;

            const rightFirstLetter = params[1].charCodeAt(0);
            const rightIsNumber = (rightFirstLetter <= 57 && rightFirstLetter >= 48) || rightFirstLetter === 45;

            return {
                command,
                left: {
                    isNumber: leftIsNumber,
                    value: leftIsNumber ? parseInt(params[0]) : undefined,
                    register: leftIsNumber ? undefined : params[0],
                    val(registers) { return this.isNumber ? this.value : (registers[this.register] || 0) }
                },
                right: {
                    isNumber: rightIsNumber,
                    value: rightIsNumber ? parseInt(params[1]) : undefined,
                    register: rightIsNumber ? undefined : params[1],
                    val(registers) { return this.isNumber ? this.value : (registers[this.register] || 0) }
                }
            }
        }

        if (command === 'set' || command === 'add' || command === 'mul' || command === 'mod') {
            const firstLetter = params[1].charCodeAt(0);
            const isNumber = (firstLetter <= 57 && firstLetter >= 48) || firstLetter === 45;
            return {
                command,
                register: params[0].trim(),
                isNumber: isNumber,
                registerValue: isNumber ? undefined : params[1].trim(),
                value: isNumber ? parseInt(params[1].trim()) : undefined,
                val(registers) { return this.isNumber ? this.value : (registers[this.registerValue] || 0) }
            }
        }
    });

    var contextA = new Execution(0, commands);
    var contextB = new Execution(1, commands);
    contextA.partner = contextB;
    contextB.partner = contextA;

    while ((!contextA.state.terminated || !contextB.state.terminated)) {
        contextA.execute();
        contextB.execute();
    }

    console.log(contextB.sentValues);
});

const toOp = [
    'set',
    'add',
    'mul',
    'mod',
    'jgz']

class Execution {
    constructor(id, commands) {
        this.id = id;
        this.registers = { p: id, instruction: 0 };
        this.state = {
            waiting: false,
            terminated: false
        };
        this.commands = commands;
        this.sentValues = 0;
        this.queue = [];
    }

    executeCommand(command) {
        const { registers } = this;
        if (command.command === 'jgz') {
            const leftValue = command.left.val(registers);
            const rightValue = command.right.val(registers);
            return leftValue > 0 ? rightValue : 1;
        }
        const val = command.val(registers);
        if (command.command === 'set') { registers[command.register] = val; return 1; };
        if (command.command === 'add') { registers[command.register] += val; return 1; };
        if (command.command === 'mul') { registers[command.register] *= val; return 1; };
        if (command.command === 'mod') {
            if (registers[command.register] < 0 || val < 0) throw "wat";
            registers[command.register] = registers[command.register] % val; return 1;
        };
        throw "shouldn't get here";
    }

    setPartner(partner) {
        this.partner = partner;
    }

    getAgainstRegisterValue(command) {
        if (command.isNumber) return command.value;
        return this.registers[command.registerValue] || 0;
    }

    execute() {
        if (this.state.terminated) return;
        const { registers, commands } = this;
        const command = commands[registers.instruction];
        if (toOp.includes(command.command)) {
            registers.instruction += this.executeCommand(command);
        } else if (command.command === 'snd') {
            this.sentValues++;
            this.partner.queue.push(command.val(registers));
            registers.instruction++;
        } else if (command.command === 'rcv') {
            if (this.queue.length > 0) {
                const value = this.queue.shift();
                this.state.waiting = false;
                registers[command.register] = value;
                registers.instruction++;
            } else {
                this.state.waiting = true;
            }
        } else { throw 'no handler'; }

        this.state.terminated = this.registers.instruction >= this.commands.length
            || registers.instruction < 0
            || (this.state.waiting && this.partner.state.waiting)
            || (this.state.waiting && this.partner.state.terminated)
        // console.log('after', this.registers, this.state);
    }
}