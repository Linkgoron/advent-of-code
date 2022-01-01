const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const rows = data.toString().trim().split(/\n/g);

    const map = rows.map(row => {
        return row.split('').map(Number);
    });

    console.log(weightedBFS(map));
});

function weightedBFS(map) {
    const visited = new Set(`0,0`);
    const paths = new PQ();
    paths.enqueue({ row: 0, col: 0, weight: 0 }, 0);
    const maxRow = map.length;
    const maxCol = map[0].length;
    for (const path of paths) {
        
        if (path.col === (maxCol - 1) && path.row === (maxRow - 1)) {
            return path;
        }
        for (const [rowDiff, colDiff] of [[-1, 0], [1, 0], [0, 1], [0, -1]]) {
            const newRow = path.row + rowDiff;
            const newCol = path.col + colDiff;
            if (visited.has(`${newRow}, ${newCol}`)) {
                continue;
            }
            if (newRow < 0 || newCol < 0 || newCol >= maxCol || newRow >= maxRow) {
                continue;
            }
            visited.add(`${newRow}, ${newCol}`);
            const curWeight = map[newRow][newCol];
            paths.enqueue({ row: newRow, col: newCol, weight: path.weight + curWeight }, -(path.weight + curWeight));
        }
    }
    throw new Error('should not get here');
}

class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

class PQ {
    constructor() {
        this.values = [];
    }

    *[Symbol.iterator]() {
        while (this.values.length) {
            yield this.dequeue().val;
        }
    }

    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        this.values.push(newNode);
        let index = this.values.length - 1;
        const current = this.values[index];

        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.values[parentIndex];

            if (parent.priority <= current.priority) {
                this.values[parentIndex] = current;
                this.values[index] = parent;
                index = parentIndex;
            } else break;
        }
    }
    dequeue() {
        const max = this.values[0];
        const end = this.values.pop();
        this.values[0] = end;

        let index = 0;
        const length = this.values.length;
        const current = this.values[0];
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.values[leftChildIndex];
                if (leftChild.priority > current.priority) swap = leftChildIndex;
            }
            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                if (
                    (swap === null && rightChild.priority > current.priority) ||
                    (swap !== null && rightChild.priority > leftChild.priority)
                )
                    swap = rightChildIndex;
            }

            if (swap === null) break;
            this.values[index] = this.values[swap];
            this.values[swap] = current;
            index = swap;
        }

        return max;
    }
}