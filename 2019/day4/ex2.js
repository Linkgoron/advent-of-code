
require('fs').readFile('./ex1.input', (err, data) => {
    var [min, max] = data.toString().split('-').map(x => parseInt(x));

    var matches = 0;
    for (let num = min; num <= max; num++) {
        if (isOK(num.toString())) {
            matches++;
        }
    }
    console.log(matches);
});

function isOK(arr) {
    let hasDouble = false;
    for (let i = 0; i < arr.length - 1; i++) {
        if(arr[i] === arr[i+1] && !(arr[i+2] === arr[i] || arr[i-1] === arr[i])) {
            hasDouble = true;
        }
        
        if (parseInt(arr[i]) > parseInt(arr[i + 1])) {
            return false;
        }
    }
    return hasDouble;
}
