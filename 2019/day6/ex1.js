require('fs').readFile('./ex1.input', (err, data) => {
    const info = data.toString().split('\n').map(x => x.trim().split(')')).map(x => ({
        name: x[1],
        around: x[0]
    }));
    const neighbours = new Map();
    for (const { name, around } of info) {
        if (!neighbours.has(around)) {
            neighbours.set(around, new Set());
        }
        neighbours.get(around).add(name);
    }
    const worlds = new Set([{ name: 'COM', prev: [], parent: null }]);
    const instances = new Set();
    for (const { name, prev, parent } of worlds) {
        const orbiting = neighbours.get(name);
        if (orbiting) {
            for (const orbiter of orbiting) {
                worlds.add({ name: orbiter, prev: [...prev, name], parent: name });
            }
        }
        instances.add({ name, prev, parent, dist: prev.length });
    }

    const stuff = [...instances].map(x => x.dist).reduce((a, b) => b + a, 0);
    console.log(stuff);
});