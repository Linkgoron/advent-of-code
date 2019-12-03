require('fs').readFile('./ex1.input', (err, data) => {
    const orig = data.toString().trim().split(',').map(x => parseInt(x));
    for (let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb++) {
            const state = [...orig];
            state[1] = noun;
            state[2] = verb;
            for (let i = 0; i < state.length && state[i] !== 99; i += 4) {
                if (state[i] !== 1 && state[i] !== 2) {
                    console.log('bad op-code', i, state[i]);
                    break;
                }

                var dest = state[i + 3];
                let leftVal = state[state[i + 1]] || 0;
                let rightVal = state[state[i + 2]] || 0;
                let val = leftVal + rightVal;
                if (state[i] === 2) {
                    val = leftVal * rightVal;
                }

                state[dest] = val;
            }
            if (state[0] === 19690720) {
                console.log((100 * noun) + verb);
                return;
            }
        }
    }
});