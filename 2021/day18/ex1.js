const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const pairs = data.toString().split('\n').map(x => new Tree(JSON.parse(x)));
    let cur = pairs[0];
    for (let next of pairs.slice(1)) {
        cur = cur.addTo(next);
    }
    console.log(cur.magnitude());
});


function reduceAll(tree) {
    let res = false;
    let nextTree = tree.clone();
    do {
        res = explode(nextTree, 0);
        if (!res) {
            res = split(nextTree, 0);
        }
    } while (res)
    return nextTree;
}

function explode(tree, depth = 0) {
    if (depth === 4 && !tree.isLeaf) {
        let [left, right] = tree.children;
        mergeWithNumber(left.value, tree.parent, 'left', tree, depth);
        mergeWithNumber(right.value, tree.parent, 'right', tree, depth);
        tree.parent.swap(tree, 0);
        return true;
    }
   
    if (!tree.isLeaf) {
        if (explode(tree.left, depth + 1)) {
            return true;
        }
        if (explode(tree.right, depth + 1)) {
            return true;
        }
    }

    return false;
}

function split(tree, depth = 0) {
    if (tree.isLeaf && tree.value >= 10) {
        const leftVal = Math.floor(tree.value / 2);
        const rightVal = Math.ceil(tree.value / 2);
        tree.parent.swap(tree, [leftVal, rightVal]);
        return true;
    }

    if (!tree.isLeaf) {
        if (split(tree.left, depth + 1)) {
            return true;
        }
        if (split(tree.right, depth + 1)) {
            return true;
        }
    }

    return false;
}

function mergeWithNumber(value, node, dir, from, depth) {
    if (!node) return;
    if (from !== node[dir]) {
        return replaceWithDir(value, node[dir], dir === 'left' ? 'right' : 'left', depth + 1);
    }

    return mergeWithNumber(value, node.parent, dir, node, depth - 1);
}

function replaceWithDir(value, node, dir, depth) {
    if (node.isLeaf) {
        node.value = node.value + value;
        return node;
    } else {
        return replaceWithDir(value, node[dir], dir);
    }
}



class Tree {
    constructor(value, parent) {
        this.parent = parent;
        if (Array.isArray(value)) {
            this.isLeaf = false;
            this.left = new Tree(value[0], this);
            this.right = new Tree(value[1], this);
        } else {
            this.isLeaf = true;
            this.value = value;
        }
    }

    get children() {
        return [this.left, this.right];
    }

    clone() {
        return new Tree(JSON.parse(this.print()));
    }

    swap(tree, value) {
        if (this.left === tree) {
            this.left = new Tree(value, this);
            return this.left;
        } else if (this.right === tree) {
            this.right = new Tree(value, this);
            return this.right;
        } else {
            throw new Error('this should not happen');
        }
    }

    print() {
        if (this.isLeaf) {
            return this.value.toString();
        }

        return `[${this.left.print()}, ${this.right.print()}]`;
    }

    static addition(treeOne, treeTwo) {
        return reduceAll(new Tree(JSON.parse(`[${treeOne.print()}, ${treeTwo.print()}]`)));
    }

    addTo(other) {
        return Tree.addition(this, other);
    }

    magnitude() {
        if (this.isLeaf) {
            return this.value;
        }
        return (3 * this.left.magnitude()) + (2 * this.right.magnitude());
    }
}