const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const lines = data.toString().trim().split('\n').map(x => x.trim())

    let scores = [];
    for (let line of lines) {
        const res = parse(line);
        if (res.type === 'incomplete') {
            scores.push(res.autoCompleteScore);
        }
    }
    scores.sort((a, b) => a - b);
    const median = scores[Math.floor(scores.length / 2)];
    console.log(median);
});

function parse(line) {
    const stack = [];
    for (const [letter, index] of enumerate(line)) {
        if (!isClosing(letter)) {
            stack.push(letter);
            continue;
        }
        const popup = stack.pop();
        if (!isMatching(popup, letter)) {
            return { done: false, score: score(letter), type: 'corrupt', index };
        }
    }
    if (stack.length === 0) {
        return { done: true };
    }
    return { done: false, autoCompleteScore: missingScore(stack), type: 'incomplete' };
}

function* enumerate(line) {
    for (let i = 0; i < line.length; i++) {
        yield [line[i], i];
    }
}

function isMatching(start, end) {
    if (start === '{') return end === '}';
    if (start === '<') return end === '>';
    if (start === '[') return end === ']';
    if (start === '(') return end === ')';
}

function isClosing(letter) {
    return [')', ']', '}', '>'].includes(letter);
}
const letterScore = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}
function score(letter) {
    return letterScore[letter] || 0;
}

const missingLetterScore = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
}
function missingScore(missing) {
    let score = 0;
    for (const item of reverseIterator(missing)) {
        score *= 5;
        score += missingLetterScore[item];
    }
    return score;
}

function* reverseIterator(line) {
    for (let i = line.length - 1; i >= 0; i--) {
        yield line[i];
    }
}