const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const rawPackets = data.toString().split('').map(text => `000${Number(`0x${text}`).toString(2)}`.slice(-4)).join('');
    const packet = parsePacket(new StringCursor(rawPackets));
    console.log(computePacket(packet));
});

function computePacket(packet) {
    if (packet.type === 4) {
        return packet.value;
    }
    const subPacketValues = packet.subPackets.map(packet => computePacket(packet));
    switch (packet.type) {
        case 0: {
            return subPacketValues.reduce((agg, cur) => agg + cur, 0);
        }
        case 1: {
            return subPacketValues.reduce((agg, cur) => agg * cur, 1);
        }
        case 2: {
            return Math.min(...subPacketValues);
        }
        case 3: {
            return Math.max(...subPacketValues);
        }
        case 5: {
            return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
        }
        case 6: {
            return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
        }
        case 7: {
            return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
        }
    }
    throw new Error('bad packet value');
}

function parseFull(str) {
    const cursor = new StringCursor(str);
    const packets = [];
    while (!cursor.isEnd()) {
        packets.push(parsePacket(cursor));
    }
    return packets;
}

function parsePacket(cursor) {
    let packet = {}
    packet.version = cursor.readDecimal(3);
    packet.type = cursor.readDecimal(3);
    if (packet.type === 4) {
        packet.value = parseLiteralValue(cursor);
    } else {
        packet.subPackets = parseOperator(cursor, packet.type);
    }
    return packet;
}

function parseLiteralValue(cursor) {
    let another = false;
    let binaryRep = '';
    do {
        another = cursor.readBoolean();
        const moreBits = cursor.read(4);
        binaryRep += moreBits;
    } while (another);

    return parseInt(binaryRep, 2);
}

function parseOperator(cursor) {
    let lengthTypeId = cursor.readBoolean();
    if (lengthTypeId) {
        let subPackets = [];
        const numberOfSubPackets = cursor.readDecimal(11);
        for (let i = 0; i < numberOfSubPackets; i++) {
            subPackets.push(parsePacket(cursor));
        }
        return subPackets;
    }

    const lengthOfPackets = cursor.readDecimal(15);
    return parseFull(cursor.read(lengthOfPackets));
}

class StringCursor {
    constructor(str) {
        this.str = str;
        this.location = 0;
    }

    isEnd() {
        return this.location === this.str.length || /^0+$/.test(this.str.slice(this.location));
    }
    peek(len = 1) {
        return this.str.slice(this.location, this.location + len);
    }

    read(len = 1) {
        const content = this.peek(len);
        this.location += len;
        return content;
    }

    readDecimal(len = 1) {
        const data = this.read(len);
        return parseInt(data, 2);
    }

    readBoolean() {
        const content = this.read(1);
        return content === '1';
    }
}