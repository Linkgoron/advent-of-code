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
  let good = options.filter(x => nodeMap.get(x)?.neighbors?.has(sPoint.coordinates));
  if (good.length !== 2) {
    throw new Error('cant solve');
  }

  const visited = new Set([sPoint, ...good.map(id => nodeMap.get(id))]);
  for (const toVisit of visited) {
    if (toVisit === sPoint) continue;
    for (const neighbor of toVisit.neighbors) {
      visited.add(nodeMap.get(neighbor));
    }
  }
  console.log(visited.size / 2);
});

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