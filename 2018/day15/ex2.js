const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const mapData = rawData.toString().split('\r\n')
        .map((row, r) => row.trim().split('').map((item, c) => ({
            isWall: item === '#',
            containsGoblin: item === 'G',
            containsElf: item === 'E',
            x: c,
            y: r
        }))).reduce((acc, i) => acc.concat(i), []);
    const units = [];
    for (const data of mapData.filter(x => x.containsElf || x.containsGoblin)) {
        units.push({
            type: data.containsElf ? 'Elf' : 'Goblin',
            hitPoints: 200,
            strength: data.containsElf ? 25 : 3,
            x: data.x, y: data.y
        });
    }

    for (let strength = 3; strength < 500; strength++) {
        for (const unit of units.filter(x => x.type === 'Elf')) {
            unit.strength = strength;
        }

        const gameMap = new GameMap(mapData, units);
        let i = 0;
        const maxSteps = 1000;
        while (!gameMap.isOver() && i++ < maxSteps) {
            gameMap.executeTurn();
        }

        const score = gameMap.score();
        if (score.deadElves === 0) {
            gameMap.print();
            console.log(strength, score.score);
            break;
        }
    }    
});


class GameMap {
    constructor(map, units) {
        this.finishedTurns = 0;
        this.BfsMap = new Map();
        this.units = units.map(unit => ({

            type: unit.type,
            hitPoints: unit.hitPoints,
            strength: unit.strength,
            x: unit.x,
            y: unit.y,
            isDead() { return this.hitPoints <= 0 }
        }));
        for (const m of map) {
            const matchingUnit = this.units.filter(unit => unit.x === m.x && unit.y === m.y)[0]
            const unit = matchingUnit === undefined ? undefined : matchingUnit;
            this.BfsMap.set(this.key(m.x, m.y),
                {
                    x: m.x,
                    y: m.y,
                    isWall: m.isWall,
                    unit: unit,
                    holdsElf() {
                        if (this.unit === undefined) return false;
                        return this.unit.type === 'Elf';
                    },
                    holdsGoblin() {
                        if (this.unit === undefined) return false;
                        return this.unit.type === 'Goblin';
                    }
                });
        }
    }

    key(x, y) {
        return `${x},${y}`;
    }

    getPosition(x, y) {
        return this.BfsMap.get(this.key(x, y));
    }

    findClosestEnemy(unit) {
        if (!this.anyEnemiesNotSurrounded(unit)) return undefined;
        const visited = new Set();
        const toVisitHash = new Set();
        const toVisit = [{ x: unit.x, y: unit.y, distance: 0, next: undefined }];
        const results = [];
        let minDistance = this.BfsMap.size + 1;
        for (let currentPos = 0; currentPos < toVisit.length; currentPos++) {
            const current = toVisit[currentPos];
            visited.add(this.key(current.x, current.y));
            const next = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
            for (const n of next) {
                if (visited.has(this.key(current.x + n.x, current.y + n.y))) continue;
                const pos = this.getPosition(current.x + n.x, current.y + n.y);
                if (pos.isWall) continue;
                if (pos.unit && unit.type === pos.unit.type && !pos.unit.isDead()) continue;
                if (current.distance + 1 > minDistance) continue;
                const hasNearbyEnemy = this.hasEnemyOfOtherTypeNearby(pos.x, pos.y, unit.type);
                if (hasNearbyEnemy) {
                    results.push({ x: pos.x, y: pos.y, next: (current.next || { x: pos.x, y: pos.y }), distance: current.distance + 1 })
                    if (current.distance + 1 < minDistance) {
                        minDistance = current.distance + 1;
                    }
                }
                if (!visited.has(this.key(pos.x, pos.y)) && !toVisitHash.has(this.key(pos.x, pos.y))) {
                    toVisit.push({ x: pos.x, y: pos.y, distance: current.distance + 1, next: current.next || { x: pos.x, y: pos.y } });
                    toVisitHash.add(this.key(pos.x, pos.y));
                }
            }
        }
        const result = results.sort((a, b) => a.distance - b.distance || a.y - b.y || a.x - b.x)[0];
        return result;
    }

    score() {
        const hp = this.units.filter(x => !x.isDead()).map(x => x.hitPoints).reduce((acc, item) => acc + item, 0);
        return {
            hp: hp,
            turns: this.finishedTurns,
            score: this.finishedTurns * hp,
            deadGoblins: this.units.filter(x => x.type === 'Goblin' && x.isDead()).length,
            deadElves: this.units.filter(x => x.type === 'Elf' && x.isDead()).length
        }
    }

    executeTurn() {
        const toMove = this.units.filter(u => !u.isDead()).sort((u1, u2) => u1.y - u2.y || u1.x - u2.x);
        let i = 0;
        for (const unit of toMove) {
            // console.log(`unit ${++i}, ${unit.x},${unit.y}`);
            if (unit.isDead()) continue;
            if (this.hasEnemiesLeft(unit)) {

                if (!this.hasEnemyNearby(unit)) {
                    this.move(unit);
                }
                // this.print();
                if (this.hasEnemyNearby(unit)) {
                    // console.log(`${unit.type} (${unit.x},${unit.y}) , hp left:${unit.hitPoints} is attacking!`);
                    this.attack(unit);
                }
            } else {
                return;
            }
        }
        this.finishedTurns++;
    }

    hasEnemiesLeft(unit) {
        return this.units.filter(u => u.type !== unit.type && !u.isDead()).length > 0;
    }

    anyEnemiesNotSurrounded(unit) {
        return this.units.filter(u => u.type !== unit.type && !u.isDead() && !this.isSurrounded(u)).length > 0;
    }

    isSurrounded(unit) {
        const next = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
        for (const n of next) {
            const pos = this.getPosition(unit.x + n.x, unit.y + n.y);

            if (!pos.isWall || pos.unit === undefined || pos.unit.isDead()) {
                return false;
            }
        }
    }

    isOver() {
        if (this.units.filter(u => u.type === 'Elf' && !u.isDead()).length === 0) return true;;
        return this.units.filter(u => u.type === 'Goblin' && !u.isDead()).length === 0;
    }

    move(unit) {
        const nextEnemy = this.findClosestEnemy(unit);
        if (nextEnemy === undefined) return;
        const nextPosition = nextEnemy.next;
        const currentPos = this.getPosition(unit.x, unit.y);
        currentPos.unit = undefined;
        const nextPos = this.getPosition(nextPosition.x, nextPosition.y);
        unit.x = nextPos.x;
        unit.y = nextPos.y;
        nextPos.unit = unit;
        // console.log(`${unit.type} is moving from (${currentPos.x},${currentPos.y}) to (${nextPos.x},${nextPos.y})`);
    }

    hasEnemyNearby(unit) {
        const next = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
        for (const n of next) {
            const pos = this.getPosition(unit.x + n.x, unit.y + n.y);
            if (pos.unit && unit.type !== pos.unit.type && !pos.unit.isDead()) {
                return true;
            }
        }
        return false;
    }

    hasEnemyOfOtherTypeNearby(x, y, type) {
        const next = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
        for (const n of next) {
            const pos = this.getPosition(x + n.x, y + n.y);
            if (pos.unit && type !== pos.unit.type && !pos.unit.isDead()) {
                return true;
            }
        }
        return false;
    }

    attack(unit) {
        const next = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
        const pos = next.map(n => this.getPosition(unit.x + n.x, unit.y + n.y))
            .filter(pos => pos.unit && unit.type !== pos.unit.type && !pos.unit.isDead())
            .sort((a, b) => a.unit.hitPoints - b.unit.hitPoints || a.y - b.y || a.x - b.x)[0];

        if (pos !== undefined) {
            pos.unit.hitPoints -= unit.strength;
            // console.log(`${pos.unit.type} (${pos.unit.x},${pos.unit.y}) has been hit from (${unit.x},${unit.y}) , hp left:${pos.unit.hitPoints}`);
            if (pos.unit.isDead()) {
                // console.log('has been killed :(((')
                const otherPos = this.getPosition(pos.unit.x, pos.unit.y);
                otherPos.unit = undefined;
            }
        }
    }


    print() {
        const rows = Math.max(...[...this.BfsMap.values()].map(m => m.y)) + 1;
        const cols = Math.max(...[...this.BfsMap.values()].map(m => m.x)) + 1;
        for (let i = 0; i < rows; i++) {
            let row = '';
            for (let j = 0; j < cols; j++) {
                const pos = this.getPosition(j, i);
                if (pos.isWall) row += '#';
                else if (pos.holdsElf()) row += 'E';
                else if (pos.holdsGoblin()) row += 'G';
                else row += '.';
            }
            console.log(row);
        }
    }
}