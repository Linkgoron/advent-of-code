const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const ingredients = data.toString().split('\r\n').map(x => x.trim().replace(",", '').replace(":", '').split(' ')).map(x => ({
        name: x[0],
        capacity: parseInt(x[2]),
        durability: parseInt(x[4]),
        flavor: parseInt(x[6]),
        texture: parseInt(x[8]),
        calories: parseInt(x[10]),
    }));
    const score = computeScore(ingredients, 0, []);
    console.log(score);
});

function computeScore(ingredients, current, teaspoons) {
    if (current === ingredients.length - 1) {
        try {
            teaspoons.push(100 - teaspoons.reduce((acc, cur) => acc + cur, 0));
            const score = ['capacity', 'durability', 'flavor', 'texture'].map(feature => {
                const featureSum = ingredients.reduce((acc, cur, i) => acc + teaspoons[i] * cur[feature], 0);
                return Math.max(featureSum, 0);
            }).reduce((acc, cur) => acc * cur, 1);

            return score;
        } finally {
            teaspoons.pop()
        }
    }

    const used = teaspoons.reduce((acc, cur) => acc + cur, 0);
    let max = 0;
    for (let i = 0; i <= 100 - used; i++) {
        teaspoons.push(i)
        const score = computeScore(ingredients, current + 1, teaspoons);
        if (score > max) {
            max = score;
        }
        teaspoons.pop()
    }
    return max;
}