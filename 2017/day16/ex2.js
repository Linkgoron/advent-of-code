const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split(',').map(x => x[0] === 's' ? { command: 'spin', amount: parseInt(x.substring(1)) } :
        x[0] === 'x' ? { command: 'exchange', between: x.substring(1).split('/').map(x => parseInt(x)) } :
            { command: 'partner', between: x.substring(1).split('/') });
    const players = 16;
    const arr = new Array(players)

    for (let i = 0; i < players; i++) arr[i] = String.fromCharCode(97 + i);
    const initialState = arr.join('');
    const maxAmountOfRounds = 1000000000;
    for (var cycle = 0; (cycle === 0 || arr.join('') !== initialState) && cycle < maxAmountOfRounds; cycle++) {
        dance(commands, arr);
    }
    if (cycle === maxAmountOfRounds) {
        console.log('no cycle detected, state is', arr.join(''));
    } else {
        console.log('cycle length is', cycle);
        const totalDancing = maxAmountOfRounds % cycle;
        console.log('need to dance', totalDancing);
        // arr is already at initial state as a cycle has been detected.
        for (let i = 0; i < totalDancing; i++) dance(commands, arr);
        console.log('state is', arr.join(''));
    }
});

function dance(commands, arr) {
    for (const command of commands) {
        if (command.command === 'spin') {
            const replaceMe = new Array(arr.length);
            for (let j = 0; j < arr.length; j++) {
                replaceMe[j] = arr[(arr.length - command.amount + j) % arr.length];
            }
            for (let j = 0; j < arr.length; j++) {
                arr[j] = replaceMe[j];
            }
            continue;
        }
        if (command.command === 'exchange') {
            const [i, j] = command.between;
            const saved = arr[i];
            arr[i] = arr[j];
            arr[j] = saved;
            continue;
        }
        if (command.command === 'partner') {
            const [i, j] = command.between;
            const locI = arr.indexOf(i);
            const locJ = arr.indexOf(j);
            arr[locI] = j;
            arr[locJ] = i;
        }
    }
    return arr;
}