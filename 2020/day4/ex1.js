const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rows = data.toString().trim().split('\r\n\r\n').map(x => x.replace(/\r\n/gm, ' '));
    const passports = rows.map(x => x.split(' ').map(x => x.split(':'))
        .reduce((agg, [key, value]) => Object.assign(agg, { [key]: value }), {}));
    
    // console.log(passports);
    const items = passports.filter(x=>Object.keys(x).length === 8 || (Object.keys(x).length === 7 && !('cid' in x)));
    console.log(items.length);
});