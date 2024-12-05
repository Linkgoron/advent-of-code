const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const commands = data.toString().trim().split(',');
  const boxes = new Map();
  for (const command of commands) {
    if (command.includes('=')) {
      const [label, lens] = command.split('=');
      const boxID = computeHash(label);
      if (!boxes.has(boxID)) {
        boxes.set(boxID, new Map());
      }
      const slots = boxes.get(boxID);
      slots.set(label, lens);
    } else {
      const lensLabel = command.substring(0, command.length - 1);
      let boxID = computeHash(lensLabel);
      if (!boxes.has(boxID)) {
        continue;
      }
      const slots = boxes.get(boxID);
      const toFind = [...slots].find(([key, label]) => key === lensLabel);
      if (toFind) {
        slots.delete(toFind[0]);
        if (slots.size === 0) {
          boxes.delete(boxID);
        }
      }
    }
  }
  const fullScore = [...boxes].reduce((acc, [boxId, slots]) => {
    return acc + [...slots].reduce((acc, [label, strength] , ind) => acc + (boxId+1) * (ind + 1) * strength, 0);
  }, 0);
  console.log(fullScore);
});

function computeHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash *= 17;
    hash = hash % 256;
  }
  return hash;
}