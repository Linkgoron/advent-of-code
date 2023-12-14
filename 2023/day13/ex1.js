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
    let isMatch = true;
    for (let row = 0; isMatch && row < map.length; row++) {
      isMatch = isMatch && map[row][col] === map[row][col + 1];
    }
    if (!isMatch) continue;
    for (let k = 1; isMatch && (col - k) >= 0 && (col + k + 1) < map[0].length; k++) {
      for (let row = 0; isMatch && row < map.length; row++) {
        isMatch = isMatch && map[row][col - k] === map[row][col + k + 1];
      }
    }
    if (isMatch) {
      return col + 1;
    }
  }
  return 0;
}
function getMirrorScoreRow(map) {
  for (let row = 0; row < map.length - 1; row++) {
    let isMatch = true;
    for (let col = 0; isMatch && col < map[0].length; col++) {
      isMatch = isMatch && map[row][col] === map[row + 1][col];
    }
    if (!isMatch) continue;
    for (let k = 1; isMatch && (row - k) >= 0 && (row + k + 1) < map.length; k++) {
      for (let col = 0; isMatch && col < map[0].length; col++) {
        isMatch = isMatch && map[row - k][col] === map[row + k + 1][col];
      }
    }
    if (isMatch) {
      return 100 * (1 + row);
    }
  }
  return 0;
}