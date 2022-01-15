const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const rows = data.toString().trim().split(/\r?\n/gi);
    const map = new Map(rows.map((row, rowIndex) => {
        return row.trim().split('').map((char, colIndex) => {
            if (char === '.') {
                return undefined;
            }
            return [`${colIndex},${rowIndex}`, char]
        }).filter(Boolean);
    }).flat());
    const colNum = rows[0].trim().length;
    const rowNum = rows.length;

    let hasNext = true;

    let i=0;
    while (hasNext) {
        const moveHorizontal = [...map].map((([pos, char]) => {
            if (char !== '>') return;
            const [col, row] = pos.split(',').map(Number);
            let nextRow = row;
            let nextCol = (col + 1) % colNum;
            if (map.has(`${nextCol},${nextRow}`)) {
                return;
            }
            return {
                cur: pos,
                next: `${nextCol},${nextRow}`,
                char,
            };
        })).filter(Boolean);

        for (const hori of moveHorizontal) {
            map.delete(hori.cur);
            map.set(hori.next, hori.char);
        }

        const moveVertically = [...map].map((([pos, char]) => {
            if (char === '>') return;
            const [col, row] = pos.split(',').map(Number);
            let nextRow = (row + 1) % rowNum;
            let nextCol = col;
            if (map.has(`${nextCol},${nextRow}`)) {
                return;
            }
            return {
                cur: pos,
                next: `${nextCol},${nextRow}`,
                char,
            };
        })).filter(Boolean);

        for (const verti of moveVertically) {
            map.delete(verti.cur);
            map.set(verti.next, verti.char);
        }
        hasNext = (moveHorizontal.length + moveVertically.length) > 0
        i++;
    }
    console.log(i);
});