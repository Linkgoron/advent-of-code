const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [times, distances] = data.toString().trim().split('\n').map(x => x.trim().split(': ')[1].trim().split(/ +/g).map(x => Number(x.trim())));
    const races = times.map((time, i) => ({
        time,
        distance: distances[i]
    }));

    const counts = [];
    for (let race of races) {
        const solution1 = (-race.time + Math.sqrt(race.time**2 - 4 * (-race.distance * -1)))/(-2);
        const solution2 = (-race.time - Math.sqrt(race.time**2 - 4 * (-race.distance * -1)))/(-2);        
        const maxSol = Math.max(solution1, solution2);
        const minSol = Math.min(solution1, solution2);
        let fullMinLim = Number.isInteger(minSol) ? (minSol + 1) : Math.ceil(minSol);
        let fullMaxLim = Number.isInteger(maxSol) ? (maxSol - 1) : Math.floor(maxSol);
        counts.push(fullMaxLim - fullMinLim + 1);
    }
    console.log(counts.reduce((acc, cur) => acc*cur, 1));
});
