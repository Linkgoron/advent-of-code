const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const components = data.toString().trim().split(/\r?\n/gm).map(x => x.trim()).map(x => {
    const [name, rawEdges] = x.trim().split(': ');
    const edges = rawEdges.trim().split(' ');
    return {
      name, edges
    }
  });
  let map = new Map();
  for (const component of components) {
    if (!map.has(component.name)) {
      map.set(component.name, { name: component.name, edges: new Set() });
    }
    const current = map.get(component.name);
    for (const edge of component.edges) {
      if (!map.has(edge)) {
        map.set(edge, { name: edge, edges: new Set() });
      }
      map.get(edge).edges.add(current.name);
      current.edges.add(edge);
    }
  }
  const edgeNames = findMyEdges(map, components);
  const edges = Object.values(edgeNames);
  const ignoredAll = mergeSets(edges, flipSet(edges));
  const [source1] = edges[0].split('/');
  const component1 = getComponent(map, map.get(source1), ignoredAll);
  const component2Size = map.size - component1.size;
  console.log(component1.size * component2Size);
});

function findMyEdges(map, components) {
  let source = map.get(components[0].name);
  for (const target of components) {
    if (target.name === source.name) continue;
    const curPath = findPath(map, source, target, new Set());
    const phase1Remove = mergeSets(curPath.edges, flipSet(curPath.edges));
    const nextPath = findPath(map, source, target, phase1Remove);
    let phase2Remove = mergeSets(phase1Remove, nextPath.edges, flipSet(nextPath.edges));
    const evenNextPath = findPath(map, source, target, phase2Remove);
    let phase3Remove = mergeSets(phase2Remove, evenNextPath.edges, flipSet(evenNextPath.edges));
    const noPath = findPath(map, source, target, phase3Remove);
    if (noPath) continue;
    for (const ignored1 of curPath.edges) {
      for (const ignored2 of nextPath.edges) {
        for (const ignored3 of evenNextPath.edges) {
          const finalPath = findPath(map, source, target, new Set([ignored1, ignored2, ignored3, flip(ignored1), flip(ignored2), flip(ignored3)]));
          if (!finalPath) {
            return { ignored1, ignored2, ignored3 }
          }
        }
      }
    }
  }
}

function findPath(map, source, target, ignoredEdges) {
  const paths = new Set([{ current: source.name, edges: new Set() }]);
  const visited = new Set();
  for (const path of paths) {
    if (path.current === target.name) {
      return path;
    }
    if (visited.has(path.current)) continue;
    visited.add(path.current);
    const cur = map.get(path.current);
    for (const opt of cur.edges) {
      if (visited.has(opt)) continue;
      const edgeName = `${path.current}/${opt}`;
      if (ignoredEdges.has(edgeName)) { continue; }
      paths.add({
        edges: new Set([...path.edges, edgeName]),
        current: opt
      });
    }
  }
}

function getComponent(map, source, ignoredEdges) {
  const paths = new Set([{ current: source.name }]);
  const visited = new Set();
  for (const path of paths) {
    if (visited.has(path.current)) continue;
    visited.add(path.current);
    const cur = map.get(path.current);
    for (const opt of cur.edges) {
      if (visited.has(opt)) continue;
      const edgeName = `${path.current}/${opt}`;
      if (ignoredEdges.has(edgeName)) { continue; }
      paths.add({
        current: opt
      });
    }
  }
  return visited;
}

const cache = new Map();
function flip(pair) {
  if (cache.has(pair)) return cache.get(pair);
  const toFlip = pair.split('/');
  const fliper = `${toFlip[1]}/${toFlip[0]}`;
  cache.set(pair, fliper);
  return fliper;
}

function flipSet(set) {
  let nextSet = new Set();
  for (const ite of set) {
    nextSet.add(ite);
  }
  return nextSet;
}
function mergeSets(...sets) {
  const newSet = new Set(sets[0]);
  for (let i = 1; i < sets.length; i++) {
    for (const item of sets[i]) {
      newSet.add(item);
    }
  }
  return newSet;
}