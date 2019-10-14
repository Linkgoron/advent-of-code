const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const rows = rawData.toString().split('\r\n').filter(Boolean);

    for (let boost = 0; true; boost++) {
        const { res, num } = runGame(rows, boost);
        if (res === 'win') {
            console.log(`done with boost:${boost}, solution is: ${num}`);
            return;
        }
    }
});

function runGame(rows, boost) {
    const teams = {
        immune: [],
        infection: []
    }
    let currentTeam = teams.immune;
    let currentTeamName = 'immune';

    for (const row of rows) {
        if (row === 'Immune System:') {
            currentTeam = teams.immune;
            currentTeamName = 'immune';
            continue;
        }
        if (row === 'Infection:') {
            currentTeam = teams.infection;
            currentTeamName = 'infection';
            continue;
        }

        currentTeam.push(parseGroupRow(row, currentTeamName, currentTeam.length, boost))
    }

    let prevImmuneState = -1;
    let prevInfectState = -1;
    while (teams.immune.length && teams.infection.length) {
        teams.immune.sort((a, b) => b.effective - a.effective || b.initiative - a.initiative);
        teams.infection.sort((a, b) => b.effective - a.effective || b.initiative - a.initiative);
        const immuneAttack = chooseAttack(teams.immune, teams.infection);
        const infectionAttack = chooseAttack(teams.infection, teams.immune);
        const attackOrder = [...teams.immune, ...teams.infection].sort((a, b) => b.initiative - a.initiative);
        for (const attacker of attackOrder) {
            const toAttack = immuneAttack.get(attacker) || infectionAttack.get(attacker);
            if (toAttack && attacker.units > 0) {
                attacker.attack(toAttack);
            }
        }
        teams.immune = teams.immune.filter(x => x.effective > 0);
        teams.infection = teams.infection.filter(x => x.effective > 0);

        const curImmuneState = teams.immune.reduce((prev, cur) => {
            return prev + cur.units;
        }, 0);

        const curInfectState = teams.infection.reduce((prev, cur) => {
            return prev + cur.units;
        }, 0);

        if (curImmuneState == prevImmuneState && curInfectState == prevInfectState) {
            return { res: 'lose', num: curImmuneState };
        }
        prevImmuneState = curImmuneState;
        prevInfectState = curInfectState;
    }
    const curImmuneState = teams.immune.reduce((prev, cur) => {
        return prev + cur.units;
    }, 0);

    if (curImmuneState === 0) {
        return { res: 'lose', num: curImmuneState };
    } else {
        return { res: 'win', num: curImmuneState };
    }
}

function chooseAttack(attacking, defending) {
    const attackSelections = new Map();
    const attacked = new Set();
    for (const attacker of attacking) {
        const selected = defending
            .filter(rel => attacker.attackForce(rel) > 0)
            .filter(rel => !attacked.has(rel))
            .sort((a, b) => attacker.attackForce(b) - attacker.attackForce(a)
                || b.effective - a.effective
                || b.initiative - a.initiative)[0];
        if (!selected) continue;
        attacked.add(selected);
        attackSelections.set(attacker, selected);
    }

    return attackSelections;
}

function parseGroupRow(row, currentTeamName, index, boost) {
    const newRow = row.replace(/, ?/g, '|').replace('units each with', ',').replace('hit points', ',')
        .replace('with an attack that does', ',').replace('damage at initiative', ',')
        .split(",").map(x => x.trim());

    const units = parseInt(newRow[0]);
    const hp = parseInt(newRow[1]);
    const initiative = parseInt(newRow[4]);
    const damage = parseInt(newRow[3].split(' ')[0]);
    const damagetype = newRow[3].split(' ')[1];
    const powers = {
        weak: new Set(),
        immune: new Set()
    }

    if (newRow[2]) {
        const aux = newRow[2].split('; ').map(x => x.replace('(', '').replace(')', ''));
        for (const rawPowers of aux) {
            const state = rawPowers.split(' ')[0];
            const types = rawPowers.split('to ')[1].split('|');
            powers[state] = new Set(types);
        }
    }

    return {
        units, hp, initiative, damage, damagetype, weak: powers.weak, immune: powers.immune, index: index + 1,
        team: currentTeamName,
        get effective() {
            const localBoost = this.team === 'immune' ? boost : 0;
            return this.units * (this.damage + localBoost);
        },

        attackForce(otherTeam) {
            if (otherTeam.immune.has(this.damagetype)) return 0;
            const modifier = otherTeam.weak.has(this.damagetype) ? 2 : 1;
            return this.effective * modifier;
        },

        attack(otherTeam) {
            const totalForce = this.attackForce(otherTeam);
            const removedUnits = Math.min(otherTeam.units, Math.floor(totalForce / otherTeam.hp));
            otherTeam.units = otherTeam.units - removedUnits;
        }
    };
}