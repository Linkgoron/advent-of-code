const fs = require('fs');
const numToLetters = {
    0: 'abcefg',
    1: 'cf',
    2: 'acdeg',
    3: 'acdfg',
    4: 'bcdf',
    5: 'abdfg',
    6: 'abdefg',
    7: 'acf',
    8: 'abcdefg',
    9: 'abcdfg',
}

const wordLengthToLetters = Object.values(numToLetters).reduce((agg, letters) => {
    const values = agg.get(letters.length) || new Set();
    for (const letter of letters.split('')) {
        values.add(letter);
    }
    agg.set(letters.length, values);
    return agg;
}, new Map());

const countToLetters = 'abcdefg'.split('').reduce((agg, letter) => {
    let count = 0;
    for (const word of Object.values(numToLetters)) {
        if (word.includes(letter)) {
            count++;
        }
    }
    const curSet = agg.get(count) || new Set();
    curSet.add(letter);
    agg.set(count, curSet);
    return agg;
}, new Map());

function canonical(word) {
    return word.split('').sort().join('');
}

const lettersToNum = Object.entries(numToLetters).reduce((agg, [key, value]) => {
    agg[canonical(value)] = key;
    return agg;
}, {});

fs.promises.readFile('./ex.input').then(data => {
    const lines = data.toString().trim().split('\n').map(x => {
        const [entries, displayed] = x.split(' | ');
        return {
            entries: entries.split(' '),
            displayed: displayed.split(' '),
        }
    }).flat();
    const l = lines.map(x => deduceAll(x.entries, x.displayed, wordLengthToLetters, countToLetters)).map(x => Number(x.join(''))).reduce((agg, num) => agg + num, 0);
    console.log(l);
});

function deduceAll(entries, displayed, lengthToLetters, countToLetters) {
    let state = 'abcdefg'.split('').reduce((agg, letter) => {
        agg[letter] = new Set('abcdefg'.split(''));
        return agg;
    }, {});
    const letterShowsCount = countShowsUpIn(entries);
    while (Object.values(state).some(x => x.size > 1)) {
        let nextState = { ...state };
        for (const entry of entries) {
            nextState = deduce(entry, nextState, lengthToLetters, countToLetters, letterShowsCount);
        }
        for (const letterMaps of Object.values(nextState)) {
            if (letterMaps.size === 1) {
                const result = [...letterMaps][0];
                for (const map of Object.values(nextState)) {
                    if (map.size > 1) {
                        map.delete(result);
                    }
                }
            }
        }
        state = nextState;
    }
    const res = displayed.map(word => word.split('').map(letter => [...state[letter]][0]).join('')).map(word => lettersToNum[canonical(word)]);
    return res;
}

function deduce(letters, state, lengthToLetters, countToLetters, letterShowsCount) {
    const options = lengthToLetters.get(letters.length);
    const newState = { ...state };
    for (const letter of letters.split('')) {
        const showsCount = letterShowsCount[letter];
        newState[letter] = intersect(newState[letter], options);
        newState[letter] = intersect(newState[letter], countToLetters.get(showsCount));
    }
    return newState;
}

function countShowsUpIn(words) {
    return 'abcdefg'.split('').reduce((agg, letter) => {
        let count = 0;
        for (const word of words) {
            if (word.includes(letter)) {
                count++;
            }
        }
        agg[letter] = count;
        return agg;
    }, {});
}

function intersect(setA, setB) {
    const intersection = new Set();
    for (let elem of setA) {
        if (setB.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}