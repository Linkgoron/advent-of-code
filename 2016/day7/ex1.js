const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const words = data.toString().split('\r\n').map(x => x.trim());
    const abbas = words.filter(x => {
        x = x + '[';
        const mapped = x.replace(/[\[\]]/g, x => `${x} `).split(' ').filter(Boolean);
        const cantHaveAbba = mapped.filter(word => word[word.length - 1] === ']');
        const canHaveAbba = mapped.filter(word => word[word.length - 1] === '[');
        return canHaveAbba.some(x => isAbba(x)) && !cantHaveAbba.some(x => isAbba(x))
    });
    console.log(abbas.length);
});

function isAbba(word) {
    for (let i = 0; i < word.length - 3; i++) {
        if (word[i] === word[i + 3] && word[i + 1] === word[i + 2] && word[i] !== word[i + 1]) {
            return true;
        }
    }
    return false;
}