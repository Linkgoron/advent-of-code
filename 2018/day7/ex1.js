const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var info = data.toString().split('\n')
        .map(info => ({ from: info[5], to: info[36] }));

    const flattened = info.map(x => [x.from, x.to]).reduce((acc, item) => acc.concat(item), []);
    const nodes = new Set(flattened);
    const dag = new Map();
    for (const name of nodes) {
        dag.set(name,
            {
                name,
                before: new Set(),
                after: new Set()
            });
    }

    for (const { to, from } of info) {
        dag.get(to).before.add(from);
        dag.get(from).after.add(to);
    }
    const order = [];
    while (dag.size > 0) {
        const values = [...dag.values()];

        const currentPosibs = values.filter(x => x.before.size === 0).sort((x, y) => x.name.charCodeAt(0) - y.name.charCodeAt(0));
        if (currentPosibs.length > 1) console.log('posibs', currentPosibs);
        const current = currentPosibs[0];
        console.log(current);        
        order.push(current.name);
        for (const after of current.after) {
            dag.get(after).before.delete(current.name);
        }
        dag.delete(current.name);
    }
    console.log(order.join(''));
});
