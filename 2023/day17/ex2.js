const fs = require('fs');


const dirs = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
const opposites = { left: 'right', up: 'down', down: 'up', right: 'left'}
fs.readFile('./ex.input', (err, data) => {
  if (err) throw new Error("data :(");
  const board = data.toString().trim().split(/\r?\n/gm).map(x => x.trim().split('').map(Number));
  const location = { x: 0, y: 0, heat: 0, dir: 'right', sameDir: 0, path:[] }
  const visited = new Set()
  const heap = new MinHeap((a) => a.heat);
  heap.add(location);
  while (heap.size() > 0) {
    const cur = heap.remove();
    const uniqueID = `${cur.x},${cur.y},${cur.dir},${cur.sameDir}`;
    if (visited.has(uniqueID)) continue;
    visited.add(`${cur.x},${cur.y},${cur.dir},${cur.sameDir}`)
    if ((cur.x === board[0].length - 1) && (cur.y === board.length - 1) && cur.sameDir >= 4) {
      console.log(cur.heat);
      return;
    }
    for (const dir of Object.keys(dirs)) {
      if (cur.dir === dir && cur.sameDir === 10) continue;
      if (cur.dir !== dir && cur.sameDir !== 0 && cur.sameDir < 4) continue;
      if (opposites[cur.dir] === dir) continue;
      const [addX, addY] = dirs[dir]
      const nextX = cur.x + addX;
      const nextY = cur.y + addY;
      if (nextX < 0 || nextY < 0 || nextY >= board.length || nextX >= board[0].length) { continue; }
      const sameDir = cur.dir !== dir ? 1 : (cur.sameDir + 1);
      const nextHeat = board[nextY][nextX];
      heap.add({ x: nextX, y: nextY, dir, heat: cur.heat + nextHeat, sameDir, path: [...cur.path, {x: cur.x, y: cur.y}] })
    }
  }
});




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