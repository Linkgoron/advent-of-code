const fs = require('fs');

const MICROCHIP = 1;
const GENERATOR = 2;
let nameMap = new Map();

function nameToNumber(name) {
    if (nameMap.has(name.trim())) {
        return nameMap.get(name);
    }
    nameMap.set(name.trim(), nameMap.size + 1);
    return nameMap.size;
}

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    console.time();
    const floors = data.toString().split('\r\n').map(x => x.trim())
        .slice(0, 3)
        .map(x => x.split('contains a ')[1])
        .map((x, i) => (
            x.replace(' and a', ' a').replace(',', '').replace('.', '').split(' a ').map(row => ({
                type: nameToNumber(row.split(' ')[0].split('-')[0].replace(',', '').replace('.', '')),
                tech: row.split(' ')[1].replace(',', '').replace('.', '').trim() === 'microchip' ? MICROCHIP : GENERATOR
            })).sort((a, b) => b.type - a.type || b.tech - a.tech)
        ));

   
    floors[0].sort((a, b) => b.type - a.type || b.tech - a.tech);
    floors[0].push({ type: nameToNumber('elerium'), tech: GENERATOR });
    floors[0].push({ type: nameToNumber('elerium'), tech: MICROCHIP });
    floors[0].push({ type: nameToNumber('dilithium'), tech: GENERATOR });
    floors[0].push({ type: nameToNumber('dilithium'), tech: MICROCHIP });
    floors.push([]);

    const state = {
        elevator: 0,
        floors,
        turn: 0
    }
    let history = new Set();
    function hash(state) { 
        const floorHash = state.floors.map(floor => `${floor.map(x=>`${x.type}-${x.tech}`).join(',')}`).join('|');
        return `${state.elevator}>${floorHash}`;
    }
    // function hash(state) { return hashString(JSON.stringify(state)) }
    history.addState = function (state) { this.add(hash(state)) };
    history.hasState = function (state) { return this.has(hash(state)); };
    console.log(hash(state))
    let lastTurn = 0;
    const states = new Set([state]);
    for (const currentState of states) {
        if (isDone(currentState)) {
            console.timeEnd();
            console.log('done', currentState.turn);
            return;
        }
        for (const newState of nextStates(currentState)) {
            if (!history.hasState(newState)) {
                history.addState(newState);
                states.add(newState);
            }
        }

        if (currentState.turn > lastTurn) {
            lastTurn++;
            console.log(lastTurn, states.size);
        }

        states.delete(currentState);
    }

    console.log(':(');

    function isDone(state) { return state.floors.every((x, i) => i === 3 || x.length === 0); }

    function* allPairs(items) {
        for (let i = 0; i < items.length; i++) {
            const first = items[i];
            for (let j = i + 1; j < items.length; j++) {
                const second = items[j];
                if (first.type === second.type) {
                    yield [first, second];
                }
                if (first.tech === second.tech) {
                    yield [first, second];
                }
            }
        }
    }

    function removeItems(floor, items) {
        return floor.filter(x => !items.includes(x));
    }

    function addItems(floor, items) {
        return floor.concat(items).sort((a, b) => b.type - a.type || b.tech - a.tech);
    }

    function* nextStates(state) {
        const currentLevel = state.elevator;
        const currentItems = state.floors[currentLevel];
        const initialOptions = currentLevel === 3 ? [] : [...allPairs(currentItems)];
        const movementOptions = initialOptions.concat(currentItems.map(x => [x]));
        for (const direction of [-1, 1]) {
            const nextFloor = currentLevel + direction;
            if (nextFloor < 0 || nextFloor > 3) continue;
            for (const option of movementOptions) {
                const newState = {
                    elevator: nextFloor,
                    floors: state.floors.map((floor, i) => i === currentLevel ? removeItems(floor, option) :
                        i === nextFloor ? addItems(floor, option) : floor),
                    turn: state.turn + 1
                }
                if (legalState(newState)) {
                    yield newState;
                }
            }
        }
    }

    function legalState(state) {
        return state.floors.every(legalFloorState);
    }

    function legalFloorState(items) {
        if (items.every(x => x.tech === MICROCHIP)) return true;
        if (items.every(x => x.tech === GENERATOR)) return true;
        const res = items.filter(x => x.tech === MICROCHIP)
            .map(chip => items.some(gen => gen.tech === GENERATOR && gen.type === chip.type))
            .every(x => x);
        return res;
    }
});