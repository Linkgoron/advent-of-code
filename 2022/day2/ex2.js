const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const toDo = data.toString().trim().toLowerCase().split('\n').map(x => {
        const [opponent, result] = x.trim().split(' ');
        
        return {
            opponent,
            result,
        };
    });
    let res = 0;
    for (const {opponent, result} of toDo) {
        const action = wantedShape(opponent, result);
        res += worth[action] + score(action, opponent);
    }
    console.log(res);
});

function wantedShape(other, result) {
    if (result === 'x') {
        return other === 'a' ? 'c' : (other === 'b' ? 'a' : 'b');
    }

    if (result === 'y') {
        return other;
    }

    if (result === 'z') {
        return other === 'a' ? 'b' : (other === 'b' ? 'c' : 'a');
    }
}

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


// 14644 too high