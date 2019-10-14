const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    let points = rawData.toString().split('\r\n').map(x => x.trim()).map(x => x.split(",")).map(x => ({
        a: parseInt(x[0]),
        b: parseInt(x[1]),
        c: parseInt(x[2]),
        d: parseInt(x[3]),
        edges: []
    }));

    function distance(p1, p2) {
        return Math.abs(p1.a - p2.a) + Math.abs(p1.b - p2.b) + Math.abs(p1.c - p2.c) + Math.abs(p1.d - p2.d);
    }

    function markComponent(point, num) {
        const toVisit = new Set([point]);
        const visited = new Set();
        for (const node of toVisit) {
            node.component = num;
            visited.add(node);
            for (const edge of node.edges) {
                if (!visited.has(edge)) {
                    toVisit.add(edge);
                }
            }
        }

        return visited;
    }

    points.map(point => {
        for (const otherPoint of points) {
            if (point === otherPoint) continue;
            if (distance(point, otherPoint) <= 3) {
                point.edges.push(otherPoint);
            }
        }
    });

    const toConnect = new Set(points);
    let connectedComponentNumber = 0;
    // can iterate and remove from set
    for (const point of toConnect) {
        connectedComponentNumber++;
        const component = markComponent(point,connectedComponentNumber);
        for(const componentElement of component) {
            toConnect.delete(componentElement);
        }
    }

    console.log(connectedComponentNumber);

});