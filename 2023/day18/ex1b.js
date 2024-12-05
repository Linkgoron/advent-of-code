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

  let position = { x: 0, y: 0 };
  const ranges = [];
  for (const command of commands) {
    const [xDir, yDir] = dirs[command.dir];
    let range = {
      xStart: position.x,
      yStart: position.y,
      xEnd: position.x + xDir * command.steps,
      yEnd: position.y + yDir * command.steps,
      len: command.steps + 1,
      dir: command.dir,
    }
    ranges.push(range);
    position = {
      x: position.x + xDir * command.steps,
      y: position.y + yDir * command.steps
    }
  }  
  
  const minCol = ranges.reduce((acc, cur) => Math.min(cur.xStart, cur.xEnd, acc), 0);
  const leftMost = ranges.find(x => x.xStart === minCol && (x.dir === 'U' || x.dir === 'D'));
  let matchingDir = leftMost.dir === 'U' ? 'D' : 'U';
  let interior = 0;
  let wallSize = ranges.reduce((acc, cur) => {
    if (cur.dir === matchingDir || cur.dir === leftMost.dir) {
      return acc + cur.len;
    }
    return acc + cur.len - 2;
  }, 0);
  
  const rightWalls = ranges.filter(opWall=> opWall.dir === matchingDir);
  const leftWalls = ranges.filter(x => x.dir === leftMost.dir).sort((a,b) => (a.xStart - b.xStart));
  const blockingWalls = ranges.filter(x=>x.dir === 'R' || x.dir === 'L');
  for (const curWall of leftWalls) {
    const topPoint =  Math.min(curWall.yStart, curWall.yEnd);
    const bottomPoint = Math.max(curWall.yStart, curWall.yEnd);
    for (let y = topPoint; y <= bottomPoint; y++) {
      if (y === topPoint || y === bottomPoint) {
        const isBlocked = blockingWalls.find(blocker=> blocker.yEnd === y && ((blocker.dir === 'L' && blocker.xEnd === curWall.xStart) || (blocker.dir === 'R' && blocker.xStart === curWall.xStart)))
        if (isBlocked) {
          continue;
        }
      }
      const matchingWalls = rightWalls.filter(opWall=> opWall.xStart > curWall.xStart && Math.min(opWall.yStart, opWall.yEnd) <= y && Math.max(opWall.yStart, opWall.yEnd) >= y);
      const matchingWall = matchingWalls.reduce((x,y) => x.xStart < y.xStart ? x : y, matchingWalls[0]);
      interior += (matchingWall.xStart - curWall.xStart - 1);
    }
  }
  console.log(interior + wallSize);
});