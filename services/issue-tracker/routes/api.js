import express from 'express';
import { createIssue, viewIssues, updateIssue, deleteIssue } from '../controllers/issueController.js';

const router = express.Router();

router.route('/issues/:project')
    .post(createIssue)
    .get(viewIssues)
    .put(updateIssue)
    .delete(deleteIssue);

export default router;
