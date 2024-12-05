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

  const brickSet = new Set(initBricks);
  const space = new Map();
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
  const supporting = new Map();
  const supported = new Map();
  for (const brick of brickSet) {
    supporting.set(brick, new Set());
    supported.set(brick, new Set());
  }
  for (const brick of brickSet) {
    forAllBrickPoints(brick, (x, y, z) => {
      const above = space.get(key(x, y, brick.zEnd + 1));
      if (above) {
        supporting.get(brick).add(above);
        supported.get(above).add(brick);
      }
    });
  }

  let canDisintegrate = 0;
  for (const brick of brickSet) {
    const brickSupporting = supporting.get(brick);
    let canDie = true;
    for (const supportedBrick of brickSupporting) {
      canDie = canDie && (supported.get(supportedBrick).size > 1)
    }
    canDisintegrate += (canDie ? 1 : 0)
  }
  console.log(canDisintegrate);
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

function createLowerBrick(brick) {
  return {
    xStart: brick.xStart,
    xEnd: brick.xEnd,
    yStart: brick.yStart,
    yEnd: brick.yEnd,
    zStart: brick.zStart - 1,
    zEnd: brick.zEnd - 1,
  }
}