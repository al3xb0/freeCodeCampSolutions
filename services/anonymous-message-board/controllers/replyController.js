import Thread from '../models/thread.js';
import bcrypt from 'bcryptjs';

export async function createReply(req, res) {
  try {
    const { board } = req.params;
    const { thread_id, text, delete_password } = req.body;
    if (!thread_id || !text || !delete_password) return res.status(400).send('missing fields');
    const hash = await bcrypt.hash(delete_password, 10);
    const t = await Thread.findById(thread_id);
    if (!t) return res.status(404).send('thread not found');
    t.replies.push({ text, delete_password: hash, created_on: new Date(), reported: false });
    t.bumped_on = new Date();
    await t.save();
    const threadObj = t.toObject();
    delete threadObj.delete_password;
    delete threadObj.reported;
    threadObj.replies = (threadObj.replies||[]).map(r=>({ _id: r._id, text: r.text, created_on: r.created_on }));
    res.json(threadObj);
  } catch (e) {
    res.status(500).send('internal error');
  }
}

export async function getThreadWithReplies(req, res) {
  try {
    const { thread_id } = req.query;
    if (!thread_id) return res.status(400).send('missing fields');
    const t = await Thread.findById(thread_id).lean();
    if (!t) return res.status(404).send('thread not found');
    const threadObj = {
      _id: t._id,
      text: t.text,
      created_on: t.created_on,
      bumped_on: t.bumped_on,
      replies: (t.replies||[]).map(r=>({ _id: r._id, text: r.text, created_on: r.created_on }))
    };
    res.json(threadObj);
  } catch (e) {
    res.status(500).send('internal error');
  }
}

export async function deleteReply(req, res) {
  try {
    const { thread_id, reply_id, delete_password } = req.body;
    if (!thread_id || !reply_id || !delete_password) return res.status(400).send('missing fields');
    const t = await Thread.findById(thread_id);
    if (!t) return res.status(404).send('thread not found');
    const r = t.replies.id(reply_id);
    if (!r) return res.status(404).send('reply not found');
    const ok = await bcrypt.compare(delete_password, r.delete_password);
    if (!ok) return res.send('incorrect password');
    r.text = '[deleted]';
    await t.save();
    res.send('success');
  } catch (e) {
    res.status(500).send('internal error');
  }
}

export async function reportReply(req, res) {
  try {
    const { thread_id, reply_id } = req.body;
    if (!thread_id || !reply_id) return res.status(400).send('missing fields');
    const t = await Thread.findById(thread_id);
    if (!t) return res.status(404).send('thread not found');
    const r = t.replies.id(reply_id);
    if (!r) return res.status(404).send('reply not found');
    r.reported = true;
    await t.save();
    res.send('reported');
  } catch (e) {
    res.status(500).send('internal error');
  }
}
