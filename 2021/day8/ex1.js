const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split('\n').map(x => {
        const [entries, displayed] = x.split(' | ');
        return {
            entries: entries.split(' '),
            displayed: displayed.split(' '),
        }
    }).flat();
    const l = lines.map(x=>x.displayed).flat().filter( x=> [2,3,4,7].includes(x.length)).length;
    console.log(l);
});