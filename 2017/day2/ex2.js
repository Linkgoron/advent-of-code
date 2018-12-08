const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\n').map(x => x.split('\t').map(x => parseInt(x)));
    let checksum = 0;
    for (const row of rows) {        
        checksum += findDividing(row);
    }
    console.log(checksum);
});


function findDividing(/** @type Array<number> */row) {
    for (let i = 0; i < row.length; i++) {
        const cur = row[i];
        for (let j = i + 1; j < row.length; j++) {
            const compare = row[j];
            if (isMod0(cur, compare)) {
                if (cur > compare) return cur / compare;
                return compare / cur;
            }
        }
    }
    throw "err";
}

function isMod0(a, b) {
    if (a > b) return a % b === 0;
    return b % a === 0;
}