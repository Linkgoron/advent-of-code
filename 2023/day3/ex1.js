const fs = require('fs');

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allRows = data.toString().trim().split('\n').map(x => x.trim());
    const partNumbers = new Map();
    for (let curRow = 0; curRow < allRows.length; curRow++) {
        const currentRow = allRows[curRow];
        for (let curCol = 0; curCol < currentRow.length; curCol++) {
            let posChar = currentRow[curCol];
            if (posChar === '.' || numbers.includes(posChar)) continue;            
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    const row = curRow + i;
                    const col = curCol + j;
                    const rowToLook = allRows[row];
                    if (!rowToLook) continue;
                    const curChar = rowToLook[col];
                    if (!curChar) continue;
                    if (!numbers.includes(curChar)) continue;
                    const val = getNumber(rowToLook, col);
                    partNumbers.set(`${row}, ${val.coordinates}`, val.value);
                }
            }
        }
    }
    const sum = [...partNumbers.values()].reduce((acc, cur) => acc + cur, 0);
    console.log(partNumbers, sum);
});

function getNumber(rowToLook, col) {
    let numStart = col;    
    let numEnd = col;
    for (; numbers.includes(rowToLook[numStart - 1]);numStart--);
    for (; numbers.includes(rowToLook[numEnd]);numEnd++);
    return { coordinates: `${numStart}, ${numEnd}`, value: Number(rowToLook.substring(numStart, numEnd)) };
}