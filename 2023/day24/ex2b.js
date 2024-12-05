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
  for (const stone of stones) {
    for (const stone2 of stones) {
      if (stone === stone2) continue;
      if (stone.vecY === stone2.vecY && stone.vecZ === stone2.vecZ) {
        console.log(stone);
        console.log(stone2);
      }
    }
  }
  // stones.
  // let minX = 200000000000000;
  // let minY = 200000000000000;
  // let maxX = 400000000000000;
  // let maxY = 400000000000000;
  // let hits = 0;
  let equations = [];
  // const symbols = ['x', 'y', 'z', 'r', 'l', 'q'];
  // const gts = []
  for (let i = 0; i < 2; i++) {
     const stone = stones[i];  
     const { vecX: r_1, vecY: l_1, vecZ: m_1, initX: x_1, initY: y_1, initZ: z_1, time } = stone;
     equations.push(`x=${x_1}+t_${i}*(${r_1}-r)`.replaceAll('--', '+'));
     equations.push(`y=${y_1}+t_${i}*(${l_1}-l)`.replaceAll('--', '+'));
     equations.push(`z=${z_1}+t_${i}*(${m_1}-q)`.replaceAll('--', '+'));
     'x=184964585341884+t_0*(61-r)',
     'y=113631924395348+t_0*(469-l)',
     'z=401845630841620+t_0*(-390-q)',
     'x=331877282121819+t_1*(46-r)',
     'y=365938348079363+t_1*(-106-l)',
  }
   console.log(equations)
  // const strEquations = `${equations.map(x => `Eq(${x.split('=')[0]}, ${x.split('=')[1]})`)}`
  // const strIneqs = gts.map(t => `Gt(t_${t[0]}, ${t[1]})`);
  // console.log(`nonlinsolve([${strEquations}, ${strIneqs}], [${symbols.join(', ')}])`);
  // using three is enough to solve.
  // the above is good for python (sympy)
  // solution for my input: 108375683349444 + 289502736377988 + 220656145109505 = 618534564836937
});

function findIntersection(stone, stone2) {
    const { initX: x_1, initY: y_1, vecX: r_1, vecY: l_1 } = stone;
    const { initX: x_2, initY: y_2, vecX: r_2, vecY: l_2 } = stone2;

    const t_2 = (l_1 * (x_1 - x_2) + r_1 * (y_2 - y_1))/(l_1 * r_2 - l_2 * r_1)
    const t_1 = (l_2 * (x_1 - x_2) + r_2 * (y_2 - y_1))/(l_1 * r_2 - l_2 * r_1)
    return (t_1 > 0 && t_1 === t_2)
    
}