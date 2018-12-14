const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const finishAt = parseInt(rawData.toString());
    const recipes = [3, 7];
    let firstLocation = 0, secondLocation = 1;
    for (let i = 0; recipes.length < (finishAt + 10); i++) {
        const newRecipeSum = recipes[firstLocation] + recipes[secondLocation];
        for (const rec of newRecipeSum.toString().split('').map(r => parseInt(r))) recipes.push(rec);
        firstLocation = (recipes[firstLocation] + firstLocation + 1) % recipes.length;
        secondLocation = (recipes[secondLocation] + secondLocation + 1) % recipes.length;
    }

    console.log(recipes.slice(finishAt, finishAt + 10).join(''));
});