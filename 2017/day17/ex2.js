const fs = require('fs');
const LinkedList = require('./utils.js');
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const list = new LinkedList(0);
    const firsts = new Set([1]);
    const totalAmount = 50000001;
    for (let i = 1; i < totalAmount; i++) {
        list.goRight(316);
        if (list.pos.value === 0) {
            firsts.add(i);
            console.log('replace', firsts);
        }
        if ((i % 1000000) === 0) {
            console.log(i / totalAmount * 100);            
        }
        list.add(i);
    }

    // sol is: 13326437
    console.log(0, list.head.next.value);    
});