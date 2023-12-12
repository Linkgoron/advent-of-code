const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const rows = data.toString().trim().split('\n');
  const galaxies = [];
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c] !== '.') {
        galaxies.push({ row: r, col: c });
      }
    }
  }
  const emptyRows = [];
  const emptyCols = [];
  for (let row = 0; row < rows.length; row++) {
    if (rows[row].split('').every(x => x === '.')) {
      emptyRows.push(row)
    }
  }

  for (let col = 0; col < rows[0].length; col++) {
    let seen = false;
    for (let row = 0; row < rows.length; row++) {
      if (rows[row][col] !== '.') {
        seen = true;
        break;
      }
    }
    if (!seen) {
      emptyCols.push(col);
    }
  }

  for (const galaxy of galaxies) {
    const belowExpanding = emptyRows.filter(r => galaxy.row > r).length;
    const rightOfExpanding = emptyCols.filter(c => galaxy.col > c).length;
    galaxy.row += belowExpanding;
    galaxy.col += rightOfExpanding;
  }

  const all = galaxies.map(galaxy => {
    return galaxies.map(g => Math.abs(g.row - galaxy.row) + Math.abs(g.col - galaxy.col)).reduce((a, b) => a + b, 0);
  }).reduce((a, b) => a + b, 0);
  console.log(all / 2);
});

