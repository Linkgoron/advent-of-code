const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => x.trim());
    const graph = new Map();
    rows.map(row => {
        const words = row.split(' ');
        const distance = parseInt(words[4]);
        const source = graph.get(words[0]) || { edges: new Map(), name: words[0] }
        const target = graph.get(words[2]) || { edges: new Map(), name: words[2] }
        source.edges.set(target.name, distance);
        target.edges.set(source.name, distance);
        if (!graph.get(words[0])) {
            graph.set(words[0], source);
        }
        if (!graph.get(words[2])) {
            graph.set(words[2], target);
        }
    });

    const paths = perm([...graph.keys()]);  
    const distances = paths.map(path => {
        let currentPoint = graph.get(path[0]);
        let length = 0;
        for (const point of path.slice(1)) {
            length += currentPoint.edges.get(point);
            currentPoint = graph.get(point);
        }
        return length;
    });
    const min = distances.reduce((acc, cur) => cur < acc ? cur : acc, distances[0]);
    console.log(min);
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