require('fs').readFile('./ex2.input', (err, data) => {
    const orig = data.toString().trim().split(',').map(x => parseInt(x))
    const state = [...orig]
    for (let inst = 0; inst < state.length; inst++) {
        const totalCommand = state[inst++]
        const command = totalCommand % 100
        if (![1, 2, 3, 4, 5, 6, 7, 8, 99].includes(command)) {
            console.log('bad op-code', inst - 1, command)
            break
        }

        if (command === 99) {
            console.log('done');
            break;
        }
        var modeString = [...Math.floor(totalCommand / 100).toString()].reverse()
        var modes = [parseInt(modeString[0] || '0'), parseInt(modeString[1] || '0'), parseInt(modeString[2] || '0')]

        function fetchValue(mode, value, memory) {
            return mode === 1 ? value : memory[value];
        }

        switch (command) {
            case 1: {
                var left = fetchValue(modes[0], state[inst++], state);
                var right = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = left + right;
                continue
            }
            case 2: {
                var left = fetchValue(modes[0], state[inst++], state);
                var right = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = left * right;
                continue
            }
            case 3: {
                state[state[inst]] = getInput();
                continue;
            }
            case 4: {
                var out = fetchValue(modes[0], state[inst], state);
                output(out);
                continue;
            }
            case 5: {
                var first = fetchValue(modes[0], state[inst++], state);
                if (first !== 0) {
                    inst = fetchValue(modes[1], state[inst], state) - 1;
                }
                continue;
            }
            case 6: {
                var first = fetchValue(modes[0], state[inst++], state);
                if (first === 0) {
                    inst = fetchValue(modes[1], state[inst], state) - 1;
                }
                continue;
            }
            case 7: {
                var first = fetchValue(modes[0], state[inst++], state);
                var second = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = first < second ? 1 : 0;
                continue;
            }
            case 8: {
                var first = fetchValue(modes[0], state[inst++], state);
                var second = fetchValue(modes[1], state[inst++], state);
                state[state[inst]] = first === second ? 1 : 0;
                continue;
            }
        }
    }
})

function getInput() {
    return 5;
}
function output(value) {
    console.log(value);
    return;
}
