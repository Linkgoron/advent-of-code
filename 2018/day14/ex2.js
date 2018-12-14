const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const finishAt = rawData.toString();
    const recipes = [3, 7];
    let [firstLocation, secondLocation] = [0, 1];
    let res = 0;
    for (let i = 0; res === 0; i++) {
        const newRecipeSum = recipes[firstLocation] + recipes[secondLocation];
        for (const rec of newRecipeSum.toString().split('').map(r => parseInt(r))) recipes.push(rec);
        firstLocation = (recipes[firstLocation] + firstLocation + 1) % recipes.length;
        secondLocation = (recipes[secondLocation] + secondLocation + 1) % recipes.length;

        const firstOption = recipes.slice(recipes.length - finishAt.length);
        const secondOption = recipes.slice(recipes.length - finishAt.length - 1, recipes.length - 1);
        if (secondOption.join('') === finishAt) res = recipes.length - finishAt.length - 1;
        else if (firstOption.join('') === finishAt) res = recipes.length - finishAt.length;
    }
    console.log(res);
});