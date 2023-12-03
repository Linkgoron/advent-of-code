const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const sensors = data.toString().trim().split(/\r?\n/).map((row) => {
        const [sensor, beacon] = row.replace('Sensor at ', '').split(': closest beacon is at ');
        const [sensorX, sensorY] = sensor.split(', ').map(x => Number(x.split('=')[1]));
        const [beaconX, beaconY] = beacon.split(', ').map(x => Number(x.split('=')[1]));
        const xDist = Math.abs(sensorX - beaconX);
        const yDist = Math.abs(sensorY - beaconY);
        return {
            x: sensorX,
            y: sensorY,
            dist: {
                x: xDist,
                y: yDist,
                total: xDist + yDist,
            },
            beacon: {
                x: beaconX,
                y: beaconY
            }
        }
    });

    const maxVal = 4000000;
    for (let targetRow = 0; targetRow < maxVal; targetRow++) {
        const ranges = [];
        for (const sensor of sensors) {
            const distToRow = Math.abs(targetRow - sensor.y);
            const hasToGo = sensor.dist.total - distToRow;
            if (hasToGo < 0) {
                continue;
            }
            const leftX = sensor.x - hasToGo
            const rightX = sensor.x + hasToGo;
            if (rightX < 0 || leftX > maxVal) {
                continue;
            }
            ranges.push({ leftX: Math.max(0, leftX), rightX: Math.min(maxVal, rightX) });
        }

        let wasMerge = true;
        while (wasMerge) {
            wasMerge = false;
            for (let i = 0; i < (ranges.length - 1); i++) {
                const canUnify = canMerge(ranges[i], ranges[i + 1], false, targetRow === 11);
                if (canUnify) {
                    wasMerge = true;
                    const newRow = merge(ranges[i], ranges[i + 1]);                    
                    ranges.splice(i, 2, newRow);
                    wasMerge = true;
                    break;
                }
            }
        }
        
        let count = ranges.map(x => x.rightX - x.leftX + 1).reduce((a, b) => a + b, 0);
        if (count !== (maxVal + 1)) {
            console.log(targetRow, count, maxVal);
            const rng = ranges.sort((rng1, rng2) => rng1.leftX - rng2.leftX);
            console.log(rng);
            if (ranges[0].leftX !== 0) {
                console.log(targetRow);
                return;
            } else if (ranges[ranges.length-1].rightX !== maxVal) {
                console.log('zzz', maxVal * 4000000 + targetRow);
                return;
            }
            for (let i = 0; i < (rng.length - 1); i++) { 
                if ((rng[i].rightX+1) !== rng[i+1].leftX) {
                    console.log(4000000 * (rng[i].rightX + 1) + targetRow);
                    return;
                }
            }
            return;
        }
    }
    console.log('failed');
});
function getKey(x, y) {
    return `${x}, ${y}`;
}

function canMerge(partOne, partTwo, reverse, print = false) {
    if (partTwo.leftX <= partOne.leftX && partOne.leftX <= partTwo.rightX) {
        return true;
    }
    if (partTwo.rightX >= partOne.rightX && partOne.rightX >= partTwo.leftX) {
        return true;
    }
    if (partOne.rightX >= partTwo.rightX && partOne.leftX <= partTwo.leftX) {
        return true;
    }

    if (reverse) { return false; }
    return canMerge(partTwo, partOne, true, print);
}

function merge(left, right) {
    if (!canMerge(left, right)) {
        throw new Error('wat');
    }
    return {
        leftX: Math.min(left.leftX, right.leftX),
        rightX: Math.max(left.rightX, right.rightX),
    }
}
