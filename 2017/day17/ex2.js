const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const stepSize = parseInt(data.toString());
    const totalAmount = 50000000;
    let lastNumber1 = 1;
    let pos = 0;
    let size = 1;    
    for (let i = 1; i < totalAmount; i++) {
        pos = (pos + stepSize) % size;
        size++;
        pos++;
        if (pos === 1) {
            lastNumber1 = i;
        }
    }
    console.log(lastNumber1);
});