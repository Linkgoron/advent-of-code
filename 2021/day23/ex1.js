const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const rows = data.toString().trim().split(/\r?\n/gi);
    const locations = [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const curRow = rows[rowIndex];
        for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
            const char = curRow[colIndex];
            if (char === '#' || char === ' ') {
                continue;
            }
            if (char === '.') {
                locations.push({
                    isRoom: false,
                    canStop: ![3, 5, 7, 9].includes(colIndex),
                    x: colIndex,
                    y: rowIndex,
                });
                continue;
            }
            locations.push({
                isRoom: true,
                taken: char,
                x: colIndex,
                y: rowIndex,
                roomOwner: ['A', 'B', 'C', 'D'][(colIndex - 3) / 2],
            })
        }
    }

    const state = {
        score: 0,
        locations,
        moves: 0,
    }

    const mem = new Set();
    const pq = new PQ();
    pq.enqueue(state, state.score);
    const needTotal = state.locations.filter(x => x.taken).length;
    const roomSize = needTotal / 4;
    for (const nextVal of pq) {
        const valHash = hashify(nextVal);
        if (mem.has(valHash)) {
            continue;
        }
        mem.add(valHash);
        if (isDone(nextVal, needTotal)) {
            console.log(nextVal);
            return;
        }
        for (const nextOpt of nextOptions(nextVal, mem, roomSize)) {
            pq.enqueue(nextOpt, -nextOpt.score);
        }
    }
});

function* nextOptions(state, seen, roomSize) {
    for (const location of state.locations.filter(x => x.taken)) {
        for (const nextState of getOptions(state, location, roomSize)) {
            if (seen.has(hashify(nextState))) {
                continue;
            }
            yield nextState;
        }
    }
}

function getOptions(state, curLoc, roomSize) {
    const energies = { 'A': 1, 'B': 10, 'C': 100, 'D': 1000 };
    const energy = energies[curLoc.taken];
    if (curLoc.isRoom) {
        if (curLoc.roomOwner === curLoc.taken) {
            // dont move if all of the bottoms are taken.
            const takenAboveMe = state.locations.filter(loc => loc.roomOwner === curLoc.taken && loc.roomOwner === loc.taken && loc.y >= curLoc.y).length;
            if (takenAboveMe === (roomSize - curLoc.y + 2)) {
                return [];
            }
        }
        const possibilities = state.locations.filter(x => x.canStop && !x.taken).filter(nextLoc => isClear(state.locations, curLoc, nextLoc));
        return possibilities.map(selected => {
            const unChanged = state.locations.filter(x => x !== curLoc && x !== selected);
            const energyUsed = energy * (Math.abs(curLoc.x - selected.x) + Math.abs(curLoc.y - selected.y));
            return {
                moves: state.moves + 1,
                score: state.score + energyUsed,
                locations: [
                    ...unChanged,
                    {
                        isRoom: true,
                        taken: false,
                        roomOwner: curLoc.roomOwner,
                        x: curLoc.x,
                        y: curLoc.y,
                    },
                    {
                        taken: curLoc.taken,
                        x: selected.x,
                        y: selected.y,
                        canStop: true,
                    },
                ]
            }
        })
    } else {
        const relevant = state.locations.filter(loc => loc.roomOwner === curLoc.taken);
        const canMoveToRoom = relevant.every(x => !x.taken || x.taken === curLoc.taken);
        if (!canMoveToRoom) {
            return [];
        }

        // enter into the lowest place.
        const selected = relevant.filter(x => !x.taken).sort((a, b) => b.y - a.y)[0];
        if (selected.taken) {
            throw new Error('wrong door');
        }
        if (!isClear(state.locations, curLoc, selected)) {
            return [];
        }
        const unChanged = state.locations.filter(x => x !== curLoc && x !== selected);
        const additionalScore = energy * (Math.abs(curLoc.x - selected.x) + Math.abs(curLoc.y - selected.y));
        return [
            {
                moves: state.moves + 1,
                score: state.score + additionalScore,
                locations: [
                    ...unChanged,
                    {
                        isRoom: true,
                        taken: curLoc.taken,
                        roomOwner: selected.roomOwner,
                        x: selected.x,
                        y: selected.y,
                    },
                    {
                        taken: false,
                        x: curLoc.x,
                        y: curLoc.y,
                        canStop: true,
                    },
                ]
            }
        ]
    }
}
function hashify(state) {
    return JSON.stringify(state.locations.filter(x => x.taken).sort((a, b) => (a.x - b.x) || (a.y - b.y)).map(loc => ({
        x: loc.x,
        y: loc.y,
        taken: loc.taken,
    })));
}

function isClear(locations, start, end) {
    if (start.isRoom && end.isRoom) {
        return false;
    }

    if (!start.isRoom && !end.isRoom) {
        return false;
    }

    if (start.y > end.y) {
        return isClear(locations, end, start);
    }

    const xDiff = end.x - start.x;
    const xDir = xDiff / Math.abs(xDiff);
    let xPos = start.x;
    for (let i = 0; i < Math.abs(xDiff); i++) {
        xPos += xDir;
        const nextPos = locations.find(nextLoc => nextLoc.x === xPos && nextLoc.y === start.y);
        if (nextPos.taken) {
            return false;
        }
    }

    const yDiff = end.y - start.y;
    const yDir = yDiff / Math.abs(yDiff);
    let yPos = start.y;
    for (let i = 0; i < Math.abs(yDiff) - 1; i++) {
        yPos += yDir;
        const nextPos = locations.find(nextLoc => nextLoc.x === xPos && nextLoc.y === yPos);
        if (nextPos.taken) {
            return false;
        }
    }

    return true;
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
        if (this.values.length === 1) {
            return max;
        }
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

function isDone(state, needTotal) {
    return state.locations.filter(x => x.roomOwner && x.roomOwner === x.taken).length === needTotal;
}