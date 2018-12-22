const top = 10551374

let sum = 0;
for (let i = 1; i <= top; i++) {
    if (Number.isInteger(top / i)) {
        sum += i;
        console.log(i);
    }
}

console.log(sum);