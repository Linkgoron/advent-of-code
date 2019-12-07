require('fs').readFile('./ex1.input', (err, data) => {
    const startingState = data.toString().trim().split(',').map(x => parseInt(x))
    const options = permutations([0, 1, 2, 3, 4]);

    let maxOutput = undefined;
    let maxConfig = undefined;
    for (const option of options) {
        let prevOutput = [0];
        for (item of option) {
            prevOutput = runProgram([item, prevOutput[0]], startingState);
        }
        var actualOutput = prevOutput[0];
        if (maxOutput === undefined || maxOutput < actualOutput) {
            maxOutput = actualOutput;
            maxConfig = [...option];
        }
    }
    console.log(`max output ${maxOutput}, config is ${maxConfig}`);


});
function runProgram(inputs, startingState) {
    const state = [...startingState];
    const outputStream = [];
    let inputPointer = 0;
    for (let inst = 0; inst < state.length; inst++) {
        const totalCommand = state[inst++];
        const command = totalCommand % 100;
        if (![1, 2, 3, 4, 5, 6, 7, 8, 99].includes(command)) {
            console.log('bad op-code', inst - 1, command);
            break;
        }

        if (command === 99) {
            return outputStream;
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
                if (inputPointer < inputs.length) {
                    let currentInput = inputs[inputPointer];
                    state[state[inst]] = currentInput;
                    if (inputPointer < inputs.length) {
                        inputPointer++;
                    }
                } else {
                    state[state[inst]] = inputs.length - 1;
                    console.warn('too many inputs');
                }
                continue;
            }
            case 4: {
                var out = fetchValue(modes[0], state[inst], state);
                outputStream.push(out);
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
    return out;
}

function permutations(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permutations(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}