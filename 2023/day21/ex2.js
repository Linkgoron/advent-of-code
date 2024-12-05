const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const rawMap = data.toString().trim().split(/\r?\n/gm);

});