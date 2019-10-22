const fs = require('fs');

const spells = {
    MagicMissile: {
        mana: 53,
        damage: 4
    },
    drain: {
        mana: 73,
        damage: 2,
        hp: 2
    },
    shield: {
        mana: 113,
        effect() {
            return {
                name: 'shield',
                armor: 7,
                turns: 6
            }
        }
    },
    poison: {
        mana: 173,
        effect() {
            return {
                name: 'poison',
                damage: 3,
                turns: 6
            }
        },
    },
    recharge: {
        mana: 229,
        effect() {
            return {
                name: 'recharge',
                mana: 101,
                turns: 5
            }
        }
    }
}

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rows = data.toString().split('\r\n').map(x => parseInt(x.trim().split(': ')[1]));
    const boss = {
        hp: parseInt(rows[0]),
        damage: parseInt(rows[1])
    };
    const initialState = {
        hp: 50,
        boss: boss.hp,
        bossDamage: boss.damage,
        mana: 500,
        manaSpent: 0,
        effects: []
    };
    const states = new Set([initialState]);
    let min = 3000;
    for (const state of states) {
        const currentEffects = new Set(state.effects.filter(x => x.name && x.turns > 1).map(x => x.name));
        const actions = Object.entries(spells).filter(([name, x]) => state.mana >= x.mana && !currentEffects.has(name)).map(x => x[1]);
        if (actions.length === 0 || state.manaSpent > min) {
            continue;
        }
        for (const action of actions) {
            const nextState = doPlayerAction(state, action);
            if (nextState.boss <= 0) {
                if (nextState.manaSpent < min) {
                    min = nextState.manaSpent;
                }
                continue;
            }

            doBossAction(nextState);

            if (nextState.hp <= 0) {
                continue;
            }

            if (nextState.boss <= 0) {
                if (nextState.manaSpent < min) {
                    min = nextState.manaSpent;
                }
                continue;
            }
            states.add(nextState);
        }
    }
    console.log(min);
});

function doPlayerAction(prevState, action) {
    const nextState = { ...prevState, effects: prevState.effects.map(x => ({ ...x })) }
    nextState.mana -= action.mana;
    nextState.manaSpent += action.mana;
    if (action.damage) {
        nextState.boss -= action.damage
    }
    if (action.hp) {
        nextState.hp += action.hp;
    }
    for (const effect of nextState.effects) {
        effect.turns--;
        if (effect.damage) {
            nextState.boss -= effect.damage;
        }

        if (effect.mana) {
            nextState.mana += effect.mana;
        }
    }
    nextState.effects = nextState.effects.filter(effect => effect.turns > 0);
    if (action.effect) {
        nextState.effects.push(action.effect())
    }

    return nextState;
}

function doBossAction(state) {
    for (const effect of state.effects) {
        effect.turns--;
        if (effect.damage) {
            state.boss -= effect.damage;
        }

        if (effect.mana) {
            state.mana += effect.mana;
        }
    }

    if (state.boss >= 0) {
        const extraDefence = state.effects.filter(x => x.armor).reduce((acc, cur) => acc + cur.armor, 0);
        state.hp -= Math.max(1, state.bossDamage - extraDefence);
    }
    state.effects = state.effects.filter(effect => effect.turns > 0);
    return state;
}