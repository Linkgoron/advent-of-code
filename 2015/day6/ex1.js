const fs = require('fs');
const crypto = require('crypto');
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
    console.log(decs.size);
});

class Decorations {
    constructor(commands) {
        this.grid = new Set();
        this.commands = commands.slice();
    }

    executeAll() {
        for (const command of this.commands) {
            this.execute(command);
        }
        return new Set(this.grid);
    }

    execute(command) {
        switch (command.command) {
            case 'turn-on': {
                for (let x = command.xStart; x <= command.xEnd; x++) {
                    for (let y = command.yStart; y <= command.yEnd; y++) {
                        this.grid.add(`${x},${y}`);
                    }
                }
                return;
            }
            case 'turn-off': {
                for (let x = command.xStart; x <= command.xEnd; x++) {
                    for (let y = command.yStart; y <= command.yEnd; y++) {
                        this.grid.delete(`${x},${y}`);
                    }
                }
                return;
            }
            case 'toggle': {
                for (let x = command.xStart; x <= command.xEnd; x++) {
                    for (let y = command.yStart; y <= command.yEnd; y++) {
                        if (this.grid.has(`${x},${y}`)) {
                            this.grid.delete(`${x},${y}`);
                        } else {
                            this.grid.add(`${x},${y}`);
                        }
                    }
                }
                return;
            }
        }
    }
}