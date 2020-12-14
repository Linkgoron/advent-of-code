const fs = require('fs');
fs.promises.readFile('./ex.input').then(raw => {
    const commands = raw.toString().trim().split(/\r?\n/gm).map(x => {
        const [to, value] = x.split(' = ');
        if (to === 'mask') {
            return {
                command: 'mask',
                value,
            };
        }
        return {
            command: 'value',
            target: to.substring(4, to.length - 1),
            value: Number(value),
        }
    });

    const memory = {};
    let mask = '';
    for (const { command, value, target = "" } of commands) {
        if (command === 'mask') {
            mask = value;
            continue;
        }
        memory[target] = maskify(mask, value);
    }
    console.log(mask, memory, Object.values(memory).reduce((acc, val) => acc + val, 0));
});

function maskify(mask, value) {
    const binary = value.toString(2).padStart(mask.length, '0');
    let num = '';
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === 'X') {
            num = num + binary[i];
        } else {
            num = num + mask[i];
        }
    }

    return parseInt(num, 2);
}