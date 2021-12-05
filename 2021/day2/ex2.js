const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rules = data.toString().trim().split('\n').map(x => {
        const [direction, value] = x.split(' ');
        return {
            direction,
            distance: Number(value),
        };
    });

    let aim = 0;
    let horizontal = 0;
    let depth = 0;

    for (const rule of rules) {
        switch (rule.direction) {
            case 'forward': {
                horizontal += rule.distance;
                depth += (aim * rule.distance);
                break;
            }
            case 'up': {
                aim -= rule.distance;
                break;
            }
            case 'down': {
                aim += rule.distance;
                break;
            }
        }
    }
    console.log(horizontal * depth);
});