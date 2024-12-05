const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const board = data.toString().trim().split(/\r?\n/gm).map(x => x.split(''));
  let width = board[0].length;
  let height = board.length;
  let max = 0;
  for (const x of [0, width - 1]) {
    for (let y = 0; y < height; y++) {
      for (const dir of ['up', 'right', 'left', 'down']) {
        const energized = countEnergized({ x, y, dir }, board);
        if (energized > max) {
          max = energized;
        }
      }
    }
  }
  for (const y of [0, height - 1]) {
    for (let x = 0; x < height; x++) {
      for (const dir of ['up', 'right', 'left', 'down']) {
        const energized = countEnergized({ x, y, dir }, board);
        if (energized > max) {
          max = energized;
        }
      }
    }
  }
  console.log(max);
});

function countEnergized(start, board) {
  let width = board[0].length;
  let height = board.length;
  let energized = new Set();
  const alreadyHad = new Set();
  const existingBeams = new Set([start]);
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
  return energized.size;
}

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