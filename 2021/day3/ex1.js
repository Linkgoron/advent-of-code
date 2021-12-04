const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split('\n').map(x => x.trim());
    let gammaString = '';
    let epsilonString = '';
    for (let i = 0; i < lines[0].length; i++) {
        const numOfZers = lines.map(x => x[i]).filter(x => x === '0').length;
        if (numOfZers > lines.length / 2) {
            gammaString += '0';
            epsilonString += '1';
        } else {
            gammaString += '1';
            epsilonString += '0';
        }
    }
    const gammaRate = parseInt(gammaString,2);
    const epsilon = parseInt(epsilonString,2);
    const powerConsumption = gammaRate * epsilon;
    console.log(gammaRate, epsilon, powerConsumption);
});