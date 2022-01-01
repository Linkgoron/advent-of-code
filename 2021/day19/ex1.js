const fs = require('fs');
const path = require('path');
const util = require('util')

fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const scanners = data.toString().split(/\r?\n\r?\n/g).map(x => x.split(/\r?\n/g)).map((x, i) => {
        const scanner = {
            number: i,
            seen: x.slice(1).map(x => {
                const items = x.split(',').map(Number);
                return {
                    x: items[0],
                    y: items[1],
                    z: items[2],
                }
            }),
            location: i === 0 ? { x: 0, y: 0, z: 0 } : undefined,
        }
        for (const seen of scanner.seen) {
            seen.neighbours = scanner.seen.filter(x => x !== seen).map(other => {
                const diff = {
                    x: seen.x - other.x,
                    y: seen.y - other.y,
                    z: seen.z - other.z,
                }
                diff.distance = distance(diff);
                return diff;
            }).sort((dist1, dist2) => dist1.distance - dist2.distance);
            const allDist = seen.neighbours.map(x => x.distance);
            const allDistSet = new Set(allDist);
            if (allDist.length !== allDistSet.size) {
                throw new Error();
            }
        }
        return scanner;
    });

    while (scanners.some(x => !x.location)) {
        for (const scannerOne of scanners) {
            if (!scannerOne.location) {
                continue;
            }
            for (const scannerTwo of scanners) {
                if (scannerOne !== scannerTwo && !scannerTwo.location) {
                    checkScanners(scannerOne, scannerTwo);
                }
            }
        }
    }

    const allDots = scanners.map(scanner => scanner.seen.map(dot => `${dot.x + scanner.location.x},${dot.y + scanner.location.y},${dot.z + scanner.location.z}`)).flat();
    const stuff = new Set(allDots);
    console.log(stuff.size);
});

function distance(d) {
    return (d.x ** 2) + (d.y ** 2) + (d.z ** 2);
}

function checkScanners(scannerOne, scannerTwo) {
    if (!scannerOne.location) {
        return;
    }
    for (const seenOne of scannerOne.seen) {
        for (const seenTwo of scannerTwo.seen) {
            const res = haveMatchingShape(seenOne, seenTwo);
            if (res.success) {
                const reOrientedSrc = reOrientDot(res.command, seenTwo);
                scannerTwo.location = {
                    x: scannerOne.location.x + seenOne.x - reOrientedSrc.x,
                    y: scannerOne.location.y + seenOne.y - reOrientedSrc.y,
                    z: scannerOne.location.z + seenOne.z - reOrientedSrc.z,
                };
                for (const seen of scannerTwo.seen) {
                    const reOriented = reOrientDot(res.command, seen);
                    seen.x = reOriented.x;
                    seen.y = reOriented.y;
                    seen.z = reOriented.z;
                    seen.neighbours = reOrientLocation(res.command, seen.neighbours);
                }
                return;
            }
        }
    }
}

function haveMatchingShape(one, two) {
    const oneDists = one.neighbours.map(x => x.distance);
    const twoDists = two.neighbours.map(x => x.distance);
    let intersection = oneDists.filter(dist => twoDists.includes(dist));
    if (intersection.length < 11) {
        return { success: false };
    }

    const relevantOne = one.neighbours.filter(x => intersection.includes(x.distance));
    const relevantTwo = two.neighbours.filter(x => intersection.includes(x.distance));
    for (const option of allOptions()) {
        if (areDistsEqual(relevantOne, reOrientLocation(option, relevantTwo))) {
            return { success: true, command: option };
        }
    }

    return { success: false };
}

function* allOptions() {
    const reMaps = [['x', 'y', 'z'], ['x', 'z', 'y'], ['y', 'x', 'z'], ['y', 'z', 'x'], ['z', 'x', 'y'], ['z', 'y', 'x']]
    const reOrients = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];
    for (const [toX, toY, toZ] of reMaps) {
        for (let [orientX, orientY, orientZ] of reOrients) {
            yield {
                x: {
                    to: toX,
                    orient: orientX,
                },
                y: {
                    to: toY,
                    orient: orientY,
                },
                z: {
                    to: toZ,
                    orient: orientZ,
                }
            }
        }
    }
}

function areDistsEqual(distOne, distTwo) {
    for (let i = 0; i < distOne.length; i++) {
        if (distOne[i].x !== distTwo[i].x) {
            return false;
        }
        if (distOne[i].y !== distTwo[i].y) {
            return false;
        }
        if (distOne[i].z !== distTwo[i].z) {
            return false;
        }
    }
    return true;
}

function reOrientDot(command, dot) {
    const newDot = {
        [command.x.to]: dot.x * command.x.orient,
        [command.y.to]: dot.y * command.y.orient,
        [command.z.to]: dot.z * command.z.orient,
    }
    if (dot.distance) {
        newDot.distance = dot.distance;
    }
    return newDot;
}

function reOrientLocation(command, dists) {
    const dots = [];
    for (const dist of dists) {
        dots.push(reOrientDot(command, dist));
    }

    return dots;
}