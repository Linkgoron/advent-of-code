const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");

    const nanoBots = rawData.toString()
        .split('\r\n')
        .map(row => row.split(', '))
        .map(data => {
            const [x, y, z] = data[0].replace("pos=<", "").replace(">", "").split(",").map(x => parseInt(x));
            return {
                x, y, z,
                radius: parseInt(data[1].replace("r=", ""))
            }
        });

    function inRange(center, bot) {
        return Math.abs(center.x - bot.x) + Math.abs(center.y - bot.y) + Math.abs(center.z - bot.z) <= center.radius;
    }

    const maxRadius = nanoBots.reduce((prev, cur) => {
        if (prev === undefined) return cur;
        return cur.radius >= prev.radius ? cur : prev;
    }, undefined)

    const totalInRange = nanoBots.filter(x => inRange(maxRadius, x)).length;
    console.log(maxRadius, totalInRange);
});