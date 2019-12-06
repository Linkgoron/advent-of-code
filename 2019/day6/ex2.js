require('fs').readFile('./ex2.input', (err, data) => {
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
    const instances = new Map();
    for (const { name, prev, parent } of worlds) {
        const orbiting = neighbours.get(name);
        if (orbiting) {
            for (const orbiter of orbiting) {
                worlds.add({ name: orbiter, prev: [...prev, name], parent: name });
            }
        }
        instances.set(name, { name, prev, parent, dist: prev.length });
    }

    const me = instances.get('YOU');
    const santa = instances.get('SAN');

    const gcdPos = me.prev.findIndex((x, i) => santa.prev[i + 1] !== me.prev[i + 1]);
    const meDist = me.prev.length - gcdPos;
    const sanDist = santa.prev.length - gcdPos;
    const solution = meDist + sanDist - 2;
    console.log(solution);
});