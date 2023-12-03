const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const actions = data.toString().trim().split(/\r?\n/).map((row) => {
        const [dir, num] = row.split(' ');
        return {
            dir,
            num: Number(num),
        }
    });

    const pos = {
        tail: {
            x: 0,
            y: 0,
        }, head: {
            x: 0,
            y: 0
        }
    }

    let positions = new Set();
    positions.add(keyString(pos.tail.x,pos.tail.y));
    for (const act of actions) {
        let { dir, num } = act;
        let move = change[dir];
        for (let i = 0; i < num; i++) {
            const newPos = { x: pos.head.x + move.x, y: pos.head.y + move.y };           
            const isFar = (Math.abs(newPos.x - pos.tail.x) === 2) || (Math.abs(newPos.y - pos.tail.y) === 2)
            if (isFar) {
                const xMove = pos.tail.x === newPos.x ? 0 : (newPos.x > pos.tail.x ? 1 : -1);
                const yMove = pos.tail.y === newPos.y ? 0 : (newPos.y > pos.tail.y ? 1 : -1);
                pos.tail.x = pos.tail.x + xMove;
                pos.tail.y = pos.tail.y + yMove;
                positions.add(keyString(pos.tail.x,pos.tail.y));
            }
            pos.head = newPos;
        }
    }
    console.log(positions.size);
});

const change = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    R: { x: 1, y: 0 },
    L: { x: -1, y: 0 }
}

function keyString(x,y) {
    return `${x},${y}`;
}