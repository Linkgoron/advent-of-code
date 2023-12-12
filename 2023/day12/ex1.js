const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const states = data.toString().trim().split('\n').map((row) => {
    const [state, target, targetString] = row.trim().split(' ');
    return {
      state,
      target: target.split(',').map(Number),
      targetString: target,
    }
  });
  

  let counts = []
  for (const state of states) {
    const futures = new Set([state.state]);
    const max = Math.max(state.target);
    const targetString = state.targetString;
    let count = 0;
    for (const future of futures) {
      const item = computeState(future);
      if (item.max > max) continue;
      if (!targetString.startsWith(item.breakdown)) {
        continue;
      }
      if (item.isFinal && item.breakdown === targetString) {
        count++;
        continue;
      }      
      const nextPos = future.indexOf('?');
      futures.add(future.split('').map((x,i) => i === nextPos ? '#' : x).join(''));
      futures.add(future.split('').map((x,i) => i === nextPos ? '.' : x).join(''));
    }
    counts.push(count);
  }
  console.log(counts.reduce((a,b) => a+b, 0));
});

function computeState(line) {
  let curSize = 0;
  let breakdown = [];
  let max = 0;
  let noQuestionMark = true;
  for (let i = 0; i < line.length; i++) {
    switch (line[i]) {
      case '?': {
        if (curSize && max > curSize) {
          max = curSize;
        }
        curSize = 0;
        noQuestionMark = false;
        continue;
      }
      case '.': {
        if (curSize > 0) {          
          if (noQuestionMark) {
            breakdown.push(curSize);
          }
          if (curSize > max) {
            max = curSize;
          }
          curSize = 0;
        }
        continue
      }
      case '#': {
        curSize++;
        if (i === line.length - 1) {
          if (noQuestionMark) {
            breakdown.push(curSize);
          }
        }
        if (curSize > max) {
          max = curSize;
        }
        continue;
      }

      default: {
        console.log('char:', line[i], i);
        throw new Error('bad char');
      }
    }
  }
  return {
    isFinal: noQuestionMark,
    max,
    breakdown: breakdown.join(','),
  }
}