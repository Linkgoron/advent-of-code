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
  console.log(system);
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
  console.log(system);
  system.set('button', { type: 'button', name: 'button', state: 'low', targets: new Set([system.get('broadcaster')]) });
  const allPulses = { high: 0, low: 0 };
  for (let round = 0; round < 1000; round++) {
    let toVisit = new Set([{ pulse: null, receiver: system.get('button'), source: null }]);
    for (const current of toVisit) {
      const { pulse, receiver, source } = current;
      if (receiver.type === 'button') {
        toVisit.add({ pulse: 'low', receiver: system.get('broadcaster'), source: receiver })
        continue;
      }
      allPulses[pulse]++;
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
        const allHigh = [...receiver.state.values()].every(x => x === 'high');
        const toSend = allHigh ? 'low' : 'high';
        for (const target of receiver.targets) {
          toVisit.add({ pulse: toSend, receiver: target, source: receiver });
        }
        continue;
      }
      throw new Error('bad type');
    }

    // console.log([...toVisit].filter((a,i) => i>0).map(({ source, pulse, receiver}) => `${source.name} - ${pulse} -> ${receiver.name}`));
  }
  console.log(allPulses, allPulses['high'] * allPulses['low']);
});