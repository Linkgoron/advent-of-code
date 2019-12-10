require('fs').readFile('./ex1.input', (err, data) => {
    const comets = data.toString().split('\n').map((row, y) => row.split('').map((point, x) =>
        ({
            text: point,
            x, y
        })
    )).flat().filter(x => x.text === '#');
    const visibility = comets.map(comet => ({
        comet,
        sees: new Set(comets.map(point => buildLine(comet.x, comet.y, point.x, point.y))).size - 1
    }));
    const items = [...visibility].sort((a, b) => b.sees - a.sees)[0];
    console.log(items.comet, items.sees);
});

function buildLine(x0, y0, x, y) {
    const m = (y0 - y) / (x0 - x);
    const direction = x0 === x ? ((y0 < y) ? 'after' : 'before') : x0 < x ? 'after' : 'before';
    return `${m},${direction}`;
}