require('fs').readFile('./ex.input', (err, data) => {
    const repeats = 10000;
    const originalCode = data.toString().trim().split('').map(Number);
    const wat = Number(originalCode.slice(0, 7).join(''));
    const code = repeat(originalCode, repeats).slice(wat);
    const totalIterations = 100;
    const state = code.slice();
    const nextState = new Array(code.length);
    // the code only works for input with code which is after the 0.5 mark.
    for (let iteration = 0; iteration < totalIterations; iteration++) {
        let count = 0;
        for (let location = state.length - 1; location >= 0; location--) {
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