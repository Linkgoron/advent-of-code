const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const expressions = data.toString().trim().split(/\r?\n/gm);
    const sum = expressions.reduce((acc, x) => acc + parse([...addParenthesis(x.replace(/ /g, ''))].reverse().join('')), 0);
    console.log(sum)
});

function parse(expression, counter = { position: 0 }) {
    const startPos = counter.position;
    let currentNumber = undefined;

    if (expression[counter.position].match(/\d/)) {
        let numStart = counter.position;
        let numEnd = counter.position;
        for (; expression[numEnd] && expression[numEnd].match(/\d/); numEnd++);
        currentNumber = Number(expression.substring(numStart, numEnd));
        counter.position = numEnd;
    }

    if (expression[counter.position] === ')') {
        counter.position++;
        currentNumber = parse(expression, counter);
    }

    if (!expression[counter.position] || expression[counter.position] === '(') {
        counter.position++;
        return currentNumber;
    }

    if (expression[counter.position] === '+') {
        let plusNum = currentNumber === undefined ? 0 : currentNumber;
        counter.position++;
        return plusNum + parse(expression, counter);
    }

    if (expression[counter.position] === '*') {
        let mulNum = currentNumber === undefined ? 1 : currentNumber;
        counter.position++;
        return mulNum * parse(expression, counter);
    }
    console.log(expression[counter.position], counter, startPos);
    throw new Error('wat???');
}

function addParenthesis(expression) {
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '+') {
            let start = findStart(expression, i);
            let end = findEnd(expression, i);
            let arr = expression.split('');
            arr.splice(start, 0, '(');
            arr.splice(end + 1, 0, ')');
            expression = arr.join('');
            i++;
        }
    }
    return expression
}

function findStart(expression, position) {
    let depth = 0;
    for (let i = position - 1; i >= 0; i--) {
        if (expression[i] === ')') {
            depth++;
            continue;
        } else if (expression[i] === '(') {
            depth--;
            if (depth === 0) {
                return i;
            }
            continue;
        }
        if (depth === 0 && (i === 0 || expression[i].match(/\d/))) {
            if (i == 0) {
                return 0;
            }
            while (expression[i] && expression[i].match(/\d/)) {
                i--;
            }
            return Math.max(0, i+1);
        }
    }
    return 0;
}

function findEnd(expression, position) {
    let depth = 0;
    for (let i = position + 1; i < expression.length; i++) {
        if (expression[i] === '(') {
            depth++;
            continue;
        } else if (expression[i] === ')') {
            depth--;
            if (depth === 0) {
                return i;
            }
            continue;
        }

        if (depth === 0 && (i === expression.length - 1 || expression[i].match(/\d/))) {
            if (i == expression.length - 1) {
                return expression.length;
            }
            while (expression[i] && expression[i].match(/\d/)) {
                i++;
            }
            // console.log('END', i);
            return Math.min(expression.length, i);
        }
    }
    return expression.length;
}