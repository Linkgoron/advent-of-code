const fs = require('fs');
const path = require('path');
fs.promises.readFile(`${__dirname}${path.sep}ex.input`).then(data => {
    const rawPackets = data.toString().split('').map(text => `000${Number(`0x${text}`).toString(2)}`.slice(-4)).join('');
    const packets = parseFull(rawPackets);
    console.log(countVersions(packets));
});

function countVersions(packets) {
    let totalVer = 0;
    for (const packet of packets){
        totalVer += packet.version;
        if (packet.subPackets) {
            totalVer += countVersions(packet.subPackets);
        }
    }
    return totalVer;
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