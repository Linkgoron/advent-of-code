const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const circuit = data.toString().split('\r\n').map(x => x.trim()).map(parseRow);
    const values = new Map();
    values.set('b', 956);
    while (true) {
        const readyWires = circuit.filter(wire => !values.has(wire.target) && isReady(values, wire));
        if (readyWires.length === 0) {
            console.log(values);
            console.log("DONE");
            return;
        }
        for (const wire of readyWires) {
            switch (wire.command) {
                case 'NOT':
                case 'ASSIGN': {
                    let sourceValue = wire.sourceIsWire ? values.get(wire.source) : wire.source;
                    if (wire.command === 'NOT') {
                        const value = sourceValue.toString(2).split('').map(x => x === '1' ? '0' : '1');
                        while (value.length < 16) {
                            value.unshift('1');
                        }
                        sourceValue = parseInt(value.join(''), 2);
                    }
                    values.set(wire.target, sourceValue);
                    continue;
                }
                case 'AND':
                case 'OR':
                case 'RSHIFT':
                case 'LSHIFT': {
                    const firstSource = wire.firstSourceIsWire ? values.get(wire.firstSource) : wire.firstSource;
                    const secondSource = wire.secondSourceIsWire ? values.get(wire.secondSource) : wire.secondSource;
                    const computation = compute(firstSource, secondSource, wire.command);
                    values.set(wire.target, computation);
                    continue;
                }
            }
            throw new Error(`can't execute ${action}`);
        }
    }
    console.log(values.get('a'));
});

function compute(leftVal, rightVal, action) {
    switch (action) {
        case 'AND': { return leftVal & rightVal >>> 0; }
        case 'OR': { return leftVal | rightVal >>> 0; }
        case 'RSHIFT': { return leftVal >> rightVal >>> 0; }
        case 'LSHIFT': { return leftVal << rightVal >>> 0; }
    }
    throw new Error(`can't compute ${action}`);
}

function isReady(values, wire) {
    switch (wire.command) {
        case 'NOT':
        case 'ASSIGN': {
            if (!wire.sourceIsWire) return true;
            return values.has(wire.source);
        }
        case 'AND':
        case 'OR':
        case 'RSHIFT':
        case 'LSHIFT': {
            if (wire.firstSourceIsWire && !values.has(wire.firstSource)) {
                return false;
            }

            if (wire.secondSourceIsWire && !values.has(wire.secondSource)) {
                return false;
            }
            return true;
        }
    }
    throw new Error(`can't compute ready state ${wire}`);
}

function parseRow(fullRow) {
    const row = fullRow.split(' ');
    if (row.length === 3) {
        return {
            command: 'ASSIGN',
            sourceIsWire: row[0].charCodeAt(0) >= 97,
            source: row[0].charCodeAt(0) >= 97 ? row[0] : parseInt(row[0]),
            target: row[2]
        }
    }

    if (['AND', 'OR', 'RSHIFT', 'LSHIFT'].includes(row[1])) {
        return {
            command: row[1],
            firstSourceIsWire: row[0].charCodeAt(0) >= 97,
            firstSource: row[0].charCodeAt(0) >= 97 ? row[0] : parseInt(row[0]),
            secondSourceIsWire: row[2].charCodeAt(0) >= 97,
            secondSource: row[2].charCodeAt(0) >= 97 ? row[2] : parseInt(row[2]),
            target: row[4]
        }
    }

    return {
        command: 'NOT',
        sourceIsWire: row[1].charCodeAt(0) >= 97,
        source: row[1].charCodeAt(0) >= 97 ? row[1] : parseInt(row[1]),
        target: row[3]
    }
}