const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const deers = data.toString().split('\r\n').map(x => x.trim().replace(".", '').split(' ')).map(x => ({
        name: x[0],
        speed: parseInt(x[3]),
        runTime: parseInt(x[6]),
        restTime: parseInt(x[13])
    }));
    const totalTime = 2503;
    const state = new Map(deers.map(x => [x.name, { name: x.name, location: 0, score: 0 }]));
    for (let i = 0; i < totalTime; i++) {
        for (const deer of deers) {
            const cycleTime = deer.runTime + deer.restTime;
            const pos = i % cycleTime;
            if (pos < deer.runTime) {
                const deerState = state.get(deer.name);
                deerState.location += deer.speed;
            }
        }
        const maxDistance = [...state.values()].reduce((acc, cur) => cur.location > acc ? cur.location : acc, 0);
        for (const deer of [...state.values()].filter(x => x.location === maxDistance)) {
            deer.score++;
        }
    }

    const maxScore = [...state.values()].reduce((acc, cur) => cur.score > acc ? cur.score : acc, 0);
    console.log(maxScore);
});