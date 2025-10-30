import request from 'supertest';
import { describe, it } from 'mocha';
import { strict as assert } from 'assert';
import app from '../server.js';

let testId; // будем сохранять _id созданной задачи для последующих тестов

describe('Functional Tests', function() {

    // 1. Create an issue with every field
    it('Create an issue with every field', async function() {
        const res = await request(app)
            .post('/api/issues/test-project')
            .send({
                issue_title: 'Test issue',
                issue_text: 'Full test issue',
                created_by: 'Tester',
                assigned_to: 'Dev',
                status_text: 'In QA'
            });

        assert.equal(res.status, 200);
        assert.ok(res.body._id);
        testId = res.body._id;
        assert.equal(res.body.issue_title, 'Test issue');
        assert.equal(res.body.issue_text, 'Full test issue');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, 'Dev');
        assert.equal(res.body.status_text, 'In QA');
        assert.ok(res.body.created_on);
        assert.ok(res.body.updated_on);
        assert.strictEqual(res.body.open, true);
    });

    // 2. Create an issue with only required fields
    it('Create an issue with only required fields', async function() {
        const res = await request(app)
            .post('/api/issues/test-project')
            .send({
                issue_title: 'Required only',
                issue_text: 'Testing required',
                created_by: 'Tester'
            });

        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Required only');
        assert.equal(res.body.issue_text, 'Testing required');
        assert.equal(res.body.created_by, 'Tester');
        assert.strictEqual(res.body.assigned_to, '');
        assert.strictEqual(res.body.status_text, '');
        assert.ok(res.body._id);
        assert.ok(res.body.created_on);
        assert.ok(res.body.updated_on);
        assert.strictEqual(res.body.open, true);
    });

    // 3. Create an issue with missing required fields
    it('Create an issue with missing required fields', async function() {
        const res = await request(app)
            .post('/api/issues/test-project')
            .send({});

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
    });

    // 4. View issues on a project
    it('View issues on a project', async function() {
        const res = await request(app)
            .get('/api/issues/test-project');

        assert.equal(res.status, 200);
        assert.ok(Array.isArray(res.body));
    });

    // 5. View issues with one filter
    it('View issues on a project with one filter', async function() {
        const res = await request(app)
            .get('/api/issues/test-project')
            .query({ open: true });

        assert.equal(res.status, 200);
        assert.ok(Array.isArray(res.body));
        res.body.forEach(issue => assert.strictEqual(issue.open, true));
    });

    // 6. View issues with multiple filters
    it('View issues on a project with multiple filters', async function() {
        const res = await request(app)
            .get('/api/issues/test-project')
            .query({ open: true, created_by: 'Tester' });

        assert.equal(res.status, 200);
        assert.ok(Array.isArray(res.body));
        res.body.forEach(issue => {
            assert.strictEqual(issue.open, true);
            assert.equal(issue.created_by, 'Tester');
        });
    });

    // 7. Update one field on an issue
    it('Update one field on an issue', async function() {
        const res = await request(app)
            .put('/api/issues/test-project')
            .send({ _id: testId, issue_text: 'Updated text' });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: testId });
    });

    // 8. Update multiple fields on an issue
    it('Update multiple fields on an issue', async function() {
        const res = await request(app)
            .put('/api/issues/test-project')
            .send({ _id: testId, issue_text: 'Updated again', status_text: 'Done' });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully updated', _id: testId });
    });

    // 9. Update an issue with missing _id
    it('Update an issue with missing _id', async function() {
        const res = await request(app)
            .put('/api/issues/test-project')
            .send({ issue_text: 'No ID' });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
    });

    // 10. Update an issue with no fields to update
    it('Update an issue with no fields to update', async function() {
        const res = await request(app)
            .put('/api/issues/test-project')
            .send({ _id: testId });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: testId });
    });

    // 11. Update an issue with an invalid _id
    it('Update an issue with an invalid _id', async function() {
        const res = await request(app)
            .put('/api/issues/test-project')
            .send({ _id: 'invalidid123', issue_text: 'Fail update' });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not update', _id: 'invalidid123' });
    });

    // 12. Delete an issue
    it('Delete an issue', async function() {
        const res = await request(app)
            .delete('/api/issues/test-project')
            .send({ _id: testId });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { result: 'successfully deleted', _id: testId });
    });

    // 13. Delete an issue with an invalid _id
    it('Delete an issue with an invalid _id', async function() {
        const res = await request(app)
            .delete('/api/issues/test-project')
            .send({ _id: 'invalidid123' });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'could not delete', _id: 'invalidid123' });
    });

    // 14. Delete an issue with missing _id
    it('Delete an issue with missing _id', async function() {
        const res = await request(app)
            .delete('/api/issues/test-project')
            .send({});

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
    });

});
