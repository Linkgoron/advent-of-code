const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split(',').map(Number);
    const daysPerStuff = lines.reduce((agg, x) => {
        agg.set(x, (agg.get(x) || 0) + 1);
        return agg;
    }, new Map());

    let currentState = daysPerStuff;
    for (let i = 0; i < 256; i++) {
        currentState = [...currentState].reduce((agg, [days, count]) => {
            if (days === 0) {
                agg.set(8, count);
                agg.set(6, (agg.get(6) || 0) + count);
            } else {
                agg.set(days - 1, (agg.get(days - 1) || 0) + count);
            }
            return agg;
        }, new Map());
    }
    console.log([...currentState.values()].reduce((agg, cur) => cur + agg, 0));
});