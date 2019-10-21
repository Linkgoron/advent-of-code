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
    const distances = deers.map(deer => {
        const cycleTime = deer.runTime + deer.restTime;
        const cycles = Math.floor(totalTime / cycleTime);
        const cycleDist = (deer.runTime * deer.speed) * cycles;
        const leftTime = totalTime % cycleTime;
        const leftDist = Math.min(leftTime, deer.runTime) * deer.speed;
        return leftDist + cycleDist;
    });
    const max = distances.reduce((acc, cur) => cur > acc ? cur : acc, distances[0]);
    console.log(max);
});