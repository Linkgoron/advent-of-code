const fs = require('fs');

const props = ['x', 'm', 'a', 's'];
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const [rawPipelines] = data.toString().trim().split(/\r?\n\r?\n/gm); 1
  const pipelines = rawPipelines.trim().split('\n').map(rawPipeline => {
    const [name, rawRules] = rawPipeline.replace('}', '').split('{');
    const rules = rawRules.split(',').map(rawRule => {
      if (!rawRule.includes(':')) {
        return {
          type: 'min',
          opType: 'max',
          limit: Number.MIN_VALUE,
          target: rawRule,
          empty: true,
          prop: 'a',
        };
      }
      const [rawCondition, target] = rawRule.split(':');
      const [prop, rawLimit] = rawCondition.split(/\>|\</);
      const limit = Number(rawLimit);
      const isBigger = rawCondition.includes('>');
      return {
        type: isBigger ? 'min' : 'max',
        opType: isBigger ? 'max' : 'min',
        limit: isBigger ? (limit + 1) : (limit - 1),
        opLimit: limit,
        target,
        prop,
        empty: false,
      }
    });
    return {
      name,
      rules
    }
  })

  const buckets = new Map([['A', { items: new Set() }], ['R', { items: new Set() }]]);
  for (const pipeline of pipelines) {
    buckets.set(pipeline.name, { pipeline, items: new Set() });
  }
  const initState = {}
  for (prop of props) {
    initState[prop] = { min: 1, max: 4000 };
    buckets.get('in').items.add(initState);
  }

  let moved = true;
  while (moved) {
    moved = false;
    for (const [name, { pipeline, items }] of buckets) {
      if (name === 'R' || name === 'A') continue;
      for (const item of items) {
        moved = true;
        items.delete(item);
        let pastRules = clone(item);
        for (const rule of pipeline.rules) {
          newItem = clone(pastRules);
          newItem[rule.prop][rule.type] = Math[rule.opType](newItem[rule.prop][rule.type], rule.limit);

          if (newItem[rule.prop].max >= newItem[rule.prop].min) {
            buckets.get(rule.target).items.add(newItem);
          }
          
          pastRules[rule.prop][rule.opType] = Math[rule.type](pastRules[rule.prop][rule.opType], rule.opLimit);
          if (pastRules[rule.prop].max < pastRules[rule.prop].min) {
            break;
          }
        }
      }
    }
  }
  console.log([...buckets.get('A').items].reduce((acc, cur) => acc + Object.values(cur).map(x => (x.max - x.min + 1)).reduce((a, b) => a * b, 1), 0));
});

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}