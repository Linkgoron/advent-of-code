const fs = require('fs');
const dirs = {
  '.': [[1, 0], [-1, 0], [0, -1], [0, 1]],
  '>': [[1, 0]],
  'v': [[0, 1]],
};
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const map = data.toString().trim().split(/\r?\n/gm).map(x => x.trim());
  const paths = new Set([{ path: new Set([`1, 0`]), next: `1, 0` }]);
  let max = 0;
  for (const fullPath of paths) {
    paths.delete(fullPath);
    const { path, next: position } = fullPath;
    const [x, y] = position.split(', ').map(Number);
    if (y === map.length - 1 && x == map[0].length - 2) {
      const size = fullPath.path.size - 1;
      if (size > max) {
        max = size;
      }
      continue;
    }
    const char = map[y][x];
    for (const [addX, addY] of dirs[char]) {
      const nextX = x + addX;
      const nextY = y + addY;
      const nextRow = map[nextY];
      if (!nextRow) continue;
      const nextChar = nextRow[nextX];
      if (!nextChar || nextChar === '#') continue;
      if (nextChar === 'v' && addY === -1) continue;
      if (nextChar === '>' && addX === -1) continue;
      if (path.has(`${nextX}, ${nextY}`)) continue;
      paths.add({
        path: new Set([...path, `${nextX}, ${nextY}`]),
        next: `${nextX}, ${nextY}`,
      })
    }
  }
  console.log(max);
});