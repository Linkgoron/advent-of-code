const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allGameMaxes = data.toString().trim().split('\n').map((x, i) => {
        const id = i+1;
        const { 1: games } = x.split(': ');
        const ballsMap = games.split('; ').map(game => game.split(', ')).flat().reduce((acc, cur) => {
            const [count, name] = cur.trim().split(' ');
            if (name !== 'red' && name !== 'green' && name !== 'blue') throw new Error('bad color');
            const prevCount = acc.get(name) || 0;
            if (prevCount < Number(count)) {
                acc.set(name, Number(count));
            }
            return acc;
        }, new Map());
        return { 
            id,
            list: ballsMap,
            power: ballsMap.get('red') * ballsMap.get('green') * ballsMap.get('blue')
        };
    });
    console.log([...allGameMaxes].reduce((acc, cur) => acc + cur.power, 0));
});