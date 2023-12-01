const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const actions = data.toString().trim().split(/\r?\n/).map((row) => {
        const [dir, num] = row.split(' ');
        return {
            dir,
            num: Number(num),
        }
    });

    let currentPositions = []
    const partsNum = 10;
    for (let i = 0; i < partsNum; i++) {
        currentPositions.push({ x: 0, y: 0, name: i })
    }

    const tailSeen = new Set([keyString(0, 0)]);
    for (const act of actions) {
        const { dir, num } = act;
        const move = change[dir];
        for (let i = 0; i < num; i++) {
            let newPositions = [{ x: currentPositions[0].x + move.x, y: currentPositions[0].y + move.y, name: 0 }];
            for (let p = 1; p < partsNum; p++) {
                const currentPos = { x: currentPositions[p].x, y: currentPositions[p].y, name : currentPositions[p].name };
                const nextPos = { ...currentPos };
                const parentPos = newPositions[p - 1];
                const isFar = (Math.abs(parentPos.x - currentPos.x) === 2) || (Math.abs(parentPos.y - currentPos.y) === 2)
                if (isFar) {
                    const xMove = nextPos.x === parentPos.x ? 0 : (parentPos.x > nextPos.x ? 1 : -1);
                    const yMove = nextPos.y === parentPos.y ? 0 : (parentPos.y > nextPos.y ? 1 : -1);
                    nextPos.x = nextPos.x + xMove;
                    nextPos.y = nextPos.y + yMove;
                }
                newPositions.push(nextPos);
            }
            currentPositions = newPositions;
            tailSeen.add(keyString(currentPositions[partsNum - 1].x, currentPositions[partsNum - 1].y));
        }
    }
    console.log(tailSeen.size);
});

const change = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    R: { x: 1, y: 0 },
    L: { x: -1, y: 0 }
}

function keyString(x, y) {
    return `${x},${y}`;
}