const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split(',').map(x => x[0] === 's' ? { command: 'spin', amount: parseInt(x.substring(1)) } :
        x[0] === 'x' ? { command: 'exchange', between: x.substring(1).split('/').map(x => parseInt(x)) } :
            { command: 'partner', between: x.substring(1).split('/') });
   
    const players = 16;
    let arr = new Array();
    for (let i = 0; i < players; i++) arr[i] = String.fromCharCode(97 + i);
    console.log(arr.join(''));
   
    for (const command of commands) {
        if (command.command === 'spin') {
            const spliced = arr.splice(players - command.amount, command.amount);
            arr = spliced.concat(arr);
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
    console.log(arr.join(''));
});