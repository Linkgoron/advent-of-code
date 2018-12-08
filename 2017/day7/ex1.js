const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var nodeList = data.toString().split('\n')
        .map(info => info.trim()).map(info => {
            const data = info.split('->');
            const [name, weight] = data[0].split(' ');
            const holding =
                data.length > 1 ? data[1].split(',').map(x => x.trim())
                    : [];
            return {
                name: name.trim(),
                after: holding,
                weight: parseInt(weight.substring(1)),
                before: undefined
            };
        });
    const dag = new Map();
    for (const node of nodeList) {
        dag.set(node.name, node);
    }

    for (const node of nodeList) {
        for (const after of node.after) {            
            dag.get(after).before = node;
        }
    }

    console.log(nodeList.filter(x => x.before === undefined)[0].name);
});
