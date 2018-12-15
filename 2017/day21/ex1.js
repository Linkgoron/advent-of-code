const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const rawRules = rawData.toString().split('\r\n').map(x => x.trim());
    const rules = rawRules.map(x => {
        const [rule, result] = x.split(' => ');
        return {
            rule: rule.split('/'),
            result: result.split('/'),
            size: rule.split('/').length
        }
    });

    let content = ['.#.', '..#', '###'];
    for (let turns = 0; turns < 18; turns++) {
        print(content, 'mapping')
        const newContent = [];
        const rectangleSize = content.length % 2 === 0 ? 2 : 3;
        for (let i = 0; i < content.length; i += rectangleSize) {
            const rowcontent = [];
            for (let j = 0; j < content.length; j += rectangleSize) {
                rowcontent.push(getNewPattern(content, rules, i, j, rectangleSize));
            }
            const newRectangleSize = rectangleSize + 1;
            for (let j = 0; j < newRectangleSize; j++) {
                const currentRow = newRectangleSize * (i / rectangleSize);

                newContent[j + currentRow] = rowcontent.map(x => x[j]).join('');
            }
        }
        content = newContent;
    }
    print(content, 'the end');
    console.log(content.join('\n').split('').map(x => x === '#' ? 1 : 0).reduce((acc, item) => acc + item, 0));

    function getNewPattern(map, rules, topLeftRow, topLeftCol, size) {
        const originalContent = [];
        for (let i = 0; i < size; i++) {
            originalContent[i] = map[i + topLeftRow].slice(topLeftCol, topLeftCol + size);
        }

        for (const rule of rules.filter(x => x.size === size)) {
            let content = originalContent;
            const ruleMatch = rule.rule.join('\n');
            // print(content, 'init');
            for (let i = 0; i < 4; i++) {
                if (content.join('\n') === ruleMatch) {
                    return rule.result;
                }
                content = flipHorizontal(content);
                // print(content, 'flipped h');
                if (content.join('\n') === ruleMatch) {
                    return rule.result;
                }

                content = flipVertical(content);
                // print(content, 'flipped v');
                if (content.join('\n') === ruleMatch) {
                    return rule.result;
                }

                content = flipHorizontal(content);
                // print(content, 'flipped h back');
                if (content.join('\n') === ruleMatch) {
                    return rule.result;
                }

                content = rotateText(flipVertical(content));
                // print(content, 'flipped v back + rotated');
                if (content.join('\n') === ruleMatch) {
                    return rule.result;
                }
            }
        }
        throw "I don't know";
    }

    function rotateText(content) {
        const newContent = [];
        for (let i = 0; i < content.length; i++) {
            let toPush = '';
            for (let j = 0; j < content.length; j++) {
                toPush += content[content.length - 1 - j][i];
            }
            newContent.push(toPush);
        }
        return newContent;
    }

    function flipHorizontal(content) {
        const newContent = [];
        for (let i = 0; i < content.length; i++) {
            let toPush = '';
            for (let j = 0; j < content.length; j++) {
                toPush += content[i][content.length - 1 - j];
            }
            newContent.push(toPush);
        }
        return newContent;
    }

    function flipVertical(content) {
        const newContent = [];
        for (let i = 0; i < content.length; i++) {
            let toPush = '';
            for (let j = 0; j < content.length; j++) {
                toPush += content[content.length - 1 - i][j];
            }
            newContent.push(toPush);
        }
        return newContent;
    }

    function print(content, str) {
        // if (str) console.log(str);
        // console.log(content.join('\n'));
        // console.log(' - ');
    }

});