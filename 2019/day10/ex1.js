require('fs').readFile('./ex1.input', async (err, data) => {
    const rows = data.toString().trim().split('\n');
    const comets = rows.map((row, y) => row.split('').map((point, x) =>
        ({
            text: point,
            x, y
        })
    )).flat().filter(x => x.text === '#');
    const neighbours = comets.map(comet => ({
        comet,
        sees: new Set(comets.map(point => buildLine(comet.x, comet.y, point.x, point.y))).size - 1
    }));
    const items = [...neighbours].sort((a, b) => b.sees - a.sees)[0];
    console.log(items.comet, items.sees);
});

function buildLine(x0, y0, x, y) {
    const line = {
        m: (y0 - y) / (x0 - x),
        sourceX: x0,
        sourceY: y0,
        direction: lineDir(x0, y0, x, y)
    }

    return `${line.m},${line.direction}`;
}

function lineDir(x0, y0, x, y) {
    let dirs = [];
    if (x0 > x) dirs.push('left');
    if (x0 < x) dirs.push('right');
    if (y0 > y) dirs.push('down');
    if (y0 < y) dirs.push('up');
    return dirs.join(' ');
}