const fs = require('fs');
fs.promises.readFile('./ex.input').then(raw => {
    const [rawWait, busses] = raw.toString().trim().split(/\r?\n/gm);
    const stuff = busses.split(',').filter(x => x !== 'x').map(Number);
    const wait = Number(rawWait);
    const waits = stuff.map(x => ({ after: x - wait % x, val: (x - wait % x) * x }));
    const min = waits.reduce((acc, cur) => cur.after < acc.after ? cur : acc, waits[0]);
    console.log(min.val);
});