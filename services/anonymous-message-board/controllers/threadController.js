import Thread from '../models/thread.js';
import bcrypt from 'bcryptjs';

export async function createThread(req, res) {
  try {
    const { board } = req.params;
    const { text, delete_password } = req.body;
    if (!text || !delete_password) return res.status(400).json({ error: 'Text and password required' });
    const hash = await bcrypt.hash(delete_password, 10);
    const t = new Thread({
      board,
      text,
      delete_password: hash,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      replies: []
    });
    await t.save();
    res.json({
      _id: t._id,
      board: t.board,
      text: t.text,
      created_on: t.created_on,
      bumped_on: t.bumped_on,
      replies: []
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function getRecentThreads(req, res) {
  try {
    const { board } = req.params;
    const threads = await Thread.find({ board })
      .sort({ bumped_on: -1 })
      .limit(10)
      .lean();
    const result = threads.map(t => ({
      _id: t._id,
      text: t.text,
      created_on: t.created_on,
      bumped_on: t.bumped_on,
      replies: (t.replies || []).slice(-3).map(r => ({
        _id: r._id,
        text: r.text,
        created_on: r.created_on
      })),
      replycount: (t.replies || []).length
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function deleteThread(req, res) {
  try {
    const { thread_id, delete_password } = req.body;
    if (!thread_id || !delete_password) return res.status(400).send('missing fields');
    const t = await Thread.findById(thread_id);
    if (!t) return res.status(404).send('thread not found');
    const ok = await bcrypt.compare(delete_password, t.delete_password);
    if (!ok) return res.send('incorrect password');
    await Thread.deleteOne({ _id: thread_id });
    res.send('success');
  } catch (e) {
    res.status(500).send('internal error');
  }
}

export async function reportThread(req, res) {
  try {
    const { thread_id } = req.body;
    if (!thread_id) return res.status(400).send('missing fields');
    const t = await Thread.findById(thread_id);
    if (!t) return res.status(404).send('thread not found');
    t.reported = true;
    await t.save();
    res.send('reported');
  } catch (e) {
    res.status(500).send('internal error');
  }
}
