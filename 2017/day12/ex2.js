const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const nodes = data.toString()
        .split('\n')
        .map(x => x.split("<-> ")[1])
        .map((x, i) => ({
            name: parseInt(i),
            neighbours: x.split(',').map(x => parseInt(x.trim()))
        }));

    const dag = new Map();
    for (const node of nodes) {
        dag.set(node.name,
            {
                name: node.name,
                neighbourNumbers: node.neighbours,
                neighbours: []
            });
    }

    for (const node of nodes) {
        const prevItem = dag.get(node.name)
        if (prevItem.neighbourNumbers.length > 0) {
            prevItem.neighbours = prevItem.neighbourNumbers.map(n => dag.get(n));
        }
    }

    let groups = 0;
    const unVisited = new Set(dag.keys());
    while (unVisited.size > 0) {
        const { value } = unVisited.keys().next();        
        groups++;
        const root = dag.get(value);
        const visited = new Set()
        let tovisit = [...root.neighbours];
        while (tovisit.length > 0) {
            const current = tovisit.pop();
            visited.add(current.name);
            unVisited.delete(current.name);
            tovisit = tovisit.concat(current.neighbours.filter(x => !visited.has(x.name)))
        }
    }
    console.log(groups);
});
