const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const [rawLine, ...rawBoards] = data.toString().trim().split('\n').map(x => x.trim()).filter(Boolean);
    const boards = [];
    const boardCount = rawBoards.length / 5;
    for (let i = 0; i < boardCount; i++) {
        boards.push(new Board(rawBoards.slice(i * 5, (i + 1) * 5)));
        boards[i].print();
    }
    const line = rawLine.split(',').map(Number);
    const winner = playGame(line, boards);
    console.log('winner', winner.score());
    winner.print();
});

function playGame(line, boards) {
    for (const num of line) {
        console.log('marking', num);
        for (const board of boards) {
            board.mark(num);
            if (board.isWinner()) {
                return board;
            }
        }
    }
}

class Board {
    constructor(input) {
        this._matrix = input.map(x => x.split(/ +/g).map(Number));
        this._markedInRow = {};
        this._markedInCol = {};
        this._matchedNumbers = [];
        this._isWinner = false;
    }

    mark(calledNumber) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const curNumber = this._matrix[row][col];
                if (curNumber === calledNumber) {
                    this._markedInCol[col] = (this._markedInCol[col] || 0) + 1;
                    this._markedInRow[row] = (this._markedInRow[row] || 0) + 1;
                    this._matchedNumbers.push(calledNumber);
                    if (this._markedInCol[col] === 5 || this._markedInRow[row] === 5) {
                        this._isWinner = true;
                    }
                }
            }
        }
    }

    isWinner() {
        return this._isWinner;
    }

    score() {
        const sum = this._matrix.reduce((agg, cur) => {
            return agg + cur.reduce((agg, num) => agg + (this._matchedNumbers.includes(num) ? 0 : num), 0)
        }, 0);
        return sum * this._matchedNumbers[this._matchedNumbers.length - 1];
    }

    print() {
        for (const row of this._matrix) {
            console.log(row.join(' '));
        }
    }
}