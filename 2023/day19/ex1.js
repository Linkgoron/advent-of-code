const fs = require('fs');
const dirs = { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] }
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const [rawPipelines, rawItems] = data.toString().trim().split(/\r?\n\r?\n/gm);
  const pipelines = rawPipelines.trim().split('\n').map(rawPipeline => {
    const [name, rawRules] = rawPipeline.replace('}', '').split('{');
    const rules = rawRules.split(',').map(rawRule => {
      if (!rawRule.includes(':')) {
        return {
          passes: () => true,
          target: rawRule
        };
      }
      const [rawCondition, target] = rawRule.split(':');
      let condition = rawCondition.includes('>') ? isBigger : isSmaller;
      const [prop, rawLimit] = rawCondition.split(/\>|\</);
      const limit = Number(rawLimit);
      return {
        passes: (item) => condition(item[prop], limit),
        target,
      }
    });
    return {
      name,
      rules
    }
  })

  const items = rawItems.split('\n').map(rawItem => {
    const item = {};
    const propValues = rawItem.substring(1, rawItem.length - 1).split(',');
    for (const propValue of propValues) {
      const [prop, value] = propValue.split('=');
      item[prop] = Number(value);
    }
    return item;
  });
  const buckets = new Map([['A', { items: new Set() }], ['R', { items: new Set() }]]);
  for (const pipeline of pipelines) {
    buckets.set(pipeline.name, { pipeline, items: new Set() });
    if (pipeline.name === 'in') {
      for (const item of items) {
        buckets.get(pipeline.name).items.add(item);
      }
    }
  }
  console.log(buckets);
  let moved = true;
  while (moved) {
    moved = false;
    for (const [name, { pipeline, items }] of buckets) {
      if (name === 'R' || name === 'A') continue;
      if (items.size === 0) continue;
      for (const item of items) {
          moved = true;
          items.delete(item);
          for (const rule of pipeline.rules) {
            if (rule.passes(item)) {
              buckets.get(rule.target).items.add(item);
              break;
            }
          }
      }
    }
  }
  console.log([...buckets.get('A').items].reduce((sum, item) => {
      return sum + Object.values(item).reduce((acc,cur) => acc + cur, 0);
  }, 0 ));
});

function isBigger(a, b) {
  return a > b;
}

function isSmaller(a, b) {
  return a < b;
}