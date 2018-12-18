const fs = require('fs');
const key = (x, y) => `${x},${y}`;
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const nodes = rawData.toString().split('\n').map(x => x.trim())
        .map((r, y) => r.split('').map((n, x) => ({ x, y, infected: n === '#', key: key(x, y) })))
        .reduce((acc, item) => acc.concat(item), []);
    const map = new Map();
    for (const node of nodes) {
        map.set(node.key, node)
    }
    const virus = {
        x: Math.max(...nodes.map(x => x.x)) / 2,
        y: Math.max(...nodes.map(x => x.y)) / 2,
        facing: 'up',
        turnRight() {
            if (this.facing === 'up') this.facing = 'right';
            else if (this.facing === 'right') this.facing = 'down';
            else if (this.facing === 'down') this.facing = 'left';
            else if (this.facing === 'left') this.facing = 'up';
        },
        turnLeft() {
            if (this.facing === 'right') this.facing = 'up';
            else if (this.facing === 'down') this.facing = 'right';
            else if (this.facing === 'left') this.facing = 'down';
            else if (this.facing === 'up') this.facing = 'left';
        },
        goForward() {
            if (this.facing === 'right') this.x++
            else if (this.facing === 'down') this.y++
            else if (this.facing === 'left') this.x--;
            else if (this.facing === 'up') this.y--;
        },
        get key() { return key(this.x, this.y); },
        get node() { return map.get(this.key); }
    };
    let infected = 0;    
    for (let i = 0; i < 10000; i++) {
        if (virus.node.infected) {
            virus.turnRight();
            virus.node.infected = false;
        } else {
            virus.turnLeft();
            virus.node.infected = true;
            infected++;
        }
        virus.goForward();
        if (virus.node === undefined) {
            map.set(virus.key, { x: virus.x, y: virus.y, infected: false, key: virus.key });
        }
    }

    console.log(infected);

});