const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const allPoints = data.toString().split('\r\n');
    const endingPoint = allPoints[allPoints.length - 1];
    const rules = allPoints.slice(0, allPoints.length - 2).map(row => row.split(' => ')).map(row => ({
        from: row[1],
        to: row[0]
    })).sort((a, b) => (b.from.length - b.to.length) - (a.from.length - a.to.length));

    const visited = new Set([endingPoint]);
    const toVisit = new Set([{ str: endingPoint, step: 0 }])
    while (toVisit.size > 0) {
        const visiting = [...toVisit].sort((a, b) => a.str.length - b.str.length)[0]
        toVisit.delete(visiting);
        const { str: current, step } = visiting;
        if (current === 'e') {
            console.log('DONE', current, step);
            return;
        }
        console.log(current.length, step, current);
        // console.log(current, current.length, step)
        for (const rule of rules) {
            for (let i = 0; i < current.length; i++) {
                let match = true;
                for (let j = 0; j < rule.from.length; j++) {
                    if (current[i + j] !== rule.from[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    const nextWord = current.substring(0, i) + rule.to + current.substring(i + rule.from.length);
                    if (!visited.has(nextWord)) {
                        const anyBetter = [...visited].some(prefix => nextWord.startsWith(prefix));
                        if (!anyBetter) {
                            visited.add(nextWord);
                            toVisit.add({ str: nextWord, step: step + 1 });
                        }
                    }
                }
            }
        }
    }
    console.log('failed');
});