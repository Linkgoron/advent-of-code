const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    let allDirs = data.toString().trim().split(/\r?\n/gm).map(x => {
        const dirs = [];
        for (let i = 0; i < x.length; i++) {
            if (x[i] === 'e' || x[i] === 'w') {
                dirs.push(x[i]);
                continue;
            }
            if (x[i] === 's' || x[i] === 'n') {
                dirs.push(x[i] + x[i + 1]);
                i++;
                continue;
            }
        }
        return dirs;
    });

    const blackList = new Set();
    for (const dirs of allDirs) {
        const pos = { x: 0, y: 0 };
        for (const step of dirs) {
            if (step === 'e') pos.x++
            else if (step === 'w') pos.x--;
            else if (step === 'ne') { pos.x += 0.5; pos.y += 1; }
            else if (step === 'nw') { pos.x -= 0.5; pos.y += 1; }
            else if (step === 'se') { pos.x += 0.5; pos.y -= 1; }
            else if (step === 'sw') { pos.x -= 0.5; pos.y -= 1; }
        }
        if (blackList.has(`${pos.x},${pos.y}`)) {
            blackList.delete(`${pos.x},${pos.y}`);
        } else {
            blackList.add(`${pos.x},${pos.y}`);
        }
    }

    console.log(blackList.size);
});
