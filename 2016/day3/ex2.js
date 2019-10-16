const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const reg =  / +/g;
    const rows = data.toString().split('\r\n').map(x => x.trim()).map(x => x.split(reg).map(x => parseInt(x)));
    const possible = rows
        .reduce((agg, cur, i) => {
            agg.one.push(cur[0]);
            agg.two.push(cur[1]);
            agg.three.push(cur[2]);
            if (i % 3 === 2) {
                agg.rows.push([agg.one[0], agg.one[1], agg.one[2]]);
                agg.rows.push([agg.two[0], agg.two[1], agg.two[2]]);
                agg.rows.push([agg.three[0], agg.three[1], agg.three[2]]);
                return { one: [], two: [], three: [], rows: agg.rows };
            }

            return agg;
        }, { one: [], two: [], three: [], rows: [] })
        .rows.filter(x => (x[0] + x[1] > x[2]) && (x[0] + x[2] > x[1]) && (x[1] + x[2] > x[0])).length;
    console.log(possible);
});