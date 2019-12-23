require('fs').readFile('./ex.input', (err, data) => {
    const commands = data.toString().split('\n')
        .map(x => x.trim().split(' ')).map(row => {
            console.log(row);
            if (row[0] === 'cut') {
                return {
                    command: 'cut',
                    count: Number(row[1])
                }
            }
            if (row[1] === 'with') {
                return {
                    command: 'increment',
                    count: Number(row[3])
                }
            }

            return {
                command: 'new'
            }
        });

    const deckSize = 10007;
    const stack = new SingleStack(2019, deckSize);
    for (const command of commands) {
        if (command.command === 'cut') {
            stack.cut(command.count);
        }
        if (command.command === 'increment') {
            stack.increment(command.count);
        }
        if (command.command === 'new') {
            stack.newStack();
        }
    }
    console.log(stack.currentPosition % deckSize)
});

class SingleStack {
    constructor(toFollow, total) {
        this.toFollow = toFollow;
        this.currentPosition = toFollow;
        this.total = total;
    }

    newStack() {
        this.currentPosition = this.total - this.currentPosition - 1;
    }

    cut(val) {
        val = val < 0 ? (this.total + val) : val;
        const move = val % this.total;
        if (this.currentPosition < move) {
            const staying = this.total - move;
            this.currentPosition = staying + this.currentPosition;
        } else {
            this.currentPosition = this.currentPosition - move;
        }
    }

    increment(inc) {
        const newPos = (inc * this.currentPosition) % this.total;
        this.currentPosition = newPos;
    }
}