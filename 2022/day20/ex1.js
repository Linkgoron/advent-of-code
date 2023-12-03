const fs = require('fs');
const { IndexedLinkedList } = require('./utils');
fs.promises.readFile('./ex.input').then(data => {
    const numbers = data.toString().trim().split(/\r?\n/).map(Number);
    const res = new IndexedLinkedList(numbers[0]);
    let zeroIndex;
    if (numbers[0] === 0) {
        zeroIndex = 0;
    }
    for (let i = 1; i < numbers.length; i++) {
        res.add(numbers[i]);
        if (numbers[i] === 0) {
            zeroIndex = i;
        }
    }
    
    for (let i = 0; i < numbers.length; i++) {
        res.pointTo(i);
        res.move();
    }
    let sum = 0;
    res.pointTo(zeroIndex)
    res.goRight(1000);
    sum += res.currentValue();
    console.log(res.currentValue())
    res.goRight(1000);
    sum += res.currentValue();
    console.log(res.currentValue())
    res.goRight(1000);
    sum += res.currentValue();
    console.log(res.currentValue())
    console.log(sum);
});

// 6480 too low