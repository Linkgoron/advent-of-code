const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const info = data.toString().split('\r\n').map(x => x.trim()).map(x => x.split(' ')).map(row => ({
        command: row[0] === 'turn' ? `turn-${row[1]}` : `toggle`,
        xStart: row[0] === 'turn' ? parseInt(row[2].split(',')[0]) : parseInt(row[1].split(',')[0]),
        xEnd: row[0] === 'turn' ? parseInt(row[4].split(',')[0]) : parseInt(row[3].split(',')[0]),
        yStart: row[0] === 'turn' ? parseInt(row[2].split(',')[1]) : parseInt(row[1].split(',')[1]),
        yEnd: row[0] === 'turn' ? parseInt(row[4].split(',')[1]) : parseInt(row[3].split(',')[1])
    }));
    const decorations = new Decorations(info);
    const decs = decorations.executeAll();
    console.log([...decs.values()].reduce((acc, x) => acc + x, 0));
});

class Decorations {
    constructor(commands) {
        this.grid = new Map();
        this.commands = commands.slice();
    }

    executeAll() {
        for (const command of this.commands) {
            this.execute(command);
        }
        return new Map(this.grid);
    }

    decrease(x, y, by = 1) {
        const index = `${x},${y}`;
        const currentLevel = this.grid.get(index) || 0;
        this.grid.set(index, Math.max(0, currentLevel - by));
    }

    increase(x, y, by = 1) {
        const index = `${x},${y}`;
        const currentLevel = this.grid.get(index) || 0;
        this.grid.set(index, currentLevel + by);
    }

    execute(command) {
        switch (command.command) {
            case 'turn-on': {
                for (let x = command.xStart; x <= command.xEnd; x++) {
                    for (let y = command.yStart; y <= command.yEnd; y++) {
                        this.increase(x, y, 1);
                    }
                }
                return;
            }
            case 'turn-off': {
                for (let x = command.xStart; x <= command.xEnd; x++) {
                    for (let y = command.yStart; y <= command.yEnd; y++) {
                        this.decrease(x, y, 1);
                    }
                }
                return;
            }
            case 'toggle': {
                for (let x = command.xStart; x <= command.xEnd; x++) {
                    for (let y = command.yStart; y <= command.yEnd; y++) {
                        this.increase(x, y, 2);
                    }
                }
                return;
            }
        }
    }
}