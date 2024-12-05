const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const commands = data.toString().trim().split(',');

  const counts = [];
  for (const command of commands) {
    let count = 0;
    for (let i = 0; i < command.length; i++) {
      count += command.charCodeAt(i);
      count *= 17;
      count = count % 256;
    }
    counts.push(count);
  }
  console.log(counts.reduce((a, b) => a + b, 0));
});