const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const floors = data.toString().split('\r\n').map(x => x.trim())
        .slice(0, 3)
        .map(x => x.split('contains a ')[1])
        .map((x, i) => (
            x.replace(' and a', ' a').replace(',', '').replace('.', '').split(' a ').map(row => ({
                type: row.split(' ')[0].split('-')[0].replace(',', '').replace('.', ''),
                tech: row.split(' ')[1].replace(',', '').replace('.', '')
            })).sort((a, b) => b.type.localeCompare(a.type) || a.tech.localeCompare(b.tech))
        ));

    floors[0].push({ type: 'elerium', tech: 'generator' });
    floors[0].push({ type: 'elerium', tech: 'microchip' });
    floors[0].push({ type: 'dilithium', tech: 'generator' });
    floors[0].push({ type: 'dilithium', tech: 'microchip' });
    floors[0].sort((a, b) => b.type.localeCompare(a.type) || a.tech.localeCompare(b.tech));
    floors.push([]);

    const state = {
        elevator: 0,
        floors,
        turn: 0
    }
    let history = new Set();
    function hash(state) { 
        const turn = state.turn;
        state.turn =0;
        const res = crypto.createHash('md5').update(JSON.stringify(state)).digest("base64").replace(/=/g,''); 
        state.turn = turn;
        return res;
    }
    // function hash(state) { return hashString(JSON.stringify(state)) }
    history.addState = function (state) { this.add(hash(state)) };
    history.hasState = function (state) { return this.has(hash(state)); };
    console.log(JSON.stringify(state),hash(state));
    console.time();

    let lastTurn = 0;
    const states = new Set([state]);
    for (const currentState of states) {
        if (isDone(currentState)) {
            console.log('done', currentState.turn);
            console.timeEnd();

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
        return floor.concat(items).sort((a, b) => b.type.localeCompare(a.type) || a.tech.localeCompare(b.tech))
    }

    function* nextStates(state) {
        const currentLevel = state.elevator;
        const currentItems = state.floors[currentLevel];
        const movementOptions = [...allPairs(currentItems)].concat(currentItems.map(x => [x]));
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
        if (items.every(x => x.tech === 'microchip')) return true;
        if (items.every(x => x.tech === 'generator')) return true;
        const res = items.filter(x => x.tech === 'microchip')
            .map(chip => items.some(gen => gen.tech === 'generator' && gen.type === chip.type))
            .every(x => x);
        return res;
    }
});