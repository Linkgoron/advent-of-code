const fs = require('fs');

represent = (banks) => banks.map(bank => bank.contains).join(',');
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const banks = data.toString().split('\t').map((x, i) => ({
        id: i,
        contains: parseInt(x)
    }));
    const numberOfBanks = banks.length;
    const memory = new Map();
    const initStateRep = represent(banks);
    memory.set(initStateRep, 0);
    console.log(banks);
    for (var i = 1; i < 10000; i++) {
        const cur = [...banks].sort((b1, b2) => (b2.contains - b1.contains) || (b1.id - b2.id))[0];
        const toDistribute = cur.contains;
        cur.contains = 0;
        const pos = cur.id;
        for (let toGive = 1; toGive <= toDistribute; toGive++) {
            banks[(pos + toGive) % numberOfBanks].contains++;
        }
        const representation = represent(banks);
        if (memory.has(representation)) {
            const prevSeen = memory.get(representation);
            console.log(i, prevSeen, i - prevSeen);
            break;
        }
        memory.set(representation, i);
    }
    console.log(i);
});