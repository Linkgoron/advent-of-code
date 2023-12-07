const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const [rawSeeds, ...rawMappings] = data.toString().trim().split('\n\n').map(x => x.trim());
    const seeds = rawSeeds.split(': ')[1].split(' ').map(Number);    
    const transformerSets = rawMappings.map(category => category.split('\n').filter((a,i) => i > 0).map(x=>{
        const info = x.split(' ').map(Number);
        return {
            destStart: info[0],
            sourceStart: info[1],
            destEnd: info[0] + info[2],
            sourceEnd: info[1] + info[2],
            match(input) {
                return input >= this.sourceStart && input < this.sourceEnd;  
            },
            transform(input) {
                return this.destStart + (input - this.sourceStart);
            }
        }
    }));
    
    let min = Number.MAX_VALUE;
    for (const seed of seeds) {
        let currentValue = seed;
        for (const step of transformerSets) {
            let transformer = step.find(x=>x.match(currentValue));
            if (transformer) {
                currentValue = transformer.transform(currentValue);
            }
        }
        if (min > currentValue) {
            min = currentValue;
        }
    }
    console.log(min);
});
