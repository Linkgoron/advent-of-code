const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const data = rawData.toString().split("\n").map(x => x.trim().split(' ')[1]);
    const depth = parseInt(data[0]);
    const targetIndex = data[1].split(',');
    const target = { x: parseInt(targetIndex[0]), y: parseInt(targetIndex[1]) };
    const memory = {
        erosion: {},
        geological: {}
    }

    // some limit to the graph size.
    const extra = (target.x + target.y) / 2.2;
    const map = new Map();
    for (let i = 0; i <= Math.min(target.x + extra, depth); i++) {
        for (let j = 0; j <= Math.min(target.y + extra, depth); j++) {
            map.set(coordinates(i, j), {
                x: i,
                y: j,
                type: pointType(i, j, target, depth, memory)
            });
        }
    }

    const graph = new Map();
    for (let i = 0; i <= Math.min(target.x + extra, depth); i++) {
        for (let j = 0; j <= Math.min(target.y + extra, depth); j++) {
            const { type } = map.get(coordinates(i, j));
            const curPossibleEquip = typeToOptions(type);
            for (const curEquip of curPossibleEquip) {
                const edges = [{ i: i - 1, j }, { i: i + 1, j }, { i, j: j - 1 }, { i, j: j + 1 }]
                    .map(({ i, j }) => map.get(coordinates(i, j)))
                    .filter(Boolean)
                    .map(node => {
                        const possibleEquipment = typeToOptions(node.type);
                        const { x, y } = node;
                        if (x === target.x && y === target.y) {
                            if (type === 'wet') {
                                return {
                                    weight: curEquip === 'neither' ? (1 + 7) : 1 + 7 + 7,
                                    equipment: 'torch',
                                    x, y,
                                    get name() { return `${coordinates(x, y)},${this.equipment}` }
                                };
                            }

                            if (type === 'rocky') {
                                return {
                                    weight: curEquip === 'torch' ? 1 : 1 + 7,
                                    equipment: 'torch',
                                    x, y,
                                    get name() { return `${coordinates(x, y)},${this.equipment}` }
                                };
                            }
                            if (type === 'narrow') {
                                return {
                                    weight: curEquip === 'torch' ? 1 : 1 + 7,
                                    equipment: 'torch',
                                    x, y,
                                    get name() { return `${coordinates(x, y)},${this.equipment}` }
                                };
                            }
                            throw new Error('bad type');
                        }

                        if (possibleEquipment.some(e => curEquip === e)) {
                            return {
                                weight: 1,
                                equipment: curEquip,
                                x, y,
                                get name() { return `${coordinates(this.x, this.y)},${this.equipment}` }
                            }
                        }

                        return possibleEquipment.filter(posib => curPossibleEquip.some(e => e === posib)).map(equip => ({
                            weight: 1 + 7,
                            equipment: equip,
                            x, y,
                            get name() { return `${coordinates(this.x, this.y)},${this.equipment}` }
                        }));
                    }).flat();

                graph.set(coordinates(i, j) + `,${curEquip}`, {
                    x: i, y: j,
                    edges
                });
            }
        }
    }
    map.clear();
    const toVisit = [{ name: `0,0,torch`, weight: 0 }];
    const closest = () => toVisit.reduce((prev, cur, i) => {
        if (prev === undefined) return { item: cur, i };
        return cur.weight < prev.item.weight ? { item: cur, i } : prev;
    }, undefined);
    const willVisit = (name) => toVisit.findIndex(x => x.name === name);
    const visited = new Set();

    while (toVisit.length > 0) {
        const { item: { name, weight, prev }, i } = closest();
        const graphNode = graph.get(name);
        const { x, y, edges } = graphNode;
        graphNode.prev = prev;
        visited.add(name);
        toVisit.splice(i, 1);

        if (x === target.x && y === target.y) {
            console.log('the path:')
            let path = prev;
            console.log(name);
            console.log(path);
            while (path) {
                const prevNode = graph.get(path)
                console.log(prevNode.prev);
                path = prevNode.prev;
            }
            return
        }

        for (const edge of edges) {
            if (visited.has(edge.name)) {
                continue;
            }

            const currentIndex = willVisit(edge.name);
            if (currentIndex === -1) {
                toVisit.push({ name: edge.name, weight: edge.weight + weight, prev: name });
                continue;
            }

            const newWeight = edge.weight + weight;
            const visitValue = toVisit[currentIndex];
            if (visitValue.weight > newWeight) {
                visitValue.weight = newWeight;
                visitValue.prev = name;
            }
        }
    }

    console.log('done', graph.get());

});

function typeToOptions(type) {
    if (type === 'rocky') {
        return ['climbing', 'torch'];
    }
    if (type === 'wet') {
        return ['climbing', 'neither'];
    }
    if (type === 'narrow') {
        return ['torch', 'neither'];
    }
    throw new Error('bad type 2');
}

function coordinates(i, j) { return `${i},${j}` };

function geologicalIndex(x, y, target, depth, memory) {
    if (x === 0 && y === 0) return 0;
    if (target.x === x && target.y === y) return 0;
    if (y === 0) return x * 16807;
    if (x === 0) return y * 48271;
    const mem = `${x},${y}`;
    if (typeof memory.geological[mem] === 'number') {
        return memory.geological[mem];
    }
    const res = erosionLevel(x - 1, y, target, depth, memory) * erosionLevel(x, y - 1, target, depth, memory);
    memory.geological[mem] = res;
    return res;
}

function erosionLevel(x, y, target, depth, memory) {
    const mem = `${x},${y}`;
    if (typeof memory.erosion[mem] === 'number') {
        return memory.erosion[mem];
    }
    const index = geologicalIndex(x, y, target, depth, memory);
    const res = (depth + index) % 20183;
    memory.erosion[mem] = res;
    return res;
}

function pointType(x, y, target, depth, memory) {
    const erosion = erosionLevel(x, y, target, depth, memory);
    if (erosion % 3 === 0) return 'rocky';
    if (erosion % 3 === 1) return 'wet';
    if (erosion % 3 === 2) return 'narrow';
    throw new Error('bad erosion');
}

function riskLevel(x, y, target, depth, memory) {
    const type = pointType(x, y, target, depth, memory);
    if (type === 'rocky') return 0;
    if (type === 'wet') return 1;
    if (type === 'narrow') return 2;
    throw new Error('bad type 3');
}