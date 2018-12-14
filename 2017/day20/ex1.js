const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const key = (x, y, z) => `${x},${y},${z}`;
    const parseRegexp = new RegExp("<[^>]+>", "gi")
    const data = rawData.toString().split('\r\n')
        .map(row => row.match(parseRegexp).map(x => x.substring(1, x.length - 1)).map(x => x.split(',').map(x => parseInt(x))))
        .map(([p, v, a], i) => ({
            point: p,
            velocity: v,
            acceleration: a,
            orig: [...p],
            name: i
        }));
    const distance = ([x, y, z]) => Math.abs(x) + Math.abs(y) + Math.abs(z);
    const accels = data.map(x => ({ item: x, totalAcceleration: distance(x.acceleration) }));
    const minAcceleration = Math.min(...accels.map(x => x.totalAcceleration));
    console.log(accels.filter(x => x.totalAcceleration === minAcceleration)[0].item.name);

    // for (const d of data) {
    //     console.log(d);
    //     console.log(d.name, 'distance', distance(d.point));
    //     d.point = increase(d.point, d.velocity);
    //     d.acceleration = increase(d.velocity, d.acceleration);        
    // }

});