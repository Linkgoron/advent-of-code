require('fs').readFile('./ex1.input', (err, data) => {
    const orig = data.toString().trim().split(',').map(x => parseInt(x));
    const state = [...orig];
    state[1] = 12;
    state[2] = 2;
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
    console.log(state[0]);
});