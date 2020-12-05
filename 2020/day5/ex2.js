const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const passangers = data.toString().trim().split('\n').map(x => {
        const row = parseInt(x.substring(0, 7).replace(/F/g, '0').replace(/B/g, '1'), 2);
        const column = parseInt(x.substring(7).replace(/L/g, '0').replace(/R/g, '1'), 2);
        return {
            row,
            seat: column,
            seatId: (row * 8) + column,
        };
    });

    const seatIds = new Set(passangers.map(x => x.seatId));

    for (let i = 0; i < 127; i++) {
        for (let j = 0; j < 8; j++) {
            const seatId = i * 8 + j;
            if (!seatIds.has(seatId) && seatIds.has(seatId - 1) && seatIds.has(seatId + 1)) {
                console.log(seatId);
            }
        }
    }
});