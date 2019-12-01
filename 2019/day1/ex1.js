const fs = require('fs');
fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const values = actualInput.split('\n').map(x => Math.floor(parseInt(x.trim())/3)-2);
    const sum = values.reduce((acc,val)=>acc+val,0);
    console.log(sum);
});
