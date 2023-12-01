const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const state = data.toString().trim().split(/\r?\n\r?\n/).map((monkeyRows) => {
        const [name, rawItems, operation, test, trueAct, falseAct] = monkeyRows.split('\n').map(r => r.trim());

        const [opLeft, action, opRight] = operation.substring(operation.indexOf(' = ') + 3).split(' ');
        const items = rawItems.substring('Starting items: '.length).split(', ').map(Number);
        const divTest = Number(test.substring('Test: divisible by '.length))
        const trueThrow = Number(trueAct.substring('If true: throw to monkey'.length));
        const falseThrow = Number(falseAct.substring('If false: throw to monkey'.length));
        return {
            name: Number(name.slice('Monkey '.length, -1)),
            items,
            divTest,
            trueThrow,
            falseThrow,
            operation: {
                opLeft: opLeft === 'old' ? 'old' : Number(opLeft),
                action,
                opRight: opRight === 'old' ? 'old' : Number(opRight),
            },
            inspectCount: 0,
        }
    });
    const monkeyMap = new Map(state.map(x => [x.name, x]));
    for (let round = 0; round < 20; round++) {
        for (const [key, monkey] of monkeyMap) {
            for (const worry of monkey.items) {
                const leftVal = monkey.operation.opLeft === 'old' ? worry : monkey.operation.opLeft;
                const rightVal = monkey.operation.opRight === 'old' ? worry : monkey.operation.opRight;
                const afterOp = monkey.operation.action === '*' ? (leftVal * rightVal) : (leftVal + rightVal);
                const afterBored = Math.floor(afterOp / 3);
                const canDiv = (afterBored % monkey.divTest) === 0;
                const targetMonkeyId = canDiv ? monkey.trueThrow : monkey.falseThrow;
                const target = monkeyMap.get(targetMonkeyId);
                target.items.push(afterBored);
            }
            monkey.inspectCount += monkey.items.length;
            monkey.items = [];
        }
    }
    const [largest, secondLargest] = [...monkeyMap.values()].sort((a,b) => b.inspectCount - a.inspectCount);
    console.log(largest.inspectCount * secondLargest.inspectCount);
});