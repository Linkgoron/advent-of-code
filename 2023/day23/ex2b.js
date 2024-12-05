const fs = require('fs');
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const map = data.toString().trim().split(/\r?\n/gm).map(x => x.trim());
  const vertices = new Map([[`1, 0`, { x: 1, y: 0, edges: new Map()  }]]);
  for (const [key, vertex] of vertices) {
    const paths = new Set(dirs.map(([addX, addY]) => {
      const nextX = vertex.x + addX;
      const nextY = vertex.y + addY;
      const nextRow = map[nextY];
      if (!nextRow) { return undefined };
      const nextChar = nextRow[nextX];
      if (!nextChar || nextChar === '#') { return undefined };
      return { x: nextX, y: nextY };
    }).filter(Boolean).map(point => {
      return {
        path: new Set([getKey(vertex), getKey(point)]),
        next: getKey(point),
      }
    }));
    const targets = new Map();
    for (const fullPath of paths) {
      const { path, next: position } = fullPath;
      const [x, y] = position.split(', ').map(Number);
      let options = [];
      for (const [addX, addY] of dirs) {
        const nextX = x + addX;
        const nextY = y + addY;
        const nextRow = map[nextY];
        if (!nextRow) continue;
        const nextChar = nextRow[nextX];
        if (!nextChar || nextChar === '#') continue;
        if (path.has(getKey(nextX, nextY))) continue;
        options.push(getKey(nextX, nextY));
      }
      if (options.length === 1) {
        paths.add({
          path: new Set([...path, options[0]]),
          next: options[0],
        });
        continue;
      }
      if (options.length === 0 && y !== map.length - 1 && x !== map[0].length - 2) continue;
      if (!targets.has(getKey(x, y))) {
        targets.set(getKey(x, y), 0);
      }
      const currentTargetMax = targets.get(getKey(x, y));
      const distance = fullPath.path.size - 1;
      if (currentTargetMax < distance) {
        targets.set(getKey(x, y), distance);
      }
    }
    for (const [targetKey, len] of targets) {
      if (!vertices.has(targetKey)) {
        const [x, y] = targetKey.split(', ').map(Number);
        const newVertex = { x, y, edges: new Map() };
        vertices.set(targetKey, newVertex);
      }
      const cur = vertex.edges.get(targetKey) || { len: 0 };
      vertex.edges.set(targetKey, { len: Math.max(cur.len, len) });
    }
  }

  let pathSize = 0;
  let max = 0;
  const nextStage = new Set([{ path: new Set([`1, 0`]), next: `1, 0`, len: 0 }]);
  while (nextStage.size > 0) {
    let candidates = new Map();
    for (const fullPath of nextStage) {
      const { path, next: position } = fullPath;
      const [x, y] = position.split(', ').map(Number);
      if (y === map.length - 1 && x == map[0].length - 2) {
        if (fullPath.len > max) {
          max = fullPath.len;
          pathSize = fullPath.path.size;
        }
        continue;
      }
      const key = `${position},${[...path].sort().join('')}`;
      const nextOpt = candidates.get(key);
      if (nextOpt) {
        if (nextOpt.fullPath.len >= fullPath.len) { continue; }
      }
      candidates.set(key, { fullPath, position });
    }
    nextStage.clear();
    for (const { fullPath, position } of candidates.values()) {
      const nextStop = vertices.get(position);
      for (const [vertexKey, { len }] of nextStop.edges) {
        if (fullPath.path.has(vertexKey)) {
          continue;
        }
        nextStage.add({
          path: new Set([...fullPath.path, vertexKey]),
          next: vertexKey,
          len: fullPath.len + len
        });
      }
    }
  }
  console.log(max, pathSize );
});

function getKey(x,y) {
  if (typeof x === 'object') {
    return `${x.x}, ${x.y}`;
  }
  return `${x}, ${y}`;
}

class MinHeap {
  constructor(valueOf) {
    this.heap = [];
    this.valueOf = valueOf ?? (a => a);
  }

  // Helper Methods
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }
  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }
  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }
  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }
  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }
  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }
  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }
  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }
  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  // Functions to create Min Heap

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  // Removing an element will remove the
  // top element with highest priority then
  // heapifyDown will be called 
  remove() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.valueOf(this.parent(index)) > this.valueOf(this.heap[index])) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && this.valueOf(this.rightChild(index)) < this.valueOf(this.leftChild(index))) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.valueOf(this.heap[index]) < this.valueOf(this.heap[smallerChildIndex])) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  size() {
    return this.heap.length;
  }

  printHeap() {
    var heap = ` ${this.heap[0]} `
    for (var i = 1; i < this.heap.length; i++) {
      heap += ` ${this.heap[i]} `;
    }
    console.log(heap);
  }
}