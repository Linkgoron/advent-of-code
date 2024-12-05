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
  const ignoredAll = new Set([...edges, ...edges.map(e=>flip(e))]);
  const [source1, source2] =  edges[0].split('/');
  const component1 = getComponent(map, map.get(source1), ignoredAll);
  console.log(component1.size * (map.size - component1.size));
});

function findMyEdges(map, components) {
  let source = map.get(components[0].name);
  for (const target of components) {
    if (target.name === source.name) continue;
    const curPath = findPath(map, source, target, new Set());
    let candidatesEdges = curPath.edges;
    for (const ignored1 of candidatesEdges) {      
      const nextPath = findPath(map, source, target, new Set([ignored1, flip(ignored1)]));
      let moreCandidateEdges = nextPath.edges;
      for (const ignored2 of moreCandidateEdges) {
        const evenNextPath = findPath(map, source, target, new Set([ignored1, ignored2, flip(ignored1, flip(ignored2))]));
        let evenMoreCandidateEdges = evenNextPath.edges;
        for (const ignored3 of evenMoreCandidateEdges) {
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
  let paths = new Set([{ current: source.name, edges: new Set() }]);
  let visited = new Set();
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
  let paths = new Set([{ current: source.name }]);
  let visited = new Set();
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