const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var commands = data.toString().split('\n').map(s => s.trim().split(' ')).map(x => ({
        registerAffected: x[0],
        op: x[1],
        opBy: parseInt(x[2]),
        why: {
            register: x[4],
            op: x[5],
            value: parseInt(x[6])
        }
    }));

    const registers = {
        execCommand(command) {
            const exec = `(this.${command.why.register} === undefined ? 0 : this.${command.why.register}) ${command.why.op} ${command.why.value};`;
            const cond = eval(exec);
            if (cond) {
                const curValue = (this[command.registerAffected] || 0);
                if (command.op === 'inc') {
                    this[command.registerAffected] = curValue + command.opBy;
                } else {
                    this[command.registerAffected] = curValue - command.opBy;
                }
            }
            return this[command.registerAffected];
        }
    };

    let curMax = 0;
    for (const command of commands) {
        const newValue = registers.execCommand(command);
        if (newValue > curMax) {
            curMax = newValue
        }
    }
    console.log(curMax);
});
