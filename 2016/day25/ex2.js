const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allPoints = data.toString().split('\r\n').map((row, y) => row.split('')
        .map((p, x) => p === '#' ? undefined : { x, y, type: p, isNumber: p !== '.' })).flat()
        .filter(Boolean);
    const graph = new Map(allPoints.map(point => [`${point.x},${point.y}`, point]));
    const miniGraph = new Map(allPoints.filter(x => x.isNumber).map(x => ({
        edges: findPoints(x),
        name: x.type
    })).map(x => [x.name, x]));
    const paths = perm(['1', '2', '3', '4', '5', '6', '7']);
    const startingPoint = [...miniGraph.values()].filter(x => x.name === '0')[0];
    const distances = paths.map(path => {
        let currentPoint = startingPoint;
        let length = 0;
        for (const point of path) {
            length += currentPoint.edges.get(point);
            currentPoint = miniGraph.get(point);
        }
        length += currentPoint.edges.get('0');
        return length;
    });

    const min = distances.reduce((acc, cur) => cur < acc ? cur : acc, distances[0]);
    console.log(min);
    function findPoints(source) {
        const visited = new Set([`${source.x},${source.y}`]);
        const toVisit = new Set([{ point: source, step: 0 }]);
        const result = new Map();
        for (const visiting of toVisit) {
            const { step, point: { x, y, isNumber, type } } = visiting;
            if (isNumber && step > 0) {
                result.set(type, step);
                if (result.size === 7) break;
            }
            for (const [dirX, dirY] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const nextX = x + dirX;
                const nextY = y + dirY;
                const index = `${nextX},${nextY}`;
                if (graph.has(index) && !visited.has(index)) {
                    toVisit.add({ point: graph.get(index), step: step + 1 });
                    visited.add(index)
                }
            }
            toVisit.delete(visiting);
        }
        return result;
    }
});

function perm(xs) {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}