const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const board = data.toString().trim().split(/\r?\n/gm);
  const map = new Map();
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === '.') continue;
      map.set(`${j}, ${i}`, board[i][j]);
    }
  }

  let curMap = map;
  const seenSet = new Map();
  let curCycle = 0
  for (curCycle = 0; !seenSet.has(computeHash(curMap)); curCycle++) {
    seenSet.set(computeHash(curMap), { cycles: curCycle });
    const first = pushInDir(curMap, 'north', { x: board[0].length, y: board.length });
    const second = pushInDir(first, 'west', { x: board[0].length, y: board.length });
    const third = pushInDir(second, 'south', { x: board[0].length, y: board.length });
    curMap = pushInDir(third, 'east', { x: board[0].length, y: board.length });
  }
  const seenItem = seenSet.get(computeHash(curMap));
  const cycleSize = curCycle - seenItem.cycles;
  const total = 1000000000;
  for (let todo = total - ((total - curCycle) % cycleSize); todo < total ; todo++) {
    seenSet.set(computeHash(curMap), { cycles: curCycle });
    const first = pushInDir(curMap, 'north', { x: board[0].length, y: board.length });
    const second = pushInDir(first, 'west', { x: board[0].length, y: board.length });
    const third = pushInDir(second, 'south', { x: board[0].length, y: board.length });
    curMap = pushInDir(third, 'east', { x: board[0].length, y: board.length });
  }
  console.log(load(curMap, board.length));
});

function pushInDir(map, direction, bounds) {
  const nextMap = new Map();
  const rocks = [];
  for (const [key, type] of map) {
    if (type === '#') {
      nextMap.set(key, '#');
    } else {
      const [x, y] = key.split(',').map(Number);
      rocks.push({ x, y });
    }
  }

  const opts = {
    'north': { sortBy: 'y', sortDir: -1 },
    'south': { sortBy: 'y', sortDir: 1 },
    'east': { sortBy: 'x', sortDir: 1 },
    'west': { sortBy: 'x', sortDir: -1 }
  }

  const { sortBy, sortDir } = opts[direction];
  const otherDir = sortBy === 'x' ? 'y' : 'x';
  for (const rock of rocks.sort((a, b) => sortDir * (b[sortBy] - a[sortBy]))) {
    for (let next = rock[sortBy] + sortDir; next >= 0 && next < bounds[sortBy]; next += sortDir) {
      const key = sortBy === 'x' ? `${next}, ${rock[otherDir]}` : `${rock[otherDir]}, ${next}`;
      if (nextMap.has(key)) {
        break;
      }

      rock[sortBy] = next;
    }
    nextMap.set(`${rock.x}, ${rock.y}`, 'O');
  };
  return nextMap;
}

function load(map, maxY) {
  let count = 0;
  for (const [key, value] of map) {
    if (value === '#') continue;
    const [x, y] = key.split(', ').map(Number);;
    count += maxY - y;
  }
  return count;
}

function printMap(map, maxX, maxY) {
  let state = '';
  for (let y = 0; y < maxY; y++) {
    let row = '';
    for (let x = 0; x < maxX; x++) {
      const key = `${x}, ${y}`;
      if (map.has(key)) {
        row += map.get(key);
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
}

function computeHash(map) {
  return [...map].map(([key, value]) => `${key}|${value}`).join('$');
}