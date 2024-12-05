const fs = require('fs');
const dirs = { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] }
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const modules = data.toString().trim().split(/\r?\n/gm).map(x => {
    const [rawName, targets] = x.split(' -> ');
    if (rawName === 'broadcaster') {
      return {
        name: rawName,
        type: rawName,
        targets: targets.split(', '),
      }
    }
    const type = rawName[0];
    return {
      type: type === '%' ? 'flip-flop' : 'conjunction',
      name: rawName.substring(1),
      targets: targets.split(', '),
    }
  });
  let system = new Map();
  // add to system
  for (const rawModule of modules) {
    const module = {
      name: rawModule.name,
      type: rawModule.type,
      rawTargets: rawModule.targets,
      targets: new Set(),
      sources: new Set(),
      state: rawModule.type === 'flip-flop' ? 'low' : undefined,
    };
    system.set(rawModule.name, module);
  }
    
  // console.log(system);
  // connect to targets
  for (const module of system.values()) {
    for (const targetName of module.rawTargets) {
      if (!system.get(targetName)) {
        system.set(targetName, { name: targetName, type: 'untyped', sources: new Set(), rawTargets: [] });
      }
      const target = system.get(targetName);
      module.targets.add(target);
      target.sources.add(module);
    }
  }  

  for (const module of system.values()) {
    if (module.type !== 'conjunction') continue;
    module.state = new Map([...module.sources].map(x => [x.name, 'low']));
  }

  system.set('button', { type: 'button', name: 'button', state: 'low', targets: new Set([system.get('broadcaster')]), });
  const numStates = [];
  let x = 0;
  for (const module of system.values()) {
    if (module.type === 'untyped' || module.type === 'broadcaster' || module.type === 'button') {
      numStates.push(1);
      continue;
    }
    if (module.type === 'flip-flop') {
      numStates.push(2);
      continue
    }
    if (module.type === 'conjunction') {
      numStates.push(2 ** module.sources.size );
      continue
    }
  }

  const rxSource = [...system.get('rx').sources][0];
  const highPulse = new Map();
  for (let round = 0; highPulse.size < rxSource.sources.size; round++) {
    let toVisit = new Set([{ pulse: null, receiver: system.get('button'), source: null }]);
    for (const current of toVisit) {
      const { pulse, receiver, source } = current;
      if (receiver.type === 'button') {
        toVisit.add({ pulse: 'low', receiver: system.get('broadcaster'), source: receiver })
        continue;
      }
      if (receiver.type === 'untyped') {
        continue;
      }
      if (receiver.type === 'broadcaster') {
        for (const target of receiver.targets) {
          toVisit.add({ pulse, receiver: target, source: receiver });
        }
        continue;
      }

      if (receiver.type === 'flip-flop') {
        if (pulse === 'high') continue;
        const toSend = receiver.state === 'low' ? 'high' : 'low';
        receiver.state = toSend;
        for (const target of receiver.targets) {
          toVisit.add({ pulse: toSend, receiver: target, source: receiver });
        }
        continue;
      }

      if (receiver.type === 'conjunction') {
        receiver.state.set(source.name, pulse);
        if (pulse === 'high' && receiver === rxSource) {
          if (!highPulse.has(source.name)) {
            highPulse.set(source.name, round + 1);
          }

          if (highPulse.size === rxSource.sources.size) {
            break;
          }
        }
        const allHigh = [...receiver.state.values()].every(x => x === 'high');
        const toSend = allHigh ? 'low' : 'high';
        for (const target of receiver.targets) {
          toVisit.add({ pulse: toSend, receiver: target, source: receiver });
        }
        continue;
      }
      throw new Error('bad type');
    }    
  }
  console.log(computeLCM(highPulse.values()))
});

function computeLCM(numbers) {
  const numberPrimes = (Array.isArray(numbers) ? numbers : [...numbers]).map(x => findPrimeFactors(x));
  const uniqueFactors = new Set(numberPrimes.map(x => Object.keys(x)).flat());
  return [...uniqueFactors].map(primeFactor => {
      const haveFactor = numberPrimes.filter(x => primeFactor in x);
      const maxNeeded = Math.max(...haveFactor.map(x => x[primeFactor]));
      return primeFactor ** maxNeeded;
  }).reduce((a, b) => a * b, 1);
}

function findPrimeFactors(num) {
  const primeFactors = [];
  while (num % 2 === 0) {
      primeFactors.push(2);
      num = num / 2;
  }

  const sqrtNum = Math.sqrt(num);
  for (let i = 3; i <= sqrtNum; i++) {
      while (num % i === 0) {
          primeFactors.push(i);
          num = num / i;
      }
  }

  if (num > 2) {
      primeFactors.push(num);
  }
  return primeFactors.reduce((a, b) => {
      a[b] = (a[b] || 0) + 1;
      return a;
  }, {});
}