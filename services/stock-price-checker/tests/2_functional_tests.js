import request from 'supertest';
import { describe, it, before } from 'mocha';
import { strict as assert } from 'assert';
import app from '../server.js';
import Stock from '../models/stock.js';

const TEST_IP1 = '1.1.1.1';
const TEST_IP2 = '2.2.2.2';
const STOCK1 = 'GOOG';
const STOCK2 = 'MSFT';
let likesAtStart = 0;

before(async function() {
  await Stock.deleteMany({});
});

describe('Functional Tests', function() {
  it('Viewing one stock: GET /api/stock-prices', async function() {
    const res = await request(app)
      .get('/api/stock-prices')
      .query({ stock: STOCK1 });
    assert.equal(res.status, 200);
    assert.ok(res.body && res.body.stockData);
    assert.equal(res.body.stockData.stock, STOCK1);
    assert.match(res.body.stockData.price.toString(), /^\d+\.?\d*$/);
    assert.ok(typeof res.body.stockData.likes === 'number');
    likesAtStart = res.body.stockData.likes;
  });

  it('Viewing one stock and liking it: GET /api/stock-prices?like=true', async function() {
    const res = await request(app)
      .get('/api/stock-prices')
      .set('X-Forwarded-For', TEST_IP1)
      .query({ stock: STOCK1, like: 'true' });
    assert.equal(res.status, 200);
    assert.ok(res.body && res.body.stockData);
    assert.equal(res.body.stockData.stock, STOCK1);
    assert.ok(typeof res.body.stockData.likes === 'number');
    assert.equal(res.body.stockData.likes, likesAtStart + 1);
  });

  it('Viewing the same stock and liking it again (same IP): no double-count', async function() {
    const res = await request(app)
      .get('/api/stock-prices')
      .set('X-Forwarded-For', TEST_IP1)
      .query({ stock: STOCK1, like: 'true' });
    assert.equal(res.status, 200);
    assert.ok(res.body && res.body.stockData);
    assert.equal(res.body.stockData.stock, STOCK1);
    assert.ok(typeof res.body.stockData.likes === 'number');
    assert.equal(res.body.stockData.likes, likesAtStart + 1);
  });

  it('Viewing two stocks: GET /api/stock-prices?stock=GOOG&stock=MSFT', async function() {
    const res = await request(app)
      .get('/api/stock-prices')
      .query({ stock: [STOCK1, STOCK2] });
    assert.equal(res.status, 200);
    assert.ok(res.body && res.body.stockData);
    assert.equal(res.body.stockData.length, 2);
    assert.equal(res.body.stockData[0].stock, STOCK1);
    assert.equal(res.body.stockData[1].stock, STOCK2);
    assert.ok(typeof res.body.stockData[0].rel_likes === 'number');
    assert.ok(typeof res.body.stockData[1].rel_likes === 'number');
    assert.equal(res.body.stockData[0].rel_likes, -res.body.stockData[1].rel_likes);
  });

  it('Viewing two stocks and liking them: GET /api/stock-prices?stock=GOOG&stock=MSFT&like=true', async function() {
    const res = await request(app)
      .get('/api/stock-prices')
      .set('X-Forwarded-For', TEST_IP2)
      .query({ stock: [STOCK1, STOCK2], like: 'true' });
    assert.equal(res.status, 200);
    assert.ok(res.body && res.body.stockData);
    assert.equal(res.body.stockData.length, 2);
    assert.equal(res.body.stockData[0].stock, STOCK1);
    assert.equal(res.body.stockData[1].stock, STOCK2);
    assert.ok(typeof res.body.stockData[0].rel_likes === 'number');
    assert.ok(typeof res.body.stockData[1].rel_likes === 'number');
    assert.equal(res.body.stockData[0].rel_likes, -res.body.stockData[1].rel_likes);
  });
});
