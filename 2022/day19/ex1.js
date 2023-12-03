const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const plans = data.toString().trim().split(/\r?\n/).map((row, i) => {
        const { 1: info } = row.split(': ');
        const [rawOreBot, rawClayBot, rawObsidianBot, rawGeodeBot] = info.trim().split('. ');
        const { 4: oreBotCost } = rawOreBot.trim().split(' ');
        const { 4: clayBotCost } = rawClayBot.trim().split(' ');
        const { 4: obsidianOreCost, 7: obsidianClayCost } = rawObsidianBot.trim().split(' ');
        const { 4: geodeOreCost, 7: geodeObsidianCost } = rawGeodeBot.trim().split(' ');
        return {
            id: i + 1,
            ore: { ore: Number(oreBotCost) },
            clay: { ore: Number(clayBotCost) },
            obsidian: { ore: Number(obsidianOreCost), clay: Number(obsidianClayCost) },
            geode: { ore: Number(geodeOreCost), obsidian: Number(geodeObsidianCost) },
        }
    });
    const values = [];
    for (const plan of plans) {
        const initalState = {
            bots: {
                ore: 1,
                clay: 0,
                obsidian: 0,
                geode: 0
            },
            minerals: {
                ore: 0,
                clay: 0,
                obsidian: 0,
                geode: 0,
            },
            skipped: {
                ore: false,
                clay: false,
                obsidian: false,
                geode: false,
            }
        }
        let states = new Map([[hashify(initalState), initalState]]);
        let maybeMax = 0;
        for (let i = 0; i < 24; i++) {
            const nextStates = new Map();
            for (const origState of states.values()) {
                const expectedMax = origState.minerals.geode + origState.bots.geode * (24 - i);
                if (expectedMax > maybeMax) {
                    maybeMax = origState.minerals.geode + origState.bots.geode * (24 - i);
                }
                if (i > 15) {
                    if ((24 - i) * (Math.floor((24 - i) / 3) + origState.bots.geode) + origState.minerals.geode < maybeMax) {
                        continue;
                    }
                }
                const state = cloneState(origState);
                const canBuy = getCanBuy(state, plan);
                for (const option of oreTypes) {
                    if (!canBuy.includes(option)) {
                        state.skipped[option] = false;
                    }
                }

                for (const option of oreTypes) {
                    state.minerals[option] += state.bots[option];
                }

                if (canBuy.length) {
                    const noBuyOption = cloneState(state);
                    for (const option of canBuy) {
                        noBuyOption.skipped[option] = true;
                    }
                    nextStates.set(hashify(noBuyOption), noBuyOption);
                    for (const option of canBuy) {
                        if (!state.skipped[option]) {
                            const buyOptionState = cloneState(state);
                            const costs = plan[option];
                            for (const botType of oreTypes) {
                                buyOptionState.minerals[botType] -= (costs[botType] || 0);
                            }
                            buyOptionState.bots[option] += 1;
                            for (const option of oreTypes) {
                                buyOptionState.skipped[option] = false;
                            }
                            nextStates.set(hashify(buyOptionState), buyOptionState);
                        }
                    }
                } else {
                    nextStates.set(hashify(state), state);
                }
            }
            states = nextStates;
        }

        const maxGeode = [...states.values()].map(x => x.minerals.geode).reduce((a, b) => a > b ? a : b, 0);
        values.push(plan.id * maxGeode);
    }
    console.log(values.reduce((a, b) => a + b, 0));
});

function getCanBuy(state, plan) {
    let whatCanIBuy = [];

    for (const type of oreTypes) {
        const botCost = plan[type];
        const canBuy = oreTypes.every(toUse => state.minerals[toUse] >= (botCost[toUse] || 0));
        if (canBuy) {
            whatCanIBuy.push(type)
        }
    }

    return whatCanIBuy;
}

function cloneState(state) {
    return {
        bots: {
            ...state.bots,
        },
        minerals: {
            ...state.minerals,
        },
        skipped: {
            ...state.skipped,
        }
    }
}
const oreTypes = ['ore', 'clay', 'obsidian', 'geode'];

function hashify(state) {
    const botHash = oreTypes.map(x => `${x}, ${state.bots[x]}`).join('-');
    const mineralsHash = oreTypes.map(x => `${x}, ${state.minerals[x]}`).join('-');
    return `${botHash}, ${mineralsHash};`
}