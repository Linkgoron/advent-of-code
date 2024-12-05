const fs = require('fs');


const dirs = { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] }
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const commands = data.toString().trim().split(/\r?\n/gm).map(x => {
    const [dir, steps] = x.trim().split(' ');
    return {
      dir,
      steps: Number(steps),
    }
  });

  let position = { x: 0, y: 0 };
  const vertices = [];
  let perimeter = 0;
  for (const command of commands) {
    const [xDir, yDir] = dirs[command.dir];
    position = {
      x: position.x + xDir * command.steps,
      y: position.y + yDir * command.steps
    }
    perimeter += command.steps
    vertices.push(position);
  }

  // shoelace formula
  let doubleArea = 0;
  for (let cur = 0; cur < vertices.length; cur++) {
    const prev = (cur === 0 ? vertices.length : cur) - 1;
    const next = ((cur === vertices.length - 1) ? 0 : (cur + 1))
    const prevVertex = vertices[prev];
    const nextVertex = vertices[next];
    const curVertex = vertices[cur];
    doubleArea += (prevVertex.x - nextVertex.x) * curVertex.y;
  }

  // picks algorithm
  const area = (doubleArea / 2);
  const interior = area - (perimeter / 2) + 1;
  console.log(interior + perimeter);
});