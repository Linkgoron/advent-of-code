const fs = require('fs');
const path = require('path');

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const commands = data.toString().trim().split(/\r?\n/gi).map(x => {
        const row = x.trim();
        const [command, items] = row.split(' ');
        const [xToDo, yToDo, zToDo] = items.split(',').map(row => {
            const [min, max] = row.split('=')[1].split('..').map(Number);
            return {
                min,
                max
            };
        });


        return {
            command,
            x: xToDo,
            y: yToDo,
            z: zToDo,
            size: (xToDo.max - xToDo.min + 1) * (yToDo.max - yToDo.min + 1) * (zToDo.max - zToDo.min + 1),
        };
    }).filter(Boolean);

    const addedCommands = [];
    let added = 0;
    const reversed = commands.reverse();
    for (const command of reversed) {
        if (command.command === 'on') {
            added += command.size;
            const jointList = [];
            for (const next of addedCommands) {
                const joint = jointWith(next, command);
                if (joint) {
                    jointList.push(joint);
                }
            }
            const joining = joinAll(jointList);
            added -= computeJoint(joining);
        }
        addedCommands.push(command);
    }
    console.log(added);
});

function subGroupify(groups, indexes, left) {
    if (left === 0) {
        return [indexes];
    }
    const res = [];
    let lastIndex = indexes.length === 0 ? -1 : (indexes[indexes.length - 1]);
    for (let i = (1 + lastIndex); i < groups.length - left + 1; i++) {
        const selected = [...indexes, i];
        res.push(subGroupify(groups, selected, left - 1));
    }

    return res.flat(1);
}

function subGroups(groups) {
    let groupings = [];
    for (let size = 1; size <= groups.length; size++) {
        groupings.push(subGroupify(groups, [], size));
    }
    return groupings.flat(1);
}


function joinAll(boxes) {
    if (boxes.length === 0) {
        return [];
    }
    const subGroupOptions = subGroups(boxes);
    return subGroupOptions.map(option => {
        let joint = boxes[option[0]];
        for (const next of option.slice(1)) {
            if (joint) {
                joint = jointWith(joint, boxes[next]);
            }
        }
        if (!joint) {
            return undefined;
        }
        return {
            level: option.length,
            joint,
        };
    }).filter(Boolean);
}

function computeJoint(all) {
    let newItems = 0;
    for (const item of all) {
        const modifier = item.level % 2 === 0 ? -1 : 1;
        newItems += (modifier * item.joint.size);
    }
    return newItems
}

function jointWith(box1, box2) {
    const xJoint = getJointRow(box1, box2, 'x');
    const yJoint = getJointRow(box1, box2, 'y');
    const zJoint = getJointRow(box1, box2, 'z');
    if (xJoint && yJoint && zJoint) {
        return {
            x: xJoint,
            y: yJoint,
            z: zJoint,
            size: (xJoint.max - xJoint.min + 1) * (yJoint.max - yJoint.min + 1) * (zJoint.max - zJoint.min + 1),
        };
    }
    return undefined;
}

function getJointRow(box1, box2, axis) {
    const boxit = {
        min: Math.max(box1[axis].min, box2[axis].min),
        max: Math.min(box1[axis].max, box2[axis].max),
    }

    if (boxit.max >= boxit.min) {
        return boxit;
    }

    return undefined;
}