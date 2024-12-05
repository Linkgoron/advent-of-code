const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const stones = data.toString().trim().split(/\r?\n/gm).map(x => x.trim()).map(x => {
    const [init, velocity] = x.split(' @ ');
    const [initX, initY, initZ] = init.split(', ').map(Number);
    const [vecX, vecY, vecZ] = velocity.split(', ').map(Number);
    return {
      initX,
      initY,
      initZ,
      vecX,
      vecY,
      vecZ
    }
  });

  let minX = 200000000000000;
  let minY = 200000000000000;
  let maxX = 400000000000000;
  let maxY = 400000000000000;
  let hits = 0;
  for (let i = 0; i < stones.length; i++) {
    const stone = stones[i];
    for (let j = i + 1; j < stones.length; j++) {
      const stone2 = stones[j];
      const { initX: x_1, initY: y_1, vecX: r_1, vecY: l_1 } = stone;
      const { initX: x_2, initY: y_2, vecX: r_2, vecY: l_2 } = stone2;

      const t_2 = (l_1 * (x_1 - x_2) + r_1 * (y_2 - y_1))/(l_1 * r_2 - l_2 * r_1)
      const t_1 = (l_2 * (x_1 - x_2) + r_2 * (y_2 - y_1))/(l_1 * r_2 - l_2 * r_1)
      if (t_1 < 0 || t_2 < 0) { continue; }
      let hitInX = x_1 + t_1 * r_1;
      let hitInY = y_1 + t_1 * l_1;
      if (hitInX >= minX && hitInX <= maxX && hitInY >= minY && hitInY <= maxY) {
        hits++
      }
    }
  }
  console.log(hits);

});