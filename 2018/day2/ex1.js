const fs = require('fs');
const _ = require('lodash');

fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const words = actualInput.split('\n').map(x => x.trim());
    let hasTwo = 0;
    let hasThree = 0;
    for (const word of words) {
        const letters = _.groupBy(word.split(''));
        const letterGroups = Object.values(letters);
        if (letterGroups.some(x => x.length == 2)) {
            hasTwo++;
        }
        if (letterGroups.some(x => x.length == 3)) {
            hasThree++;
        }
    }
    console.log('2', hasTwo);
    console.log('3', hasThree);
    console.log('mul', hasTwo * hasThree);
});
