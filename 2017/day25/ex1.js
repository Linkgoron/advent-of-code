const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const parts = rawData.toString().split('\r\n\r\n').map(x => x.trim()).filter(Boolean);
    const startInfo = parseStart(parts.shift());
    const states = parts.map(stateInfo => parseState(stateInfo));
    const checksum = emulate(startInfo.startingState, startInfo.stepLimit, states);
    console.log(checksum);
});

function memoryValue(memory, pointer) {
    return memory.has(pointer) ? 1 : 0;
}

function writeValue(memory, pointer, value) {
    if (value === 1) {
        memory.add(pointer);
    } else {
        memory.delete(pointer);
    }
}

function emulate(startState, numberOfSteps, states) {
    const memory = new Set();    
    const stateMap = new Map();
    for (const state of states) {
        stateMap.set(state.name, state);
    }

    let currentState = stateMap.get(startState);
    let memoryPointer = 0;
    for (let i = 0; i < numberOfSteps; i++) {
        const currentValue = memoryValue(memory, memoryPointer);
        const currentAction = currentValue === 1 ? currentState.oneActions : currentState.zeroActions;
        writeValue(memory, memoryPointer, currentAction.write);
        currentAction.moveDirection === 'right' ? memoryPointer++ : memoryPointer--;
        currentState = stateMap.get(currentAction.nextState);
    }

    return memory.size;
}

function parseStart(startPart) {
    const rows = startPart.split('\r\n').map(x => x.trim()).filter(Boolean);
    let startingState = '';
    let stepLimit = 0;
    for (const row of rows) {
        if (row.startsWith("Begin in state")) {
            startingState = row.replace('.', "").replace("Begin in state ", "");
            continue;
        }
        if (row.startsWith("Perform a diagnostic checksum after ")) {
            stepLimit = parseInt(row.replace("Perform a diagnostic checksum after ", ""));
            continue;
        }


    }

    return { startingState, stepLimit };
}

function parseState(statePart) {
    const rows = statePart.split('\r\n').map(x => x.trim()).filter(Boolean);
    const name = rows[0].replace("In state ", "").replace(":", "");
    const zeroActions = {
        write: parseInt(rows[2].replace("- Write the value ", "").replace('.', "")),
        moveDirection: rows[3].replace("- Move one slot to the ", "").replace('.', ""),
        nextState: rows[4].replace("- Continue with state ", "").replace('.', ""),
    }
    const oneActions = {
        write: parseInt(rows[6].replace("- Write the value ", "").replace('.', "")),
        moveDirection: rows[7].replace("- Move one slot to the ", "").replace('.', ""),
        nextState: rows[8].replace("- Continue with state ", "").replace('.', ""),
    }

    return { name, zeroActions, oneActions };
}