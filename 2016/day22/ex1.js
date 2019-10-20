const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const disks = data.toString().trim().split('\r\n').slice(1).map(row => row.trim().split(/ +/g))
        .map(x => ({
            x: parseInt(x[0].split('-')[1].replace('x', '')),
            y: parseInt(x[0].split('-')[2].replace('y', '')),
            size: parseInt(x[1].replace('T', '')),
            used: parseInt(x[2].replace('T', '')),
            availiable: parseInt(x[3].replace('T', ''))
        }));

    let pairs = 0;
    for (let i = 0; i < disks.length; i++) {
        const aDisk = disks[i];
        if (aDisk.used === 0) continue;
        for (let j = 0; j < disks.length; j++) {
            if (i === j) continue;
            const bDisk = disks[j];
            if (aDisk.used <= bDisk.availiable) {
                pairs++;
            }
        }
    }
    console.log(pairs);
});