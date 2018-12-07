const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var info = data.toString().split('\n')
        .map(info => ({ from: info[5], to: info[36] }));

    const flattened = info.map(x => [x.from, x.to]).reduce((acc, item) => acc.concat(item), []);
    const nodes = new Set(flattened);
    const dag = new Map();
    const minimalWorkTime = 60;
    for (const name of nodes) {
        dag.set(name,
            {
                name,
                before: new Set(),
                after: new Set(),
                time: minimalWorkTime + name.charCodeAt(0) - 64
            });
    }

    for (const { to, from } of info) {
        dag.get(to).before.add(from);
        dag.get(from).after.add(to);
    }

    let time = 0;
    const workers = 5;
    while (dag.size > 0) {
        const values = [...dag.values()];
        const currentPosibs = values.filter(x => x.before.size === 0).sort((x, y) => x.name.charCodeAt(0) - y.name.charCodeAt(0));
        const minTime = Math.min(...currentPosibs.map(x => x.time));
        for (const workOn of currentPosibs.slice(0, workers)) {
            workOn.time -= minTime;
        }

        time += minTime;

        const done = currentPosibs.filter(x => x.time === 0);
        for (const doneWork of done) {
            for (const after of doneWork.after) {
                dag.get(after).before.delete(doneWork.name);
            }
            dag.delete(doneWork.name);
        }
    }
    console.log(time);
});
