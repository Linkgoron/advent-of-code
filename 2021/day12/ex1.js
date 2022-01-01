const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    let lines = data.toString().trim().split('\n').map(x => x.trim().split('-'));

    const vertices = new Map([...new Set(lines.flat())].map(x => ([x, {
        name: x,
        isSmall: x[0] === x[0].toLowerCase(),
        edges: new Set(),
    }])));

    for (const [start, end] of lines) {
        vertices.get(start).edges.add(vertices.get(end));
        if (end !== 'end') {
            vertices.get(end).edges.add(vertices.get(start));
        }
    }

    const paths = travel(vertices);
    console.log(paths.size);
});

function travel(vertices) {
    const paths = new Set([{ current: vertices.get('start'), path: new Set([vertices.get('start')]) }]);
    const fullPaths = new Set();
    for (const path of paths) {
        for (let neighbour of path.current.edges) {
            if (neighbour.isSmall && path.path.has(neighbour)) {
                continue;
            }
            if (neighbour.name === 'start') {
                continue;
            }
            if (neighbour.name === 'end') {
                fullPaths.add(path);
                continue;
            }

            const newPath = navigate(path, neighbour);
            paths.add(newPath);
        }
    }

    return fullPaths;
}

function navigate(path, neighbour) {
    const cloneSet =  new Set(path.path);
    cloneSet.add(neighbour);
    return {
        current: neighbour,
        path: cloneSet,
    }
}