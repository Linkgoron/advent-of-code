const fs = require('fs');
const path = require('path');

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const [p1Start, p2Start] = data.toString().split(/\r?\n/g).map(x => Number(x.trim().split(': ')[1]));

    let cache = new Map()
    let state = {
        turn: 'p1',
        p1: {
            position: p1Start,
            score: 0,
        },
        p2: {
            position: p2Start,
            score: 0,
        }
    };
    const content = countStuff(state, cache);
    console.log(content);
});

function addToCache(pos, results, cache) {
    const newRes = results.reduce((agg, result) => {
        agg.p1Wins += (result.res.p1Wins * result.count);
        agg.p2Wins += (result.res.p2Wins * result.count);
        return agg;
    }, { p1Wins: 0, p2Wins: 0 })
    cache.set(JSON.stringify(pos), newRes);
    return newRes;
}

function getFromCache(pos, cache) {
    return cache.get(JSON.stringify(pos));
}


function countStuff(state, cache = new Map()) {
    if (state.p1.score >= 21) {
        const res = { p1Wins: 1, p2Wins: 0 }
        addToCache(state, [{ res, count: 1 }], cache);
        return res;
    }

    if (state.p2.score >= 21) {
        const res = { p1Wins: 0, p2Wins: 1 }
        addToCache(state, [{ res, count: 1 }], cache);
        return res;
    }

    const prevResult = getFromCache(state, cache);
    if (prevResult) {
        return prevResult;
    }

    const nextOptions = buildNextPositions(state);
    let results = [];
    for (let option of nextOptions) {
        results.push({ count: option.count, res: countStuff(option.state, cache) });
    }

    return addToCache(state, results, cache);
}

let options;
function buildOptions() {
    if (options) {
        return options;
    }
    options = [];
    const optionsCache = new Map();
    for (let i = 1; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            for (let k = 1; k < 4; k++) {
                const c = optionsCache.get(i + j + k) || 0;
                optionsCache.set(i + j + k, c + 1);
            }
        }
    }
    for (const [key, value] of optionsCache) {
        options.push({ steps: key, count: value });
    }
    return options;
}

function buildNextPositions(state) {
    const nextPos = buildOptions();
    const toMovePlayer = state[state.turn];
    const nextMover = state.turn === 'p1' ? 'p2' : 'p1';
    const nextPositions = nextPos.map(x => {
        return {
            count: x.count,
            state: {
                turn: nextMover,
                [nextMover]: state[nextMover],
                [state.turn]: getNextPosition(toMovePlayer, x.steps),
            }
        }
    });

    return nextPositions.sort((a, b) => (b.state.p1.score + b.state.p2.score) - (a.state.p1.score + a.state.p2.score))
}
function getNextPosition(pos, move) {
    const rawNextPosition = pos.position + move;
    const nextPosition = rawNextPosition <= 10 ? rawNextPosition : (rawNextPosition - 10);
    return {
        position: nextPosition,
        score: pos.score + nextPosition,
    }
}