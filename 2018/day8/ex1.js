const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var info = data.toString().split(' ');

    const { list } = parseTree(0, info, 65);
    const sum = list.reduce((acc, item) =>
        acc + item.metaData.reduce((mdAcc, md) => mdAcc + md, 0), 0);
    console.log(sum);
});

function parseTree(/** @type number */pos,/** @type Array<string>*/data, name, list = []) {
    const numberOfChildren = parseInt(data[pos++]);
    const numberOfMetaData = parseInt(data[pos++]);
    const node = {
        name: String.fromCharCode(name),
        numberOfChildren,
        numberOfMetaData,
        children: [],
        metaData: []
    };
    for (let j = 0; j < numberOfChildren; j++) {
        const { newPos, child } = parseTree(pos, data, ++name, list);
        node.children.push(child);
        pos = newPos;
    }
    for (let j = 0; j < numberOfMetaData; j++) {
        node.metaData.push(parseInt(data[pos++]));
    }
    list.push(node);
    return { newPos: pos, child: node, list };
}
