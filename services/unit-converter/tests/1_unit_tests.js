import { describe, it } from 'mocha';
import chai from 'chai';
const assert = chai.assert;
import {
    parseNumber as getNum,
    parseUnit as getUnit,
    getReturnUnit,
    spellOutUnit,
    convertValue
} from '../controllers/convertHandler.js';

describe('Unit Tests', function() {

    it('convertHandler should correctly read a whole number input', function() {
        assert.equal(getNum('32L'), 32);
    });

    it('convertHandler should correctly read a decimal number input', function() {
        assert.equal(getNum('3.1mi'), 3.1);
    });

    it('convertHandler should correctly read a fractional input', function() {
        assert.equal(getNum('1/2km'), 0.5);
    });

    it('convertHandler should correctly read a fractional input with a decimal', function() {
        assert.equal(getNum('5.4/3lbs'), 1.8);
    });

    it('convertHandler should correctly return an error on a double-fraction', function() {
        assert.equal(getNum('3/2/3kg'), 'invalid number');
    });

    it('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', function() {
        assert.equal(getNum('kg'), 1);
    });

    it('convertHandler should correctly read each valid input unit', function() {
        ['gal', 'l', 'lbs', 'kg', 'mi', 'km'].forEach(unit => {
            assert.equal(getUnit(`10${unit}`), unit);
        });
    });

    it('convertHandler should correctly return an error for an invalid input unit', function() {
        assert.equal(getUnit('32g'), 'invalid unit');
    });

    it('convertHandler should return the correct return unit for each valid input unit', function() {
        const units = ['gal', 'l', 'lbs', 'kg', 'mi', 'km'];
        const expected = ['l', 'gal', 'kg', 'lbs', 'km', 'mi'];
        units.forEach((unit, i) => {
            assert.equal(getReturnUnit(unit), expected[i]);
        });
    });

    it('convertHandler should correctly return the spelled-out string unit for each valid input unit', function() {
        const units = ['gal', 'l', 'lbs', 'kg', 'mi', 'km'];
        const expected = ['gallons', 'liters', 'pounds', 'kilograms', 'miles', 'kilometers'];
        units.forEach((unit, i) => {
            assert.equal(spellOutUnit(unit), expected[i]);
        });
    });

    it('convertHandler should correctly convert gal to L', function() {
        const result = convertValue('1gal');
        assert.approximately(result.returnNum, 3.78541, 0.00001);
        assert.equal(result.returnUnit, 'L');
    });

    it('convertHandler should correctly convert L to gal', function() {
        const result = convertValue('1L');
        assert.approximately(result.returnNum, 0.26417, 0.00001);
        assert.equal(result.returnUnit, 'gal');
    });

    it('convertHandler should correctly convert mi to km', function() {
        const result = convertValue('1mi');
        assert.approximately(result.returnNum, 1.60934, 0.00001);
        assert.equal(result.returnUnit, 'km');
    });

    it('convertHandler should correctly convert km to mi', function() {
        const result = convertValue('1km');
        assert.approximately(result.returnNum, 0.62137, 0.00001);
        assert.equal(result.returnUnit, 'mi');
    });

    it('convertHandler should correctly convert lbs to kg', function() {
        const result = convertValue('1lbs');
        assert.approximately(result.returnNum, 0.453592, 0.00001);
        assert.equal(result.returnUnit, 'kg');
    });

    it('convertHandler should correctly convert kg to lbs', function() {
        const result = convertValue('1kg');
        assert.approximately(result.returnNum, 2.20462, 0.00001);
        assert.equal(result.returnUnit, 'lbs');
    });


});
