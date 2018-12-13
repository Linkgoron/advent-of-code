const fs = require('fs');
const key = (x, y) => `${x},${y}`;
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const rows = rawData.toString().split('\r\n');
    const rowCount = rows.length;
    const colCount = rows[0].length;
    const data = rows.map((row, y) => row.split('')
        .map((c, x) => ({ x, y, letter: c })))
        .reduce((acc, r) => acc.concat(r), []);
    const map = new Map();
    let carts = [];
    let cartId = 0;
    for (const { x, y, letter } of data) {
        if (letter !== ' ') {
            const isCart = letter === '<' || letter === '>' || letter === 'v' || letter === '^';
            const location = {
                isIntersection: letter === '+',
                isDirectionChange: letter === `\\` || letter === '\/',
                isPipe: letter === `|` || letter === '-' || isCart,
                letter: (letter === '<' || letter === '>') ? '-' : ((letter === 'v' || letter === '^') ? '|' : letter),
                x, y
            };
            map.set(key(x, y), location);
            if (isCart) {
                const signToDirection = {
                    '<': 'left',
                    '>': 'right',
                    'v': 'down',
                    '^': 'up'
                };
                carts.push({
                    steps: 0,
                    id: cartId++,
                    location,
                    lastTurn: 'right',
                    direction: signToDirection[letter],
                    set(other) {
                        this.location = other.location;
                        this.lastTurn = other.lastTurn;
                        this.direction = other.direction;
                        this.steps++;
                    }
                });
            }
        }
    }

    function getNextIntersectionMovementDirection(currentCartDirection, lastTurn) {
        const directionMap = {
            left: {
                'left': 'down',
                'right': 'up',
                'straight': 'left'
            },
            right: {
                'left': 'up',
                'right': 'down',
                'straight': 'right'
            },
            up: {
                'left': 'left',
                'right': 'right',
                'straight': 'up'
            },
            down: {
                'left': 'right',
                'right': 'left',
                'straight': 'down'
            },
        };
        const nextDirection = {
            'left': 'straight',
            'straight': 'right',
            'right': 'left'
        }
        const action = nextDirection[lastTurn];
        const moveDirection = directionMap[currentCartDirection][action];
        return {
            action: action,
            moveDirection
        };
    }

    function getNextByDirection(location, direction, map) {
        if (direction === 'right') return map.get(key(location.x + 1, location.y));
        if (direction === 'left') return map.get(key(location.x - 1, location.y));
        if (direction === 'up') return map.get(key(location.x, location.y - 1));
        if (direction === 'down') return map.get(key(location.x, location.y + 1));
        throw new Error('bad direction');
    }

    function getNextIntersectionDirection(location, direction, lastTurn, map) {
        const movement = getNextIntersectionMovementDirection(direction, lastTurn);
        const nextLocation = getNextByDirection(location, movement.moveDirection, map);
        return { ...movement, location: nextLocation };
    }

    function getNext(cart, map) {

        if (cart.location.isIntersection) {
            const movement = getNextIntersectionDirection(cart.location, cart.direction, cart.lastTurn, map);
            return {
                location: movement.location,
                direction: movement.moveDirection,
                lastTurn: movement.action
            };
        }

        if (cart.location.isDirectionChange) {
            const directionChangeMapping = {
                left: { '\\': 'up', '\/': 'down' },
                right: { '\\': 'down', '\/': 'up' },
                up: { '\\': 'left', '\/': 'right' },
                down: { '\\': 'right', '\/': 'left' }
            }
            const direction = directionChangeMapping[cart.direction][cart.location.letter];
            const nextLocation = getNextByDirection(cart.location, direction, map);
            return {
                location: nextLocation,
                lastTurn: cart.lastTurn,
                direction: direction
            };

        }

        const defaultDirection = getNextByDirection(cart.location, cart.direction, map);
        return {
            location: defaultDirection,
            lastTurn: cart.lastTurn,
            direction: cart.direction
        };
    }

    let steps = 0;
    let noCrash = true;
    let crashLocation = null;
    const totalSteps = 1000;
    print(map, carts, rowCount, colCount);
    while (noCrash && steps < totalSteps) {
        steps++;
        carts.sort((c1, c2) => c1.location.y - c2.location.y || c1.location.x - c2.location.x);
        for (const cart of carts) {
            const nextPhase = getNext(cart, map);
            if (nextPhase.location === undefined) {
                throw new Error("bad location");
            }

            cart.set(nextPhase);
            const cartsInSameLocation = carts.filter(c => c !== cart && c.location === cart.location);
            if (cartsInSameLocation.length > 0) {
                noCrash = false;
                crashLocation = nextPhase.location;
                break;
            }
        }
    }
    print(map, carts, rowCount, colCount);
    console.log(steps, crashLocation.x, crashLocation.y);
});

function print(map, carts, rows, cols) {
    const dirToSign = {
        'left': '<',
        'right': '>',
        'up': '^',
        'down': 'v'
    };
    for (let row = 0; row < rows; row++) {
        let rowPrint = '';
        const cartMap = new Map();
        for (const cart of carts) {
            cartMap.set(key(cart.location.x, cart.location.y), dirToSign[cart.direction]);
        }
        for (let col = 0; col < cols; col++) {
            const pointKey = key(col, row);
            if (cartMap.has(pointKey)) {
                cartMap.get(pointKey);
                const addedItem = cartMap.get(pointKey);
                rowPrint += addedItem;
            } else {
                const addedItem = map.get(pointKey);
                const letter = (addedItem || { letter: ' ' }).letter;
                rowPrint += letter;
            }

        }
        console.log(rowPrint);
    }
    console.log('');
}