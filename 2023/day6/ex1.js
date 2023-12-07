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
        let count = 0;
        for (let accel = 0; accel < race.time; accel++) {
            if (accel * (race.time - accel) > race.distance) {
                count++;
            }
        }
        counts.push(count);
    }
    console.log(counts.reduce((acc, cur) => acc*cur, 1));
});
