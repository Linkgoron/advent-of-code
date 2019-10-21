const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const input = data.toString();
    let solution = input;
    for (let iter = 0; iter < 50; iter++) {
        let count = 0;
        let res = "";
        for (let letter = 0; letter < solution.length; letter++) {
            if (solution[letter] !== solution[letter + 1]) {
                res += (count + 1).toString() + solution[letter];
                count = 0;
                continue;
            }
            count++
        }
        solution = res;
    }
    console.log(solution.length)

});