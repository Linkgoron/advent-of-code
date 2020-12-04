const fs = require('fs');
fs.promises.readFile('./ex.input').then(data => {
    const rows = data.toString().trim().split('\r\n\r\n').map(x => x.replace(/\r\n/gm, ' '));
    const passports = rows.map(x => x.split(' ').map(x => x.split(':'))
        .reduce((agg, [key, value]) => Object.assign(agg, { [key]: value }), {}));

    const items = passports.filter(filter);
    console.log(items.length);
});

function filter(passport) {
    const keys = Object.keys(passport);
    if (keys.length < 7 || (keys.length === 7 && keys.includes('cid'))) {
        return false;
    }

    const birth = Number(passport['byr']);
    if (birth < 1920 || birth > 2002) {
        return false;
    }

    const issueYear = Number(passport['iyr']);
    if (issueYear < 2010 || issueYear > 2020) {
        return false;
    }

    const expiration = Number(passport['eyr']);
    if (expiration < 2020 || expiration > 2030) {
        return false;
    }
    
    const height = passport['hgt'];
    const heightAmount = Number(height.substring(0, height.length - 2));
    const heightType = height.substring(height.length - 2);
    if (!['cm', 'in'].includes(heightType) ||
        Number.isNaN(heightAmount) ||
        (heightType === 'cm' && (heightAmount < 150 || heightAmount > 193)) ||
        (heightType === 'in' && (heightAmount < 59 || heightAmount > 76))) {
        return false;
    }
    
    const hairColor = passport['hcl'];
    if (!hairColor.match(/^#[0123456789abcdef]{6}$/)) {
        return false;
    }
    
    const eyeColor = passport['ecl'];
    if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(eyeColor)) {
        return false
    }
   
    const passportId = passport['pid'];
    if (!passportId.match(/^\d{9}$/)) {
        return false;
    }    
   
    return true
}