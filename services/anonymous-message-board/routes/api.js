import express from 'express';
import {
  createThread,
  getRecentThreads,
  deleteThread,
  reportThread
} from '../controllers/threadController.js';
import {
  createReply,
  getThreadWithReplies,
  deleteReply,
  reportReply
} from '../controllers/replyController.js';

const router = express.Router();

// Thread endpoints
router.route('/threads/:board')
  .post(createThread)
  .get(getRecentThreads)
  .delete(deleteThread)
  .put(reportThread);

// Reply endpoints
router.route('/replies/:board')
  .post(createReply)
  .get(getThreadWithReplies)
  .delete(deleteReply)
  .put(reportReply);

export default router;
