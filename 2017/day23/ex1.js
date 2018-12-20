const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    function isRegister(str) {
        return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(str) >= 0;
    }
    const commands = rawData.toString().split('\n').map(x => x.trim())
        .map((rawCommand) => {
            const [command, left, right] = rawCommand.split(' ');
            console.log(command);
            const rightIsRegister = isRegister(right)
            if (command === 'set') {
                return {
                    command,
                    register: left,
                    isRegister: rightIsRegister,
                    value: rightIsRegister ? right : parseInt(right)
                }
            }
            if (command === 'sub') {
                return {
                    command,
                    register: left,
                    isRegister: rightIsRegister,
                    value: rightIsRegister ? right : parseInt(right)
                }
            }
            if (command === 'mul') {
                return {
                    command,
                    register: left,
                    isRegister: rightIsRegister,
                    value: rightIsRegister ? right : parseInt(right)
                }
            }
            if (command === 'jnz') {
                const isLeftRegister = isRegister(left)
                return {
                    command,
                    isLeftRegister: isLeftRegister,
                    leftValue: isLeftRegister ? left : parseInt(left),
                    isRegister: rightIsRegister,
                    value: rightIsRegister ? right : parseInt(right)
                }
            }
        });

    let memory = { instruction: 0, numOfMul: 0 };
    for (let code = 'a'.charCodeAt(0); code <= 'h'.charCodeAt(0); code++) {
        memory[String.fromCharCode(code)] = 0;
    }

    console.log(commands);
    while (memory.instruction >= 0 && memory.instruction < commands.length) {
        const command = commands[memory.instruction];
        execute(command, memory);
    }
    console.log(memory);

    function execute(command, memory) {
        switch (command.command) {
            case 'set': {
                memory[command.register] = command.isRegister ? memory[command.value] : command.value;
                memory.instruction++;
                return;
            }
            case 'sub': {
                memory[command.register] -= command.isRegister ? memory[command.value] : command.value;
                memory.instruction++
                return;
            }
            case 'mul': {
                memory[command.register] *= command.isRegister ? memory[command.value] : command.value;
                memory.instruction++;                
                return;
            }
            case 'jnz': {
                const comparedAgainst = command.isLeftRegister ? memory[command.leftValue] : command.leftValue;
                if (comparedAgainst != 0) {
                    memory.instruction += command.isRegister ? memory[command.value] : command.value;
                } else {
                    memory.instruction++;
                }
                return;
            }
        }
    }
});