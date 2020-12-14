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
        const targets = maskify(mask, target);
        for (const target of targets) {
            memory[target] = value;
        }
    }
    console.log(Object.values(memory).reduce((acc, val) => acc + val, 0));
});

function* createMasks(mask, target, index = 0) {
    if (index === mask.length) {
        yield '';
        return;
    }

    const results = createMasks(mask, target, index + 1);

    for (const result of results) {
        if (mask[index] === '0') {
            yield result + target[index];
            continue;
        }
        if (mask[index] === '1') {
            yield result + '1';
            continue;
        }

        yield result + '0';
        yield result + '1';
    }
}

function maskify(mask, target) {
    const binary = Number(target).toString(2).padStart(mask.length, '0');
    return [...createMasks(mask, binary, 0)];
}