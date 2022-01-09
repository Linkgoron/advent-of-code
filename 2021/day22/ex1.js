const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const commands = data.toString().trim().split(/\r?\n/gi).map(x => {
        const row = x.trim();
        const [command, items] = x.split(' ');
        const [xToDo, yToDo, zToDo] = items.split(',').map(row => {
            const [min, max] = row.split('=')[1].split('..').map(Number);
            return {
                min,
                max
            };
        });
        if (xToDo.min > 50 || xToDo.max < -50 || yToDo.min > 50 || yToDo.max < -50 || zToDo.min > 50 || zToDo.max < -50) {
            return undefined;
        }

        return {
            command,
            x: { min: Math.max(-50, xToDo.min), max: Math.min(50, xToDo.max), },
            y: { min: Math.max(-50, yToDo.min), max: Math.min(50, yToDo.max), },
            z: { min: Math.max(-50, zToDo.min), max: Math.min(50, zToDo.max), },
        };
    }).filter(Boolean);

    let lit = new Set();
    for (const command of commands) {
        for (let x = command.x.min; x <= command.x.max; x++) {
            for (let y = command.y.min; y <= command.y.max; y++) {
                for (let z = command.z.min; z <= command.z.max; z++) {
                    if (command.command === 'on') {
                        lit.add(`${x},${y},${z}`);
                    } else {
                        lit.delete(`${x},${y},${z}`);
                    }
                }
            }
        }
    }
    console.log(lit.size);
});
