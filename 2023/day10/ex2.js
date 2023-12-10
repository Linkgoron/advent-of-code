const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const rows = data.toString().trim().split('\n');
  const nodeMap = new Map()
  for (let rowInd = 0; rowInd < rows.length; rowInd++) {
    const row = rows[rowInd];
    for (let colInd = 0; colInd < row.length; colInd++) {
      const letter = rows[rowInd][colInd];
      if (letter === '.') {
        continue;
      }
      const key = `${rowInd}, ${colInd}`;
      nodeMap.set(key, { coordinates: key, letter, neighbors: computeNeighbors(letter, rowInd, colInd), rowInd, colInd })
    }
  }

  const sPoint = [...nodeMap.values()].find(x => x.letter === 'S');
  const options = [`${sPoint.rowInd + 1}, ${sPoint.colInd}`, `${sPoint.rowInd - 1}, ${sPoint.colInd}`, `${sPoint.rowInd}, ${sPoint.colInd + 1}`, `${sPoint.rowInd}, ${sPoint.colInd - 1}`];
  const good = options.filter(x => nodeMap.get(x)?.neighbors?.has(sPoint.coordinates));
  if (good.length !== 2) {
    throw new Error('cant solve');
  }

  const pipes = new Set([sPoint, ...good.map(id => nodeMap.get(id))]);
  for (const toVisit of pipes) {
    if (toVisit === sPoint) continue;
    for (const neighbor of toVisit.neighbors) {
      pipes.add(nodeMap.get(neighbor));
    }
  }

  for (const [key, value] of nodeMap) {
    if (!pipes.has(value)) {
      nodeMap.delete(key);
    }
  }


  const pumpedNodeMap = new Map();
  for (let rowInd = 0; rowInd < rows.length; rowInd++) {
    for (let colInd = 0; colInd < rows[0].length; colInd++) {
      const pipeItem = nodeMap.get(`${rowInd}, ${colInd}`);
      if (!pipeItem) continue;
      const newRowInd = rowInd * 2;
      const newColInd = colInd * 2;
      const newKey = `${newRowInd}, ${newColInd}`;
      pumpedNodeMap.set(newKey, { letter: pipeItem.letter, coordinates: newKey });
      const toAdd = computePumpedNeighbors(pipeItem.letter, rowInd, colInd);
      for (const extra of toAdd) {
        pumpedNodeMap.set(extra, { letter: 'x', coordinates: extra })
      }
    }
  }

  const outsideSet = new Set();
  const insideSet = new Set();
  const pumpedPipesCoordinates = new Set([...pumpedNodeMap.values()].map(x => x.coordinates));
  const pumpedRows = 2 * rows.length;
  const pumpedCols = 2 * rows[0].length;
  for (let rowInd = 0; rowInd < pumpedRows; rowInd++) {
    for (let colInd = 0; colInd < pumpedCols; colInd++) {
      const key = `${rowInd}, ${colInd}`;
      if (pumpedNodeMap.has(key) || insideSet.has(key) || outsideSet.has(key)) {
        continue;
      }
      const res = markInside(rowInd, colInd, pumpedPipesCoordinates, pumpedRows, pumpedCols);
      if (res.isInside) {
        for (const visited of res.marked) {
          insideSet.add(visited);
        }
      } else {
        for (const visited of res.marked) {
          outsideSet.add(visited);
        }
      }
    }
  }

  let count = 0;
  for (let rowInd = 0; rowInd < rows.length; rowInd++) {
    for (let colInd = 0; colInd < rows[0].length; colInd++) {
      const pipeItem = nodeMap.get(`${rowInd}, ${colInd}`);
      if (pipeItem) continue;
      if (insideSet.has(`${rowInd * 2}, ${colInd * 2}`)) {
        count++;
      }
    }
  }
  console.log(count);
});

function markInside(rowIndex, colIndex, pipes, maxRowIndex, maxColIndex) {
  const toVisitSet = new Set([`${rowIndex}, ${colIndex}`]);
  let isInside = true;
  for (const toVisit of toVisitSet) {
    const [row, col] = toVisit.split(', ').map(Number);
    const options = [[row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]];
    for (const [nextRow, nextCol] of options) {
      if (pipes.has(`${nextRow}, ${nextCol}`)) {
        continue;
      }
      if (row < 0 || row >= maxRowIndex || col < 0 || col >= maxColIndex) {
        isInside = false;
        continue;
      }
      toVisitSet.add(`${nextRow}, ${nextCol}`);
    }
  }

  return { isInside, marked: toVisitSet };
}

function computeNeighbors(letter, row, col) {
  switch (letter) {
    case '|': {
      return new Set([`${row - 1}, ${col}`, `${row + 1}, ${col}`])
    }
    case '-': {
      return new Set([`${row}, ${col - 1}`, `${row}, ${col + 1}`])
    }
    case 'L': {
      return new Set([`${row - 1}, ${col}`, `${row}, ${col + 1}`])
    }
    case 'J': {
      return new Set([`${row - 1}, ${col}`, `${row}, ${col - 1}`])
    }
    case '7': {
      return new Set([`${row + 1}, ${col}`, `${row}, ${col - 1}`])
    }
    case 'F': {
      return new Set([`${row + 1}, ${col}`, `${row}, ${col + 1}`])
    }
    case 'S': {
      return new Set([`${row + 1}, ${col}`, `${row}, ${col + 1}`, `${row - 1}, ${col}`, `${row}, ${col - 1}`])
    }
  }
}

function computePumpedNeighbors(letter, row, col) {
  switch (letter) {
    case '|': {
      return new Set([`${(2 * row) - 1}, ${2 * col}`, `${(2 * row) + 1}, ${2 * col}`])
    }
    case '-': {
      return new Set([`${2 * row}, ${(2 * col) - 1}`, `${2 * row}, ${(2 * col) + 1}`])
    }
    case 'L': {
      return new Set([`${(2 * row) - 1}, ${2 * col}`, `${2 * row}, ${(2 * col) + 1}`])
    }
    case 'J': {
      return new Set([`${(2 * row) - 1}, ${2 * col}`, `${2 * row}, ${(2 * col) - 1}`])
    }
    case '7': {
      return new Set([`${(2 * row) + 1}, ${2 * col}`, `${2 * row}, ${(2 * col) - 1}`])
    }
    case 'F': {
      return new Set([`${(2 * row) + 1}, ${2 * col}`, `${2 * row}, ${(2 * col) + 1}`])
    }
    case 'S': {
      return new Set()
    }
  }
}