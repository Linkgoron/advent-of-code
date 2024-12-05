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

  let equations = [];
  const symbols = ['x', 'y', 'z', 'r', 'l', 'q'];
  const gts = []
  for (let i = 0; i < 2; i++) {
    const stone = stones[i];
    symbols.push(`t_${i}`);
    const { vecX: r_1, vecY: l_1, vecZ: m_1, initX: x_1, initY: y_1, initZ: z_1, time } = stone;
    equations.push(`x+t_${i}*(r-${r_1})=${x_1}`.replaceAll('--', '+'));
    equations.push(`y+t_${i}*(l-${l_1})=${y_1}`.replaceAll('--', '+'));
    equations.push(`z+t_${i}*(q-${m_1})=${z_1}`.replaceAll('--', '+'));
    gts.push([i, 0]);
  }
  console.log(`${equations.join('\n')}`)
  console.log(`${symbols.join(', ')} = symbols('${symbols.join(' ')}')`)
  const strEquations = `${equations.map(x => `Eq(${x.split('=')[0]}, ${x.split('=')[1]})`)}`
  const strIneqs = gts.map(t => `Gt(t_${t[0]}, ${t[1]})`);
  console.log(`${gts.map(([i])=>`t_${i}>0`).join('\n')}`)
  console.log('put this in python with sympy:')
  console.log(`nonlinsolve([${strEquations}, ${strIneqs}], [${symbols.join(', ')}])`);
  // using three is enough to solve.
  // the above is good for python (sympy)
  // solution for my input: 108375683349444 + 289502736377988 + 220656145109505 = 618534564836937
});