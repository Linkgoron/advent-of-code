const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const maps = data.toString().trim().split(/\r?\n\r?\n/gm).map(x => x.split(/\r?\n/g));

  let score = 0;
  for (const map of maps) {
    const rowScore = getMirrorScoreRow(map);
    score += rowScore;
    if (!rowScore) {
      score += getMirrorScoreCol(map);
    }
  }
  console.log(score);
});

function getMirrorScoreCol(map) {
  for (let col = 0; col < map[0].length - 1; col++) {
    let mistakeCount = 0;
    for (let row = 0; row < map.length; row++) {
      mistakeCount += map[row][col] === map[row][col + 1] ? 0 : 1;
    }
    if (mistakeCount > 1) continue;
    for (let k = 1; (col - k) >= 0 && (col + k + 1) < map[0].length; k++) {
      for (let row = 0; row < map.length; row++) {
        mistakeCount += map[row][col - k] === map[row][col + k + 1] ? 0 : 1;
      }
    }
    if (mistakeCount === 1) {
      return col + 1;
    }
  }
  return 0;
}
function getMirrorScoreRow(map) {
  for (let row = 0; row < map.length - 1; row++) {
    let mistakeCount = 0;
    for (let col = 0; col < map[0].length; col++) {
      mistakeCount += (map[row][col] === map[row + 1][col]) ? 0 : 1;
    }
    if (mistakeCount > 1) continue;
    for (let k = 1; (row - k) >= 0 && (row + k + 1) < map.length; k++) {
      for (let col = 0; col < map[0].length; col++) {
        mistakeCount += (map[row - k][col] === map[row + k + 1][col]) ? 0 : 1;
      }
    }
    if (mistakeCount === 1) {
      return 100 * (1 + row);
    }
  }
  return 0;
}