import request from 'supertest';
import { describe, it } from 'mocha';
import { strict as assert } from 'assert';
import app from '../server.js';

let testBookId;

// EXAMPLE TEST
describe('Functional Tests', function() {
  it('Example GET /api/books', async function() {
    const res = await request(app).get('/api/books');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    if (res.body.length > 0) {
      assert.ok(res.body[0].hasOwnProperty('commentcount'));
      assert.ok(res.body[0].hasOwnProperty('title'));
      assert.ok(res.body[0].hasOwnProperty('_id'));
    }
  });

  // ROUTING TESTS
  describe('POST /api/books with title => create book object/expect book object', function() {
    it('Test POST /api/books with title', async function() {
      const res = await request(app)
        .post('/api/books')
        .send({ title: 'TestBook' });
      assert.equal(res.status, 200);
      assert.ok(res.body._id);
      assert.equal(res.body.title, 'TestBook');
      testBookId = res.body._id;
    });
    it('Test POST /api/books with no title given', async function() {
      const res = await request(app)
        .post('/api/books')
        .send({});
      assert.equal(res.status, 200);
      assert.equal(res.text, 'missing required field title');
    });
  });

  describe('GET /api/books => array of books', function() {
    it('Test GET /api/books', async function() {
      const res = await request(app).get('/api/books');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body));
      if (res.body.length > 0) {
        assert.ok(res.body[0].hasOwnProperty('commentcount'));
        assert.ok(res.body[0].hasOwnProperty('title'));
        assert.ok(res.body[0].hasOwnProperty('_id'));
      }
    });
  });

  describe('GET /api/books/[id] => book object with [id]', function() {
    it('Test GET /api/books/[id] with id not in db', async function() {
      const res = await request(app).get('/api/books/64b8261124489f0e53e0fake');
      assert.equal(res.status, 200);
      assert.equal(res.text, 'no book exists');
    });
    it('Test GET /api/books/[id] with valid id in db', async function() {
      const res = await request(app).get('/api/books/' + testBookId);
      assert.equal(res.status, 200);
      assert.ok(res.body._id);
      assert.equal(res.body._id, testBookId);
      assert.equal(res.body.title, 'TestBook');
      assert.ok(Array.isArray(res.body.comments));
    });
  });

  describe('POST /api/books/[id] => add comment/expect book object with id', function() {
    it('Test POST /api/books/[id] with comment', async function() {
      const res = await request(app)
        .post('/api/books/' + testBookId)
        .send({ comment: 'Nice!' });
      assert.equal(res.status, 200);
      assert.equal(res.body._id, testBookId);
      assert.equal(res.body.title, 'TestBook');
      assert.ok(Array.isArray(res.body.comments));
      assert.ok(res.body.comments.includes('Nice!'));
    });
    it('Test POST /api/books/[id] without comment field', async function() {
      const res = await request(app)
        .post('/api/books/' + testBookId)
        .send({});
      assert.equal(res.status, 200);
      assert.equal(res.text, 'missing required field comment');
    });
    it('Test POST /api/books/[id] with comment, id not in db', async function() {
      const res = await request(app)
        .post('/api/books/64b8261124489f0e53e0fake')
        .send({ comment: 'No such book' });
      assert.equal(res.status, 200);
      assert.equal(res.text, 'no book exists');
    });
  });

  describe('DELETE /api/books/[id] => delete book object id', function() {
    it('Test DELETE /api/books/[id] with valid id in db', async function() {
      const res = await request(app).delete('/api/books/' + testBookId);
      assert.equal(res.status, 200);
      assert.equal(res.text, 'delete successful');
    });
    it('Test DELETE /api/books/[id] with  id not in db', async function() {
      const res = await request(app).delete('/api/books/64b8261124489f0e53e0fake');
      assert.equal(res.status, 200);
      assert.equal(res.text, 'no book exists');
    });
  });

  describe('DELETE /api/books => delete all books', function() {
    it('Test DELETE /api/books', async function() {
      const res = await request(app).delete('/api/books');
      assert.equal(res.status, 200);
      assert.equal(res.text, 'complete delete successful');
    });
  });
});
