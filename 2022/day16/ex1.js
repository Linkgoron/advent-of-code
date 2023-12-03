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
    const startNode = realNodes.find(x => x.name === 'AA');
    const states = new Set([{ pos: startNode, turnedOn: new Set(), time: 0, rate: 0 }]);
    let max = { pos: startNode, turnedOn: new Set(), time: 0, rate: 0 };
    for (const currentState of states) {
        const newOn = new Set(currentState.turnedOn);
        newOn.add(currentState.pos);
        const afterOnState = { pos: currentState.pos, turnedOn: newOn, time: currentState.time, rate: currentState.rate + (30 - currentState.time) * currentState.pos.rate };
        if (afterOnState.rate > max.rate) {
            max = afterOnState;
        }
        for (const [node, distance] of currentState.pos.realDistance) {
            if (afterOnState.turnedOn.has(node)) {
                continue;
            }

            if (afterOnState.time + distance < 30) {
                states.add({ pos: node, turnedOn: newOn, time: afterOnState.time + distance, rate: afterOnState.rate })
            }
        }
    }
    
    console.log(max.rate);
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