const fs = require('fs');

const store = {
    weapons: [
        { name: "Dagger", cost: 8, damage: 4, armor: 0 },
        { name: "Shortsword", cost: 10, damage: 5, armor: 0 },
        { name: "Warhammer", cost: 25, damage: 6, armor: 0 },
        { name: "Longsword", cost: 40, damage: 7, armor: 0 },
        { name: "Greataxe", cost: 74, damage: 8, armor: 0 }
    ],
    armor: [
        { name: "Leather", cost: 13, damage: 0, armor: 1 },
        { name: "Chainmail", cost: 31, damage: 0, armor: 2 },
        { name: "Splintmail", cost: 53, damage: 0, armor: 3 },
        { name: "Bandedmail", cost: 75, damage: 0, armor: 4 },
        { name: "Platemail", cost: 102, damage: 0, armor: 5 }
    ],
    rings: [
        { name: "Damage +1", cost: 25, damage: 1, armor: 0 },
        { name: "Damage +2", cost: 50, damage: 2, armor: 0 },
        { name: "Damage +3", cost: 100, damage: 3, armor: 0 },
        { name: "Defense +1", cost: 20, damage: 0, armor: 1 },
        { name: "Defense +2", cost: 40, damage: 0, armor: 2 },
        { name: "Defense +3", cost: 80, damage: 0, armor: 3 }
    ]
}

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => parseInt(x.trim().split(': ')[1]));
    const boss = {
        hp: parseInt(rows[0]),
        damage: parseInt(rows[1]),
        armor: parseInt(rows[2])
    };
    const turnsToKill = (attack, armor, hp) => Math.ceil(hp / Math.max(1, attack - armor));
    const allBuilds = [...getBuilds()]
    const results = allBuilds.filter(([_, attack, defence]) => {
        const turnsToKillBoss = turnsToKill(attack, boss.armor, boss.hp);
        const turnsToKillPlayer = turnsToKill(boss.damage, defence, 100);
        return turnsToKillPlayer < turnsToKillBoss;
    });
    console.log(results.sort((a, b) => b[0] - a[0]));
    function* getBuilds() {
        for (const weapon of store.weapons) {
            yield [weapon.cost, weapon.damage, 0];

            for (const armor of store.armor) {
                const weaponArmorCost = weapon.cost + armor.cost;
                yield [weaponArmorCost, weapon.damage, armor.armor];

                for (let i = 0; i < store.rings.length; i++) {
                    const firstRing = store.rings[i];
                    yield [weaponArmorCost + firstRing.cost, weapon.damage + firstRing.damage, armor.armor + firstRing.armor];
                    for (let j = i + 1; j < store.rings.length; j++) {
                        const secondRing = store.rings[j];
                        const curCost = weaponArmorCost + firstRing.cost + secondRing.cost;
                        const curDamage = weapon.damage + firstRing.damage + secondRing.damage;
                        const curArmor = armor.armor + firstRing.armor + secondRing.armor;
                        yield [curCost, curDamage, curArmor];
                        yield [curCost - armor.cost, curDamage, curArmor - armor.armor];
                    }
                }
            }
        }
    }
});