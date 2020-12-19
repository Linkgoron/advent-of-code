const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const expressions = data.toString().trim().split(/\r?\n/gm);
    const sum = expressions.reduce((acc, x) => acc + parse([...x.replace(/ /g, '')].reverse().join('')), 0);
    console.log(sum);
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