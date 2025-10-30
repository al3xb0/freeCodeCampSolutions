import request from 'supertest';
import { describe, it } from 'mocha';
import { strict as assert } from 'assert';
import app from '../server.js';

describe('Functional Tests', function() {

    it('Convert a valid input such as 10L', async function() {
        const res = await request(app).get('/api/convert').query({ input: '10L' });
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, 10);
        assert.equal(res.body.initUnit, 'L');
        assert.equal(res.body.returnUnit, 'gal');
        assert.equal(res.body.returnNum, parseFloat((10 / 3.78541).toFixed(5)));
    });

    it('Convert an invalid input such as 32g', async function() {
        const res = await request(app).get('/api/convert').query({ input: '32g' });
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'invalid unit');
    });

    it('Convert an invalid number such as 3/7.2/4kg', async function() {
        const res = await request(app).get('/api/convert').query({ input: '3/7.2/4kg' });
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'invalid number');
    });

    it('Convert an invalid number AND unit such as 3/7.2/4kilomegagram', async function() {
        const res = await request(app).get('/api/convert').query({ input: '3/7.2/4kilomegagram' });
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'invalid number and unit');
    });

    it('Convert with no number such as kg', async function() {
        const res = await request(app).get('/api/convert').query({ input: 'kg' });
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, 1);
        assert.equal(res.body.initUnit, 'kg');
        assert.equal(res.body.returnUnit, 'lbs');
        assert.equal(res.body.returnNum, parseFloat((1 / 0.453592).toFixed(5)));
    });

});
