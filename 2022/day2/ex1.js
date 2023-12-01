const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const toDo = data.toString().trim().toLowerCase().split('\n').map(x => {
        const [opponent, action] = x.trim().split(' ');
        
        return {
            opponent,
            action: action === 'x' ? 'a' : action === 'y' ? 'b' : 'c',
        };
    });
    let res = 0;
    for (const {opponent, action} of toDo) {
        res += worth[action] + score(action, opponent);
    }
    console.log(res);
});

function score(me, other) {
    const round = `${me}-${other}`;
    switch (round) {
        case 'a-a':
        case 'b-b':
        case 'c-c':
            return 3;
        case 'a-b':
        case 'b-c':
        case 'c-a':
            return 0;
        case 'a-c':
        case 'b-a':
        case 'c-b':
            return 6;
    }
}

const worth = {
    'a': 1,
    'b': 2,
    'c': 3,
};
// 12452 too low
// 14822 too low