const fs = require('fs');
fs.readFile('./ex.input', (err, rawData) => {
    if (err) throw new Error("data :(");
    const components = rawData.toString().split('\r\n').map(x => x.trim().split('/')).map(parseRow);

    for (const component of components) {
        component.options = {};
        component.options.first = components.filter(x => component.isMatch(x, 'first', 'first') || component.isMatch(x, 'first', 'second'));
        component.options.second = components.filter(x => component.isMatch(x, 'second', 'first') || component.isMatch(x, 'second', 'second'));
    }

    const dummyNode = parseRow(['0', '0'], components.length);
    dummyNode.connected.first = { computeChain() { return {}; } };
    dummyNode.options = {
        first: [],
        second: components.filter(x => x.first === 0 || x.second === 0)
    }
    let res = buildChain(dummyNode, { strength: 0, length: 0 });
    console.log(res);
});

function buildChain(node, max) {
    const toContinue = node.connected.first ? 'second' : 'first';
    const relevantOptions = node.options[toContinue].filter(x => node.canConnect(x));
    if (relevantOptions.length === 0) {
        const res = node.computeChain();
        
        if (res.length > max.length) {
            return res;
        }

        if (res.length < max.length) {
            return max;
        }

        return res.strength > max.strength ? res : max;
    }
    for (const other of relevantOptions) {
        const connectOption = node.canConnect(other);
        node.connect(other, toContinue, connectOption.otherSide);
        max = buildChain(other, max);
        node.disconnect(toContinue);
    }

    return max;
}

function parseRow(row, index) {
    return {
        first: parseInt(row[0]),
        second: parseInt(row[1]),
        index,
        connected: {
            first: undefined,
            second: undefined
        },

        disconnect(side) {
            const elem = this.connected[side];
            this.connected[side] = undefined;
            if (elem.connected.first === this) {
                elem.connected.first = undefined;
            } else {
                elem.connected.second = undefined;
            }
        },

        connect(other, mySide, otherSide) {
            if (this === other) throw new Error('cant connect to self');
            if (this.connected[mySide]) {
                throw new Error("tried to connect me but I'm taken")
            }
            if (other.connected[otherSide]) {
                throw new Error("tried to connect but other is taken")
            }
            if (this[mySide] === other[otherSide]) {
                this.connected[mySide] = other;
                other.connected[otherSide] = this;
                return;
            }
            throw new Error(`tried to connect bad components ,${this},${other},${mySide},${otherSide}`);
        },

        canConnect(other) {
            if (this === other) return false;
            const sides = ['first', 'second'];
            for (const mySide of sides) {
                if (this.connected[mySide]) continue;
                for (const otherSide of sides) {
                    if (other.connected[otherSide]) continue;
                    if (this.isMatch(other, mySide, otherSide)) {
                        return { mySide, otherSide };
                    }
                }
            }
            return false;
        },

        computeChain(from, state) {
            state = state || { strength: 0, length: 0 };
            state.strength += this.first + this.second;
            state.length++;
            if (this.connected.first && this.connected.first !== from) {
                this.connected.first.computeChain(this, state);
            }

            if (this.connected.second && this.connected.second !== from) {
                this.connected.second.computeChain(this, state);
            }

            return state;
        },

        isMatch(other, mySide, otherSide) {
            if (this === other) return false;
            if (this[mySide] === other[otherSide]) {
                return true;
            }
            return false;
        }
    }
}