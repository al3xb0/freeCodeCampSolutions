const validUnits = ['gal', 'l', 'lbs', 'kg', 'mi', 'km'];

const unitMap = {
    gal: 'L',
    l: 'gal',
    lbs: 'kg',
    kg: 'lbs',
    mi: 'km',
    km: 'mi'
};

const spellOutUnitMap = {
    gal: 'gallons',
    l: 'liters',
    lbs: 'pounds',
    kg: 'kilograms',
    mi: 'miles',
    km: 'kilometers'
};

const conversionRates = {
    gal: 3.78541,
    l: 1 / 3.78541,
    lbs: 0.453592,
    kg: 1 / 0.453592,
    mi: 1.60934,
    km: 1 / 1.60934
};

export function parseNumber(input) {
    if (!input) return 1;

    const index = input.search(/[a-zA-Z]/);
    let numStr = index === -1 ? input : input.slice(0, index);

    if (!numStr) return 1;

    if ((numStr.match(/\//g) || []).length > 1) return 'invalid number';

    if (numStr.includes('/')) {
        const [numerator, denominator] = numStr.split('/');
        const num = parseFloat(numerator);
        const den = parseFloat(denominator);
        if (isNaN(num) || isNaN(den)) return 'invalid number';
        return num / den;
    }

    const num = parseFloat(numStr);
    if (isNaN(num)) return 'invalid number';
    return num;
}

export function parseUnit(input) {
    const index = input.search(/[a-zA-Z]/);
    if (index === -1) return 'invalid unit';
    let unit = input.slice(index).toLowerCase();
    if (unit === 'l') unit = 'l';
    if (!validUnits.includes(unit)) return 'invalid unit';
    return unit;
}

export function getReturnUnit(unit) {
    const ret = unitMap[unit];
    return ret.toLowerCase();
}



export function spellOutUnit(unit) {
    return spellOutUnitMap[unit];
}

export function convertNum(num, unit) {
    return parseFloat((num * conversionRates[unit]).toFixed(5));
}

export function convertValue(input) {
    const num = parseNumber(input);
    const unit = parseUnit(input);

    if (num === 'invalid number' && unit === 'invalid unit') return { error: 'invalid number and unit' };
    if (num === 'invalid number') return { error: 'invalid number' };
    if (unit === 'invalid unit') return { error: 'invalid unit' };

    const returnNum = convertNum(num, unit);
    const returnUnit = getReturnUnit(unit);
    const initUnitString = spellOutUnit(unit);
    const returnUnitString = spellOutUnit(returnUnit);

    return {
        initNum: num,
        initUnit: unit === 'l' ? 'L' : unit,
        returnNum,
        returnUnit: returnUnit === 'l' ? 'L' : returnUnit,
        string: `${num} ${spellOutUnit(unit)} converts to ${returnNum} ${spellOutUnit(returnUnit)}`
    };
}

export function convert(req, res) {
    const { input } = req.query;
    if (!input) return res.json({ error: 'No input provided' });

    const result = convertValue(input);
    res.json(result);
}
