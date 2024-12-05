const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const board = data.toString().trim().split(/\r?\n/gm).map(x => x.split(''));
  let width = board[0].length;
  let height = board.length;
  let energized = new Set();
  const alreadyHad = new Set();
  const existingBeams = new Set([{ x: 0, y: 0, dir: 'right' }]);
  for (const currentBeam of existingBeams) {
    if (alreadyHad.has(`${currentBeam.x},${currentBeam.y},${currentBeam.dir}`)) continue;
    alreadyHad.add(`${currentBeam.x},${currentBeam.y},${currentBeam.dir}`);
    energized.add(`${currentBeam.x}, ${currentBeam.y}`)
    const continueBeam = nextState(currentBeam, board[currentBeam.y][currentBeam.x]);
    const nextOptions = continueBeam.filter(beam => beam.x >= 0 && beam.x < width && beam.y >= 0 && beam.y < height);
    for (const next of nextOptions) {
      existingBeams.add(next);
    }
  }
  console.log(energized.size);
});

const dirs = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
const charNext = {
  '/': {
    'up': ['right'],
    'right': ['up'],
    'left': ['down'],
    'down': ['left'],
  },
  '\\': {
    'up': ['left'],
    'right': ['down'],
    'left': ['up'],
    'down': ['right'],
  },
  '|': {
    'up': ['up'],
    'right': ['up', 'down'],
    'left': ['up', 'down'],
    'down': ['down'],
  },
  '-': {
    'up': ['left', 'right'],
    'right': ['right'],
    'left': ['left'],
    'down': ['left', 'right'],
  },
  '.': {
    'up': ['up'],
    'down': ['down'],
    'left': ['left'],
    'right': ['right'],
  }
}

function nextState({ x, y, dir }, char) {
  const nextDirections = charNext[char][dir];
  return nextDirections.map(nextDir => {
    const nextMove = dirs[nextDir];
    return {
      dir: nextDir,
      x: x + nextMove[0],
      y: y + nextMove[1],
    }
  });
}