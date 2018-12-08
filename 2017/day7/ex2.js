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
                before: undefined,
                heldWeight: 0
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

    computeWeight(nodeList.filter(x => x.before === undefined)[0], dag);
    const items = nodeList.filter(node => {
        const weights = node.after.map(x => dag.get(x)).map(subtower => subtower.totalWeight);
        if (new Set(weights).size > 1) {
            return true;
        };
        return false;
    });
    const badPlace = items.filter(x => {
        if (x.after.length === 0) return true;
        const afterItems = x.after.map(x => dag.get(x));
        for (const ai of afterItems) {
            if (items.indexOf(ai) > 0) return false;
        }
        return true;
    })[0];

    const actualAfterItems = badPlace.after.map(x => dag.get(x));
    const aftervalues = actualAfterItems.map(x => x.totalWeight);
    const values = {};
    for (const value of aftervalues) {
        values[value] = (values[value] || 0) + 1;
    }
    const specialBadValue = Object.keys(values).filter(x => values[x] === 1)[0];
    const toAimFor = Object.keys(values).filter(x => values[x] > 1)[0];
    const toFixItem = actualAfterItems.filter(x => x.totalWeight === parseInt(specialBadValue))[0];
    const neededChange = toAimFor - specialBadValue;
    console.log(toFixItem.weight + neededChange);

});

function computeWeight(node, dag) {
    node.heldWeight = 0;
    node.totalWeight = node.weight;
    if (node.after.length === 0) return;
    for (const child of node.after) {
        const actualChild = dag.get(child);
        computeWeight(actualChild, dag);
        node.heldWeight += actualChild.totalWeight;
        node.totalWeight += actualChild.totalWeight;
    }

}
