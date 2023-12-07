const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [time, distance] = data.toString().trim().split('\n').map(x => Number(x.trim().split(': ')[1].trim().replaceAll(' ','')));
    const race = {
        time,
        distance
    };

    let count = 0;
    for (let accel = 0; accel < race.time; accel++) {
        if (accel * (race.time - accel) > race.distance) {
            count++;
        }
    }
    console.log(count);
});
