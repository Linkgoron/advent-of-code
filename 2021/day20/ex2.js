const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const [imageEnhancer, image] = data.toString().trim().split(/\r?\n\r?\n/g);
    const imageRows = image.split(/\r\n/g).map(row => row.trim());

    const pixelMap = new PixelMap(imageRows, imageEnhancer);
    let cur = pixelMap;
    for (let i = 0; i < 50; i++) {
        cur.print();
        cur = cur.nextMap(i);
    }
    cur.print();
    console.log(cur.points());
});

class PixelMap {
    constructor(initial, enhancer) {
        this.map = new Set();
        if (Array.isArray(initial)) {
            for (let rowIndex = 0; rowIndex < initial.length; rowIndex++) {
                const row = initial[rowIndex];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    if (row[colIndex] === '#') {
                        this.map.add(`${rowIndex},${colIndex}`);
                    }
                }
            }

            this.minX = -2;
            this.minY = -2;
            this.maxX = initial.length + 2;
            this.maxY = initial[0].length + 2;
        }

        this.enhancer = enhancer;
    }

    isColor(x, y) {
        return this.map.has(`${x},${y}`);
    }

    enhancePoint(x, y, iteration) {
        let binaryString = '';
        for (let row = -1; row < 2; row++) {
            for (let col = -1; col < 2; col++) {
                if (x + row < this.minX || x + row >= this.maxX || (y + col) < this.minY || (y + col) >= this.maxY) {
                    let emptyForEmpty = this.enhancer[0] === '.';
                    if (emptyForEmpty) {
                        binaryString += '0';
                    } else if ((iteration % 2) === 1) {
                        binaryString += '1';
                    } else {
                        binaryString += this.enhancer[511] === '#' ? '1' : '0';
                    }
                } else {
                    binaryString += this.isColor(x + row, y + col) ? '1' : '0';
                }
            }
        }
        const num = parseInt(binaryString, 2);
        return this.enhancer[num] === '#';
    }

    nextMap(iteration) {
        const nextState = new PixelMap([[]], this.enhancer);
        nextState.map.clear();
        nextState.minX = this.minX - 2;
        nextState.maxX = this.maxX + 2;
        nextState.minY = this.minY - 2;
        nextState.maxY = this.maxY + 2;

        for (let rowIndex = nextState.minX; rowIndex < nextState.maxX; rowIndex++) {
            for (let colIndex = nextState.minY; colIndex < nextState.maxY; colIndex++) {
                const val = this.enhancePoint(rowIndex, colIndex, iteration);
                if (val) {
                    nextState.map.add(`${rowIndex},${colIndex}`);
                }
            }
        }
        return nextState;
    }

    print() {
        for (let i = 0; i < this.rows; i++) {
            let str = '';
            for (let j = 0; j < this.columns; j++) {
                str += this.isColor(i, j) ? '#' : '.';
            }
            console.log(str);
        }
    }

    points() {
        return this.map.size;
    }
}