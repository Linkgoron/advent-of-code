const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    var info = data.toString().split(' ');
    const { child: root } = parseTree(0, info, 65);
    console.log(root.value);
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
    if (numberOfChildren === 0) {
        node.value = node.metaData.reduce((acc, x) => acc + x, 0);
    } else {
        node.value = node.metaData
            .map(x => node.children[x - 1] === undefined ? 0 : node.children[x - 1].value)
            .reduce((acc, x) => acc + x, 0);
    }
    list.push(node);
    return { newPos: pos, child: node, list };
}
