const fs = require('fs');
const _ = require('lodash');

fs.readFile('./ex1.input', (err, data) => {
    if (err) throw new Error("data :(");
    const actualInput = data.toString();
    const log = actualInput.split('\n')
        .map(x => {
            const line = x.trim();
            const time = line.split(']')[0].substring(1).replace(' ', 'T') + ':00.000Z';
            const command = line.split(']')[1].trim();
            return {
                time: new Date(time),
                command: command
            };
        }).sort((a, b) => a.time.getTime() - b.time.getTime());
    const guards = {};
    let currentGuard = 0;
    let sleepTime;
    for (const entry of log) {
        if (entry.command.startsWith('Guard')) {
            currentGuard = parseInt(entry.command.split(' ')[1].substring(1));
            continue;
        }

        if (entry.command.startsWith('falls')) {
            sleepTime = entry.time;
            continue;
        }

        if (entry.command.startsWith('wakes')) {
            if (guards[currentGuard] === undefined) {
                guards[currentGuard] = {
                    totalTime: 0,
                    sleepMinutes: [],
                    id: currentGuard
                }
            }
            const guard = guards[currentGuard];
            for (let minute = sleepTime.getUTCMinutes(); minute < entry.time.getUTCMinutes(); minute++) {
                guard.totalTime++;
                if (guard.sleepMinutes[minute] === undefined) {
                    guard.sleepMinutes[minute] = 0;
                }
                guard.sleepMinutes[minute] += 1;
            }
        }
    }

    const sleepiestGuard = _.maxBy(Object.values(guards), x => console.log(x.id, x.totalTime) || x.totalTime);
    const sleepiestGuardMinute = parseInt(_.maxBy(Object.keys(sleepiestGuard.sleepMinutes), x => sleepiestGuard.sleepMinutes[x]));

    console.log(sleepiestGuard.id, sleepiestGuardMinute, sleepiestGuard.id * sleepiestGuardMinute);

});
