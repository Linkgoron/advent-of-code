require('fs').readFile('./ex.input', (err, data) => {
    const code = data.toString().trim().split('').map(Number);
    const totalIterations = 100;
    let state = code.slice();
    for (let iteration = 0; iteration < totalIterations; iteration++) {
        let nextState = new Array(code.length);
        for (let location = 0; location < code.length; location++) {
            nextState[location] = Math.abs(countEnd(state, location)) % 10;
        }
        state = nextState;
    }
    console.log(state.slice(0, 8).join(''));
});

function currentNum(iteration, position) {
    if (position < iteration) {
        return 0;
    }
    const location = position - iteration;
    const index = location % (4 * (iteration + 1));
    const actualPos = Math.floor(index / (iteration + 1));
    if (actualPos === 0) return 1;
    if (actualPos === 2) return -1;
    return 0;
}

function countEnd(state, iteration) {
    let agg = 0;
    for (let i = iteration; i < state.length; i++) {
        agg += currentNum(iteration, i) * state[i];
    }
    return agg;
}