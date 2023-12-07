const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [time, distance] = data.toString().trim().split('\n').map(x => Number(x.trim().split(': ')[1].trim().replaceAll(' ','')));
    const race = {
        time,
        distance
    };

    const solution1 = (-race.time + Math.sqrt(race.time**2 - 4 * (-race.distance * -1)))/(-2);
    const solution2 = (-race.time - Math.sqrt(race.time**2 - 4 * (-race.distance * -1)))/(-2);        
    const maxSol = Math.max(solution1, solution2);
    const minSol = Math.min(solution1, solution2);
    let fullMinLim = Number.isInteger(minSol) ? (minSol + 1) : Math.ceil(minSol);
    let fullMaxLim = Number.isInteger(maxSol) ? (maxSol - 1) : Math.floor(maxSol);
    console.log(fullMaxLim - fullMinLim + 1);
});
