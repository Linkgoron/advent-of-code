const fs = require('fs');
const dirs = { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] }
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const commands = data.toString().trim().split(/\r?\n/gm).map(x => {
    const [dir, steps] = x.trim().split(' ');
    return {
      dir,
      steps: Number(steps),
    }
  });

  const pool = new Map([[`0, 0`, { x: 0, y: 0 }]]);
  let position = { x: 0, y: 0 }
  for (const command of commands) {
    const [xDir, yDir] = dirs[command.dir];
    for (let i = 0; i < command.steps; i++) {
      position = {
        x: position.x + xDir,
        y: position.y + yDir,
      }
      pool.set(`${position.x}, ${position.y}`, { x: position.x, y: position.y });
    }
  }
  const maxRow = [...pool.values()].reduce((a, b) => a.y > b.y ? a : b, { x: 0, y: 0 }).y;
  const maxCol = [...pool.values()].reduce((a, b) => a.x > b.x ? a : b, { x: 0, y: 0 }).x;
  const minRow = [...pool.values()].reduce((a, b) => a.y < b.y ? a : b, { x: 0, y: 0 }).y;
  const minCol = [...pool.values()].reduce((a, b) => a.x < b.x ? a : b, { x: 0, y: 0 }).x;
  let goodPoint;
  for (let y = minRow; y <= maxRow && !goodPoint; y++) {
    for (let x = minCol; x <= maxCol && !goodPoint; x++) {
      const isWall = pool.has(`${x}, ${y}`);
      if (!goodPoint && !isWall) {
        if (pool.has(`${x - 1}, ${y}`) && pool.has(`${x}, ${y - 1}`)) {
          goodPoint = { x, y };
        }
      }
    }
  }

  let toVisit = new Set([`${goodPoint.x}, ${goodPoint.y}`]);
  for (const point of toVisit) {
    if (pool.has(point)) { continue; }
    const [pointX, pointY] = point.split(', ').map(Number);
    pool.set(point);
    for (const curDir of ['U', 'D', 'L', 'R']) {
      const [xDir, yDir] = dirs[curDir];
      const nextX = pointX + xDir;
      const nextY = pointY + yDir;
      toVisit.add(`${nextX}, ${nextY}`);
    }
  }

  console.log(pool.size);
});