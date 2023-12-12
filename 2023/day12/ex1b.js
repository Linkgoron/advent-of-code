const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const states = data.toString().trim().split('\n').map((row) => {
    const [state, target] = row.trim().split(' ');
    return {
      state,
      target: target.split(',').map(Number),
      targetString: target,
      needToPlant: target.split(',').map(Number).reduce((acc, cur) => acc + cur, 0),
    }
  });
  

  const counts = []
  for (const state of states) {
    const { state: word, targetString, needToPlant } = state;
    const initialState = computeState(word);
    const targetMax = Math.max(...state.target);
    const map = new Map([[`${initialState.breakdown}, ${initialState.preQuestion}, ${initialState.nextPos}`, { ...initialState, count: 1, sample: word }]]);
    for (const [key, current] of map) {
      if (current.isFinal) {
        if (targetString === current.breakdown) {
          counts.push(current.count);
        }
        continue;
      }

      const opt1Sample = current.sample.split('').map((x, i) => i === current.nextPos ? '#' : x).join('');
      const opt1 = computeState(opt1Sample);
      const opt2Sample = current.sample.split('').map((x, i) => i === current.nextPos ? '.' : x).join('');
      const opt2 = computeState(opt2Sample);
      for (const [optState, sample] of [[opt1, opt1Sample], [opt2, opt2Sample]]) {
        const fullOptState = {
          breakdown: optState.breakdown,
          nextPos: optState.nextPos,
          isFinal: optState.isFinal,
          preQuestion: optState.preQuestion,
          count: current.count,
          sample: sample,
          totalPossible: optState.totalPossible
        };
        if (optState.max > targetMax) { continue; }
        if (fullOptState.totalPossible < needToPlant) { continue; }
        if (targetString.startsWith(fullOptState.breakdown)) {
          const alreadyComputing = map.get(`${fullOptState.breakdown}, ${fullOptState.preQuestion}, ${fullOptState.nextPos}`);
          if (alreadyComputing) {
            alreadyComputing.count += current.count;
          } else {
            map.set(`${fullOptState.breakdown}, ${fullOptState.preQuestion}, ${fullOptState.nextPos}`, fullOptState);
          }
        }
      }
    }
  }
  console.log(counts.reduce((a, b) => a + b, 0));
});

function computeState(line) {  
  const breakdown = [];
  const qPos = line.indexOf('?');
  const nextPos = qPos === -1 ? line.length : (1 + qPos);
  let max = 0;
  let curSize = 0;  
  let preQuestion = 0;
  for (let i = 0; i < nextPos; i++) {
    switch (line[i]) {
      case '?': {
        if (curSize && max > curSize) {
          max = curSize;
        }
        preQuestion = curSize;
        continue;
      }
      case '.': {
        if (curSize > 0) {
          breakdown.push(curSize);
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
          breakdown.push(curSize);
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
    isFinal: qPos === -1,
    max,
    breakdown: breakdown.join(','),
    nextPos: qPos,
    preQuestion,
    totalPossible: line.split('').reduce((acc, cur) => acc + (cur !== '.' ? 1 : 0), 0)
  }
}