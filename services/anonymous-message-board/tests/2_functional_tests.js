import request from 'supertest';
import { describe, it, before, after } from 'mocha';
import { strict as assert } from 'assert';
import app from '../server.js';
import Thread from '../models/thread.js';

const board = 'fcc-board-test';
let threadId;
let replyId;
const threadPass = 'threadSecret123';
const replyPass = 'replySecret321';

before(async () => { await Thread.deleteMany({ board }); });
after(async () => { await Thread.deleteMany({ board }); });

describe('Functional Tests', function() {
  it('Creating a new thread: POST /api/threads/:board', async function() {
    const res = await request(app)
      .post('/api/threads/' + board)
      .send({ text: 'Test thread', delete_password: threadPass });
    assert.equal(res.status, 200);
    assert.ok(res.body._id);
    threadId = res.body._id;
    assert.equal(res.body.text, 'Test thread');
    assert.ok(Array.isArray(res.body.replies));
  });

  it('Viewing the 10 most recent threads: GET /api/threads/:board', async function() {
    const res = await request(app)
      .get('/api/threads/' + board);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
    const t = res.body[0];
    assert.ok(t._id && t.text && t.created_on && Array.isArray(t.replies));
    assert.ok("replycount" in t);
  });

  it('Deleting a thread with an invalid delete_password returns incorrect password', async function() {
    const res = await request(app)
      .delete('/api/threads/' + board)
      .send({ thread_id: threadId, delete_password: 'wrongpass' });
    assert.equal(res.text, 'incorrect password');
  });

  it('Reporting a thread: PUT /api/threads/:board', async function() {
    const res = await request(app)
      .put('/api/threads/' + board)
      .send({ thread_id: threadId });
    assert.equal(res.text, 'reported');
  });

  it('Creating a new reply: POST /api/replies/:board', async function() {
    const res = await request(app)
      .post('/api/replies/' + board)
      .send({ thread_id: threadId, text: 'Reply text', delete_password: replyPass });
    assert.equal(res.status, 200);
    assert.equal(res.body._id, threadId);
    assert.ok(Array.isArray(res.body.replies));
    assert.equal(res.body.replies.at(-1).text, 'Reply text');
    replyId = res.body.replies.at(-1)._id;
  });

  it('Viewing a single thread with all replies: GET /api/replies/:board?thread_id=...', async function() {
    const res = await request(app)
      .get('/api/replies/' + board)
      .query({ thread_id: threadId });
    assert.equal(res.status, 200);
    assert.equal(res.body._id, threadId);
    assert.ok(Array.isArray(res.body.replies));
    assert.ok(res.body.replies.some(r => r._id === replyId));
  });

  it('Deleting a reply with an invalid password returns incorrect password', async function() {
    const res = await request(app)
      .delete('/api/replies/' + board)
      .send({ thread_id: threadId, reply_id: replyId, delete_password: 'wrongpass' });
    assert.equal(res.text, 'incorrect password');
  });

  it('Reporting a reply: PUT /api/replies/:board', async function() {
    const res = await request(app)
      .put('/api/replies/' + board)
      .send({ thread_id: threadId, reply_id: replyId });
    assert.equal(res.text, 'reported');
  });

  it('Deleting a reply with the correct password returns success', async function() {
    const res = await request(app)
      .delete('/api/replies/' + board)
      .send({ thread_id: threadId, reply_id: replyId, delete_password: replyPass });
    assert.equal(res.text, 'success');
    const get = await request(app).get('/api/replies/' + board).query({ thread_id: threadId });
    assert.equal(get.body.replies.find(r => r._id === replyId).text, '[deleted]');
  });

  it('Deleting a thread with the correct password returns success', async function() {
    // recreate the thread for clean delete
    const threadRes = await request(app)
      .post('/api/threads/' + board)
      .send({ text: 'Thread for delete', delete_password: threadPass });
    const tid = threadRes.body._id;
    const res = await request(app)
      .delete('/api/threads/' + board)
      .send({ thread_id: tid, delete_password: threadPass });
    assert.equal(res.text, 'success');
  });
});
