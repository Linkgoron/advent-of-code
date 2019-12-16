require('fs').readFile('./ex.input', (err, data) => {
    const repeats = 10000;
    const originalCode = data.toString().trim().split('').map(Number);
    const wat = Number(originalCode.slice(0, 7).join(''));
    const code = repeat(originalCode, repeats).slice(wat);
    console.log(wat, originalCode.length, code.length);
    const totalIterations = 100;
    const state = code.slice();
    const nextState = new Array(code.length);
    for (let iteration = 0; iteration < totalIterations; iteration++) {
        console.log(iteration);
        for (let location = 0; location < state.length; location++) {
            nextState[location] = Math.abs(countEnd(state, location, wat)) % 10;
        }
        for (let location = 0; location < state.length; location++) {
            state[location] = nextState[location];
        }
    }
    console.log('res', state.slice(0, 8).join(''));
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

function repeat(elem, times) {
    const newArr = new Array(elem.length * times);
    for (let iter = 0; iter < times; iter++) {
        for (let item = 0; item < elem.length; item++) {
            newArr[(elem.length * iter) + item] = elem[item];
        }
    }
    return newArr;
}

function countEnd(state, iteration, modifier) {
    let agg = 0;
    for (let i = iteration; i < state.length; i++) {
        agg += currentNum(iteration + modifier, i + modifier) * state[i];
    }
    return agg;
}