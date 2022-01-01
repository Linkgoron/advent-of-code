const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const info = data.toString().split(', ').map(x=>x.split('=')[1].split('..').map(Number)).flat();
    const target = { minX: info[0], maxX: info[1], maxY: info[3], minY: info[2] };
    for (let y = 1000; y >= target.minY; y--) {
        for (let x = 0; x <= target.maxX; x++) {
            const res = isGood(x, y, target);
            if (res.success) {
                console.log(res.maxY)
                return;
            }
        }
    }
});

function isGood(x, y, box) {
    let curX = 0;
    let curY = 0;
    let velocityX = x;
    let velocityY = y;
    let maxY = 0;
    while (curX <= box.maxX && curY >= box.minY) {
        curX += velocityX;
        curY += velocityY;
        if (velocityY >= 0) {
            maxY = curY;
        }
        if (curX >= box.minX && curX <= box.maxX && curY >= box.minY && curY <= box.maxY) {
            return { success: true, maxY };
        }
        velocityX = Math.max(0, velocityX - 1);
        velocityY--;
    }
    return { success: false };
}