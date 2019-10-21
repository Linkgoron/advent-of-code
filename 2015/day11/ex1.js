const fs = require('fs');

fs.readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    let currentPassword = data.toString().trim();
    while (!isLegal(currentPassword)) {
        let state = currentPassword.split('');
        for (let i = currentPassword.length - 1; i >= 0; i--) {
            if (state[i] === 'z') {
                state[i] = 'a';
                continue;
            }
            state[i] = String.fromCharCode(state[i].charCodeAt(0) + 1);
            break;
        }
        currentPassword = state.join('');
    }

    console.log(currentPassword);
});

function isLegal(password) {
    const allLegal = !(password.includes('i') || password.includes('o') || password.includes('l'));
    const taken = new Set();
    const letters = [...password];
    const hasDouble = letters.map((letter, i) => {
        if (letter !== password[i + 1]) return 0;
        if (letter === password[i + 1] && !taken.has(i)) {
            taken.add(i + 1);
            return 1;
        }
        return 0;
    }).reduce((acc, cur) => acc + cur, 0) > 1;
    const hasThree = letters.some((letter, i) => {
        return (1 + password.charCodeAt(i)) === (password.charCodeAt(i + 1))
            && (2 + password.charCodeAt(i) === password.charCodeAt(i + 2))
    });
    return allLegal && hasDouble && hasThree
}