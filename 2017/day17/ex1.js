const fs = require('fs');
const LinkedList = require('./utils.js');
fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const stepSize = parseInt(data.toString());
    const list = new LinkedList(0);
    for (let i = 1; i < 2018; i++) {
        list.goRight(stepSize);
        list.add(i);
    }
    list.goRight(1);
    console.log(list.pos.value);
});