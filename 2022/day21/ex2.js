const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const monkeys = data.toString().trim().split(/\r?\n/).map(monkey => {
        const [name, op] = monkey.split(': ');
        if (op.includes(' ')) {
            const [left, operation, right] = op.split(' ');
            return {
                name,
                left,
                right,
                operation,
                type: 'op',
            }
        } else {
            return {
                name,
                value: Number(op.trim()),
                type: 'value',
            }
        }
    });
    // put all values first.
    monkeys.sort((a, b) => b.type.localeCompare(a.type));
    const firstOpIndex = monkeys.findIndex(x => x.type === 'op')
    let fixed = true;
    while (fixed) {
        fixed = false;
        for (let i = firstOpIndex; i < monkeys.length; i++) {
            const monkey = monkeys[i];
            if (monkey.type === 'value') continue;
            const rest = monkeys.slice(i + 1);
            const badies = rest.filter(x => x.name === monkey.left || x.name === monkey.right);
            if (badies.length === 0) {
                continue;
            }
            const after = Math.max(...badies.map(x => monkeys.indexOf(x)));
            monkeys.splice(i, 1);
            monkeys.splice(after, 0, monkey);
            fixed = true;
            break;
        }
    }


    const humanMonkey = monkeys.find(x => x.name === 'humn');
    const root = monkeys.find(x => x.name === 'root');
    root.operation = '=';
    let curValue = 1;
    let done = false;
    while (!done) {
        humanMonkey.value = curValue;
        const { left, right } = runProgram(monkeys)
        if (left > right) {
            curValue *= 10;
        } else {
            done = true;
        }
    }

    curValue = curValue / 10;
    const numberOfDigites = Math.log10(curValue);
    console.log(numberOfDigites);
    for (let i = 0; i < numberOfDigites; i++) {
        done = false;
        const toAdd = 10 ** (numberOfDigites - 1 - i);
        while (!done) {
            humanMonkey.value = curValue;
            const { left, right } = runProgram(monkeys)
            if (left > right) {
                curValue += toAdd;
            } else {
                done = true;
            }
        }
        if (i !== numberOfDigites - 1) {
            curValue -= toAdd;
        }
    }
    console.log(curValue);
});

function runProgram(monkeys) {
    let values = {};
    for (const monkey of monkeys) {
        values[monkey.name] = monkey.type === 'value' ? monkey.value : compute(monkey, values);
    }
    const root = monkeys.find(x => x.name === 'root');
    return {
        left: values[root.left],
        right: values[root.right],
        res: values.root,
    }
}

function compute(monkey, values) {
    const left = values[monkey.left]
    const right = values[monkey.right]
    if (monkey.operation === '/') {
        return left / right;
    }
    if (monkey.operation === '+') {
        return left + right;
    }
    if (monkey.operation === '-') {
        return left - right;
    }
    if (monkey.operation === '*') {
        return left * right;
    }

    if (monkey.operation === '=') {
        return left === right;
    }
    console.log(monkey.operation);
    throw new Error('asd');
}