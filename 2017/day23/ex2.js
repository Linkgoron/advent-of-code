let c = 125400
let h = 0;
for (let b = 108400; b <= c; b += 17) {
    console.log('testing ', b)
    const test = tst(b);
    console.log('tested', b, 'result ', test);
    h += test;
}

console.log(h);

function tst(b) {
    for (let d = 2; d <= Math.sqrt(b); d++) {
        if (Number.isInteger(b / d)) return 1;        
    }
    return 0;
}