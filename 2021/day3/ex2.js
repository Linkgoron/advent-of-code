const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split('\n').map(x => x.trim());
    const co2 = findMostCommon(lines);
    const oxygen = findLeastCommon(lines);
    const lifeSupport = co2 * oxygen;
    console.log(co2, oxygen, lifeSupport);
});

function findMostCommon(numbers) {
    let pool = numbers;

    for (let i = 0; pool.length > 1 && i < pool[0].length; i++) {
        const numOfZers = pool.map(x => x[i]).filter(x => x === '0').length;
        const mostCommon = (numOfZers > pool.length / 2) ? '0' : '1';
        pool = pool.filter(x => x[i] === mostCommon);
    }
    if (pool.length !== 1) {
        throw new Error('something went wrong');
    }
    return parseInt(pool[0], 2);
}


function findLeastCommon(numbers) {
    let pool = numbers;

    for (let i = 0; pool.length > 1 && i < pool[0].length; i++) {
        const numOfZers = pool.map(x => x[i]).filter(x => x === '0').length;
        const leastCommon = (numOfZers <= pool.length / 2) ? '0' : '1';
        pool = pool.filter(x => x[i] === leastCommon);
    }
    if (pool.length !== 1) {
        throw new Error('something went wrong');
    }
    return parseInt(pool[0], 2);
}