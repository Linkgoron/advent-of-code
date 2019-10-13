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

    function totalHits(center, bots) {
        return bots.filter(x => inRange(x, center)).length
    }

    const maxRadius = nanoBots.reduce((prev, bot) => {
        if (prev === undefined) return { cur: bot, num: totalHits(bot, nanoBots) };
        const num = totalHits(bot, nanoBots);
        return num >= prev.num ? { cur: bot, num } : prev;
    }, undefined);

    let { num, cur } = maxRadius;
    console.log(cur, totalHits(cur, nanoBots));
    console.log(num, cur);
    let changed = true;
    while (changed) {
        changed = false;
        const opts = [[-1, -1, -1], [-1, -1, 0], [-1, 0, -1], [-1, 0, 0], [0, -1, -1], [0, -1, 0], [0, 0, -1]];
        for (const [x, y, z] of opts) {
            let tst = { x: cur.x + x, y: cur.y + y, z: cur.z + z };
            if (totalHits(tst, nanoBots) >= num) {
                cur = tst;
                num = totalHits(tst, nanoBots);
                changed = true;
                break;
            }
        }
    }

    console.log(num, cur, Math.abs(cur.x) + Math.abs(cur.y) + Math.abs(cur.z));
});