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
            contains: new Set(),
        }
    });
    for (const bag of bagsList) {
        bag.containedIn = new Set(bagsList.filter(row => row.bagSet.has(bag.bagName)));
        bag.contains = new Set([...bag.bagSet].map(bagName => bagsList.find(x => x.bagName === bagName)));
    }
    const gold = bagsList.find(x => x.bagName === 'shiny gold');
    const count = countAll(gold);
    const containedIn = count - 1;
    console.log(containedIn);
});

function countAll(bag) {
    let bagCount = 1;
    for (const innerBag of bag.contains) {
        const count = bag.heldBags.find(x => x.type === innerBag.bagName).amount;
        bagCount += count * countAll(innerBag);
    }
    return bagCount;
}