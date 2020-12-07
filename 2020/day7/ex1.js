const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const bagsList = data.toString().trim().split(/\r?\n/gm).map(x => {
        const [almostBagName, contains] = x.split(' contain');
        const bagName = almostBagName.replace(' bags', '');
        const bagStuff = contains.replace(/[\.,]/g, '').split(/bags?/g).map(x => x.trim()).filter(x => x !== '' && x !== 'no other');
        const heldBags = bagStuff.map(x => {
            const numberEnd = x.indexOf(' ');
            return {
                amount: Number(x.substring(0, numberEnd)),
                type: x.substring(numberEnd + 1).trim()
            }
        });
        return {
            bagName,
            heldBags,
            bagSet: new Set(heldBags.map(x => x.type)),
            containedIn: new Set(),
        }
    });
    for (const bag of bagsList) {
        bag.containedIn = new Set(bagsList.filter(row => row.bagSet.has(bag.bagName)));
    }
    const gold = bagsList.find(x=>x.bagName === 'shiny gold');

    const visited = new Set(gold.containedIn);
    for(const toVisit of visited) {
        for(const item of toVisit.containedIn) {
            visited.add(item);
        }
    }
    console.log([...visited].length);
});