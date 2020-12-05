const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const passangers = data.toString().trim().split('\n').map(x => {
        const row = parseInt(x.substring(0, 7).replace(/F/g, '0').replace(/B/g, '1'),2);
        const column = parseInt(x.substring(7).replace(/L/g, '0').replace(/R/g, '1'),2);
        return {
            row,
            seat: column,
            seatId: (row * 8) + column,
        };
    });
    
    console.log(Math.max(...passangers.map(x=>x.seatId)));
});