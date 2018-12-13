const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const key = (x, y) => `${x},${y}`;
    const data = rawData.toString().split('\r\n').map((row, y) => row.split('').map((c, x) => ({ x, y, letter: c })))
        .reduce((acc, r) => acc.concat(r), []);
    const map = new Map();
    const directionMap = {
        left: {
            'left': 'up',
            'right': 'down',
            'straight': 'left'
        },
        right: {
            'left': 'down',
            'right': 'up',
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
    }
    const nextDirection = {
        'left': 'straight',
        'straight': 'right',
        'right': 'left'
    };

    const opposite = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };

    const directionChangeMapping = {
        left: { '\\': 'up', '\/': 'down' },
        right: { '\\': 'down', '\/': 'up' },
        up: { '\\': 'left', '\/': 'right' },
        down: { '\\': 'right', '\/': 'left' }
    };
    const carts = [];
    cartId = 0;
    for (const { x, y, letter } of data) {
        if (letter !== ' ') {
            const location = {
                isIntersection: letter === '+',
                isDirectionChange: letter === `\\` || letter === '\/',
                isPipe: letter === `|` || letter === '-' || letter === '<' || letter === '>' || letter === 'v' || letter === '^',
                letter,
                x, y
            };
            map.set(key(x, y), location);
            const isCart = letter === '<' || letter === '>' || letter === 'v' || letter === '^';
            if (isCart) {
                carts.push({
                    id: cartId++,
                    location,
                    lastTurn: 'right',
                    direction:
                        letter === '<' ? 'left' :
                            letter === '>' ? 'right' :
                                letter === 'v' ? 'down' : 'up',
                    set(other) {
                        this.location = other.location;
                        this.lastTurn = other.lastTurn;
                        this.direction = other.direction;
                    }
                });
            }
        }
    }

    function getNextIntersectionMovementDirection(currentCartDirection, lastTurn) {
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
    while (noCrash && steps < 105) {
        steps++;
        carts.sort((c1, c2) => c1.location.y - c2.location.y || c1.location.x - c2.location.x);
        console.log(carts);
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
                console.log(cart, cartsInSameLocation[0]);
                break;
            }
        }
    }
    console.log(steps, crashLocation);
});