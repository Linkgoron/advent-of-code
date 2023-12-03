const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const nodes = data.toString().trim().split(/\r?\n/).map(row => {
        const [nameRate, to] = row.split('; ');
        const { 1: name, 4: rawRate } = nameRate.split(' ');
        const rate = Number(rawRate.split('=')[1]);
        return {
            name,
            rate,
            to: to.replace(/tunnels? leads? to valves? /, '').trim().split(', '),
            fake: rate === 0,
            realDistance: new Map(),
        }
    });
    const realNodes = buildSmall(nodes);
    const relevantTargets = realNodes.filter(x => x.name !== 'AA');
    const startNode = realNodes.find(x => x.name === 'AA');
    let max = { huPos: { when: 0, node: startNode }, elPos: { when: 0, node: startNode }, turnedOn: new Set(), time: 0, rate: 0, areOnKey: '' };
    const byTime = new Map([[0, [{ huPos: { when: 0, node: startNode }, elPos: { when: 0, node: startNode }, turnedOn: new Set(), time: 0, rate: 0, areOnKey: '' }]]]);
    for (let i = 1; i < 26; i++) {
        byTime.set(i, []);
    }
    
    for (const [time, values] of byTime) {
        console.log(time);
        byTime.delete(time - 1);
        const stateMap = new Map();
        for (const value of values) {
            const areOnKey = value.areOnKey;
            const stateKey = `${value.huPos.node.name}, ${value.elPos.node.name}, ${areOnKey}`;
            const otherStateKey = `${value.elPos.node.name}, ${value.huPos.node.name}, ${areOnKey}`;
            if (stateMap.has(stateKey)) {
                const otherState = stateMap.get(stateKey);
                if (otherState.rate < value.rate) {
                    stateMap.set(stateKey, value);
                }
            } else if (stateMap.has(otherStateKey)) {
                const otherState = stateMap.get(otherStateKey);
                if (otherState.rate < value.rate) {
                    stateMap.set(otherStateKey, value);
                }
            } else {
                stateMap.set(stateKey, value);
            }
        }
        for (const currentState of stateMap.values()) {
            let afterOnState = { ...currentState };
            const newOn = new Set(currentState.turnedOn);
            if (currentState.time === currentState.huPos.when) {
                if (!newOn.has(currentState.huPos.node)) {
                    afterOnState.rate += (26 - currentState.time) * currentState.huPos.node.rate;
                }
                newOn.add(currentState.huPos.node);
            }

            if (currentState.time === currentState.elPos.when) {
                if (!newOn.has(currentState.elPos.node)) {
                    afterOnState.rate += (26 - currentState.time) * currentState.elPos.node.rate;
                }
                newOn.add(currentState.elPos.node);
            }

            if (afterOnState.rate > max.rate) {
                max = afterOnState;
            }

            const areOnKey = [...newOn].map(x => x.name).sort((a, b) => a.localeCompare(b)).join('_');
            const currentRelevantTargets = relevantTargets.filter(x => !newOn.has(x));
            for (const node of currentRelevantTargets) {
                if (currentState.time === currentState.huPos.when && currentState.time !== currentState.elPos.when) {
                    const nextHumanPos = { when: currentState.time + currentState.huPos.node.realDistance.get(node), node, areOnKey };
                    const minTime = Math.min(nextHumanPos.when, currentState.elPos.when);
                    if (minTime >= 26) {
                        continue;
                    }
                    byTime.get(minTime).push({ huPos: nextHumanPos, elPos: currentState.elPos, turnedOn: newOn, time: minTime, rate: afterOnState.rate, areOnKey });
                    if (time >=minTime) {
                        console.log(time, minTime);
                    }
                    continue;
                }
                if (currentState.time === currentState.elPos.when && currentState.time !== currentState.huPos.when) {
                    const nextElPos = { when: currentState.time + currentState.elPos.node.realDistance.get(node), node };
                    const minTime = Math.min(nextElPos.when, currentState.huPos.when);
                    if (minTime >= 26) {
                        continue;
                    }
                    byTime.get(minTime).push(({ huPos: currentState.huPos, elPos: nextElPos, turnedOn: newOn, time: minTime, rate: afterOnState.rate, areOnKey}));
                    continue;
                }
                if (currentRelevantTargets.length === 1) {
                    const nextHumanPos = { when: currentState.time + currentState.huPos.node.realDistance.get(node), node };
                    const nextElPos = { when: currentState.time + currentState.elPos.node.realDistance.get(node), node };
                    const minTime = Math.min(nextElPos.when, nextElPos.when);
                    if (minTime >= 26) {
                        continue;
                    }
                    byTime.get(minTime).push(({ huPos: nextHumanPos, elPos: nextElPos, turnedOn: newOn, time: minTime, rate: afterOnState.rate, areOnKey}));
                    continue;
                }
                for (const otherNode of currentRelevantTargets) {
                    if (node === otherNode) { continue; }
                    const nextHumanPos = { when: currentState.time + currentState.huPos.node.realDistance.get(node), node };
                    const nextElPos = { when: currentState.time + currentState.elPos.node.realDistance.get(otherNode), node: otherNode };
                    const minTime = Math.min(nextHumanPos.when, nextElPos.when);
                    if (minTime >= 26) {
                        continue;
                    }
                    byTime.get(minTime).push(({ huPos: nextHumanPos, elPos: nextElPos, turnedOn: newOn, time: minTime, rate: afterOnState.rate, areOnKey }));
                }
            }
        }
    }
    console.log(max.rate, max.turnedOn.size);
});

function buildSmall(nodes) {
    const realNodes = nodes.filter(x => !x.fake || x.name === 'AA');
    const origNodeMap = new Map(nodes.map(x => [x.name, x]));
    for (const startNode of realNodes) {
        let toVisit = new Map([[startNode, 0]]);
        for (const [targetNode, distance] of toVisit) {
            if (!targetNode.fake && targetNode !== startNode) {
                startNode.realDistance.set(targetNode, distance + 1);
                if (startNode.name !== 'AA') {
                    targetNode.realDistance.set(startNode, distance + 1);
                }
            }
            for (const neighbour of targetNode.to) {
                const node = origNodeMap.get(neighbour)
                if (!toVisit.has(node)) {
                    toVisit.set(node, distance + 1);
                }
            }
        }
    }
    return realNodes;
}