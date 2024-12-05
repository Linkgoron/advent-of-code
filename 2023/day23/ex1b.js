const fs = require('fs');
const dirs = {
  '.': [[1, 0], [-1, 0], [0, -1], [0, 1]],
  '>': [[1, 0]],
  'v': [[0, 1]],
};

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const map = data.toString().trim().split(/\r?\n/gm).map(x => x.trim());
  const vertices = new Map([[`1, 0`, { x: 1, y: 0, edges: new Map() }]])
  for (const [key, vertex] of vertices) {
    const paths = new Set(dirs['.'].map(([addX, addY]) => {
      const nextX = vertex.x + addX;
      const nextY = vertex.y + addY;
      const nextRow = map[nextY];
      if (!nextRow) { return undefined };
      const nextChar = nextRow[nextX];
      if (!nextChar || nextChar === '#') { return undefined };
      if (nextChar === 'v' && addY === -1) { return undefined };
      if (nextChar === '>' && addX === -1) { return undefined };
      return { x: nextX, y: nextY };
    }).filter(Boolean).map(point => {
      return {
        path: new Set([getKey(vertex), getKey(point)]),
        next: getKey(point),
      }
    }));
    const targets = new Map();
    for (const fullPath of paths) {
      const { path, next: position } = fullPath;
      const [x, y] = position.split(', ').map(Number);
      let options = [];
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
        if (path.has(getKey(nextX, nextY))) continue;
        options.push(getKey(nextX, nextY));
      }
      if (options.length === 1) {
        paths.add({
          path: new Set([...path, options[0]]),
          next: options[0],
        });
        continue;
      }
      if (options.length === 0 && y !== map.length - 1 && x !== map[0].length - 2) continue;
      if (!targets.has(getKey(x, y))) {
        targets.set(getKey(x, y), 0);
      }
      const currentTargetMax = targets.get(getKey(x, y));
      const distance = fullPath.path.size - 1;
      if (currentTargetMax < distance) {
        targets.set(getKey(x, y), distance);
      }
    }
    for (const [targetKey, targetDist] of targets) {
      if (!vertices.has(targetKey)) {
        const [x, y] = targetKey.split(', ').map(Number);
        const newVertex = { x, y, edges: new Map() };
        vertices.set(targetKey, newVertex);
      }
      vertex.edges.set(targetKey, targetDist);
    }
  }

  const paths = new Set([{ path: new Set([`1, 0`]), next: `1, 0`, len: 0 }]);
  let max = 0;
  for (const fullPath of paths) {
    paths.delete(fullPath);
    const { path, next: position } = fullPath;
    const [x, y] = position.split(', ').map(Number);
    if (y === map.length - 1 && x == map[0].length - 2) {
      if (fullPath.len > max) {
        max = fullPath.len;
      }
      continue;
    }
    const nextStop = vertices.get(position);
    for (const [vertexKey, len] of nextStop.edges) {
      if (path.has(vertexKey)) {
        continue;
      }
      paths.add({
        path: new Set([...path, vertexKey]),
        next: vertexKey,
        len: fullPath.len + len
      });
    }
  }
  console.log(max);
});

function getKey(x,y) {
  if (typeof x === 'object') {
    return `${x.x}, ${x.y}`;
  }
  return `${x}, ${y}`;
}