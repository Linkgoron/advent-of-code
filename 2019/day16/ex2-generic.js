require('fs').readFile('./ex.input', (err, data) => {
    const repeats = 10000;
    const originalCode = data.toString().trim().split('').map(Number);
    const offset = Number(originalCode.slice(0, 7).join(''));
    const totalIterations = 100;
    const state = repeat(originalCode, repeats).slice(offset);
    const nextState = new Array(state.length);
    const middle = Math.ceil((repeats * originalCode.length) / 2);
    console.log(offset, middle, offset > middle);
    for (let iteration = 0; iteration < totalIterations; iteration++) {
        for (let location = 0; (location + offset) <= middle; location++) {
            nextState[location] = Math.abs(countEnd(state, location, offset)) % 10;
            console.log(location / (middle - offset))
        }

        // after the middle, all of the coefficients are 1, so just 'partial sum'
        let count = 0;
        for (let location = state.length - 1; location > Math.max(-1, middle - offset); location--) {
            count = (count + state[location]) % 10;
            nextState[location] = count;
        }

        for (let location = 0; location < state.length; location++) {
            state[location] = nextState[location];
        }
    }
    console.log('res', state.slice(0, 8).join(''));
});

function repeat(elem, times) {
    const newArr = new Array(elem.length * times);
    for (let iter = 0; iter < times; iter++) {
        for (let item = 0; item < elem.length; item++) {
            newArr[(elem.length * iter) + item] = elem[item];
        }
    }
    return newArr;
}

function countEnd(state, iteration, offset) {
    let agg = 0;
    for (let i = iteration; i < state.length; i++) {
        agg += currentNum(iteration + offset, i + offset) * state[i];
    }
    return agg;
}

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