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

    const ranges = [];
    const targetRow = 2000000;
    for (const sensor of sensors) {
        const distToRow = Math.abs(targetRow - sensor.y);
        const hasToGo = sensor.dist.total - distToRow;
        if (hasToGo < 0) {
            continue;
        }
        const leftX = sensor.x - hasToGo
        const rightX = sensor.x + hasToGo
        ranges.push({ leftX, rightX });
    }


    let wasMerge = true;
    while (wasMerge) {
        wasMerge = false;
        for (let i = 0; i < ranges.length - 1; i++) {
            console.log(canMerge(ranges[i], ranges[i + 1]), ranges[i], ranges[i + 1])
            if (canMerge(ranges[i], ranges[i + 1])) {
                wasMerge = true;
                const newRow = merge(ranges[i], ranges[i + 1]);
                ranges.splice(i, 2, newRow);
                wasMerge = true;
                break;
            }
        }
    }
    console.log(ranges);
    let count = ranges.map(x => x.rightX - x.leftX + 1).reduce((a, b) => a + b, 0);
    const seenItem = new Set();
    for (const { x, y, beacon } of sensors) {
        const isSensorInRange = y === targetRow && ranges.find(rng => rng.leftX <= x && rng.rightX >= x);
        if (isSensorInRange) {
            count--;
        }
        const isBeaconInRange = beacon.y === targetRow && ranges.find(rng => rng.leftX <= beacon.x && rng.rightX >= beacon.x);
        if (isBeaconInRange && !seenItem.has(`${beacon.x}, ${beacon.y}`)) {
            seenItem.add(`${beacon.x}, ${beacon.y}`);
            console.log(beacon);
            count--;
        }
    }

    console.log(count);
});

function getKey(x, y) {
    return `${x}, ${y}`;
}

function canMerge(partOne, partTwo, reverse) {
    if (partTwo.leftX <= partOne.leftX && partOne.leftX <= partTwo.rightX) {
        return true;
    }
    if (partTwo.rightX >= partOne.rightX && partOne.rightX >= partTwo.leftX) {
        return true;
    }
    if (partOne.rightX >= partTwo.rightX && partOne.leftX >= partTwo.leftX) {
        return true;
    }

    if (reverse) { return false; }
    return canMerge(partTwo, partOne, true);
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