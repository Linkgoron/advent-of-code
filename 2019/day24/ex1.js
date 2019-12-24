require('fs').readFile('./ex.input', (err, data) => {
    const map = new Map(data.toString().trim().split('\n')
        .map((row, rowIndex) => row.trim().split('').map((col, colInd) =>
            [`${colInd},${rowIndex}`, col === '#'])).flat());

    let set = new Set();
    let currentState = new Map(map);
    while (!set.has(hash(currentState))) {
        set.add(hash(currentState));
        currentState = nextState(currentState);
    }
    const val = [...currentState.values()].reduce((total, x, i) => total + (x ? 2 ** i : 0), 0);
    console.log(val);


    function hash(map) {
        console.log('asdasdas', map);
        return [...map.values()].join(',').toString();
    }

    function nextState(map) {
        let nextStep = new Map();
        for (const [loc, isBug] of map) {
            const [x, y] = loc.split(',').map(Number);
            const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            const bugNeihbs = opts.map(([movX, movY]) => Boolean(map.get(`${x + movX},${y + movY}`)))
                .filter(Boolean);
            if (isBug) {
                nextStep.set(loc, bugNeihbs.length == 1);
            } else {
                nextStep.set(loc, bugNeihbs.length == 1 || bugNeihbs.length == 2);
            }
        }
        return nextStep;
    }
});