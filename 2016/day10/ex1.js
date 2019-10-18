const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => x.trim()).map(row => {
        const words = row.split(' ');
        if (words[0] === 'value') {
            return {
                command: 'initial',
                value: parseInt(words[1]),
                bot: parseInt(words[words.length - 1]) + 1
            };
        }

        return {
            command: 'definition',
            bot: parseInt(words[1]) + 1,
            lowTo: (words[5] === 'output' ? -1 : 1) * (1 + parseInt(words[6])),
            highTo: (words[words.length - 2] === 'output' ? -1 : 1) * (1 + parseInt(words[words.length - 1])),
        }
    });
    const initialState = rows.filter(x => x.command === 'initial').map(x => ({
        bot: x.bot,
        value: x.value
    })).reduce((acc, cur) => {
        const key = cur.bot.toString();
        acc[key] = acc[key] || [];
        acc[key].push(cur.value);
        return acc;
    }, {});

    const bots = rows.filter(x => x.command == 'definition').map(x => ({
        bot: x.bot,
        lowTo: x.lowTo,
        highTo: x.highTo,
        holding: initialState[x.bot.toString()] || [],
        isOutput: false
    }));
    const outputList = bots.map(x => [x.highTo, x.lowTo]).flat().filter(x => x < 0)
        .map(x => [x, { holding: [], output: -x, isOutput: true }]);

    const botMap = new Map(bots.map(x => [x.bot, x]).concat(outputList))
    while (!bots.filter(x => x.holding.includes(61) && x.holding.includes(17)).length > 0) {
        const moving = bots.filter(x => x.holding.length === 2);
        for (const mover of moving) {
            mover.holding.sort((a, b) => b - a);
            const min = mover.holding.pop();
            const max = mover.holding.pop();
            botMap.get(mover.lowTo).holding.push(min);
            botMap.get(mover.highTo).holding.push(max);
        }
    }
    console.log(bots.filter(x => x.holding.includes(61) && x.holding.includes(17))[0].bot - 1);
});