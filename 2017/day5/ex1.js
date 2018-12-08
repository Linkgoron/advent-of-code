const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const commands = data.toString().split('\n').map(x => parseInt(x));

    let steps = 0;
    let curPos = 0;
    while (curPos >= 0 && curPos < commands.length) {
        steps++;
        const toMove = commands[curPos];
        commands[curPos] += 1;
        curPos += toMove;
    }
    console.log(steps);
});