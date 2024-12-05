const fs = require('fs');
const dirs = { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] }
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const initBricks = data.toString().trim().split(/\r?\n/gm).map((row, i) => {
    const [start, end] = row.split('~');
    const [x1, y1, z1] = start.split(',').map(Number);
    const [x2, y2, z2] = end.split(',').map(Number);
    return {
      xStart: Math.min(x1, x2),
      xEnd: Math.max(x1, x2),
      yStart: Math.min(y1, y2),
      yEnd: Math.max(y1, y2),
      zStart: Math.min(z1, z2),
      zEnd: Math.max(z1, z2),
    }
  });

  const fallenSet = resetBricks(fallDown(initBricks));
  let totalMoved = 0;
  for (const brick of fallenSet) {
    const copy = new Set(fallenSet);
    copy.delete(brick);
    const fd = fallDown(copy);
    const moved = [...fd].filter(x => x.moved).length;
    totalMoved += moved;
  }
  console.log(totalMoved);
});

function forAllBrickPoints(brick, func) {
  for (let x = brick.xStart; x <= brick.xEnd; x++) {
    for (let y = brick.yStart; y <= brick.yEnd; y++) {
      for (let z = brick.zStart; z <= brick.zEnd; z++) {
        func(x, y, z);
      }
    }
  }
}

function key(x, y, z) {
  return `${x},${y},${z}`;
}

function fallDown(bricks) {
  const space = new Map();
  const brickSet = new Set(bricks);
  for (const brick of brickSet) {
    forAllBrickPoints(brick, (x, y, z) => {
      space.set(key(x, y, z), brick);
    });
  }

  let moved = true;
  while (moved) {
    moved = false;
    for (const brick of brickSet) {
      if (brick.zStart === 1) continue;
      let canFall = true;
      forAllBrickPoints(brick, (x, y, z) => {
        canFall = canFall && !space.has(key(x, y, brick.zStart - 1));
      });
      if (canFall) {
        moved = true;
        brickSet.delete(brick);
        forAllBrickPoints(brick, (x, y, z) => {
          space.delete(key(x, y, z));
        });
        const newBrick = createLowerBrick(brick);
        brickSet.add(newBrick);
        forAllBrickPoints(newBrick, (x, y, z) => {
          space.set(key(x, y, z), newBrick);
        });
      }
    }
  }
  return brickSet;
}

function resetBricks(brickSet) {
  let nextBrickSet = new Set();
  for (const brick of brickSet) {
    nextBrickSet.add({ ...brick, moved: false });
  }
  return nextBrickSet;
}

function createLowerBrick(brick) {
  return {
    xStart: brick.xStart,
    xEnd: brick.xEnd,
    yStart: brick.yStart,
    yEnd: brick.yEnd,
    zStart: brick.zStart - 1,
    zEnd: brick.zEnd - 1,
    moved: true,
  }
}