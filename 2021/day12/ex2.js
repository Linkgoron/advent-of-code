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
    const paths = new Set([{ current: vertices.get('start'), visitedSmall: {} }]);
    const fullPaths = new Set();
    for (const path of paths) {
        for (const neighbour of path.current.edges) {
            if (neighbour.isSmall && path.visitedSmall[neighbour.name] === 1 && path.hasDouble) {
                continue;
            }
            if (neighbour.isSmall && path.visitedSmall[neighbour.name] === 2) {
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
    const visitedSmall = { ...path.visitedSmall };
    if (neighbour.isSmall) {
        visitedSmall[neighbour.name] = (visitedSmall[neighbour.name] || 0) + 1;
    }
    return {
        current: neighbour,
        visitedSmall,
        hasDouble: path.hasDouble || (visitedSmall[neighbour.name] === 2),
    }
}