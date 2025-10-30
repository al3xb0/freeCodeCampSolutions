import Issue from '../models/issue.js';

export async function createIssue(req, res) {
    const { project } = req.params;
    const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

    if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
    }

    const newIssue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        project
    });

    await newIssue.save();
    res.json(newIssue);
}

export async function viewIssues(req, res) {
    const { project } = req.params;
    const filters = { ...req.query, project };

    if (filters.open !== undefined) {
        filters.open = filters.open === 'true';
    }

    const issues = await Issue.find(filters).exec();
    res.json(issues);
}

export async function updateIssue(req, res) {
    const { project } = req.params;
    const { _id, ...updates } = req.body;

    if (!_id) return res.json({ error: 'missing _id' });

    if (Object.keys(updates).length === 0) return res.json({ error: 'no update field(s) sent', _id });

    try {
        updates.updated_on = new Date();
        const issue = await Issue.findByIdAndUpdate(_id, updates, { new: true }).exec();
        if (!issue) return res.json({ error: 'could not update', _id });
        res.json({ result: 'successfully updated', _id });
    } catch (err) {
        res.json({ error: 'could not update', _id });
    }
}

export async function deleteIssue(req, res) {
    const { _id } = req.body;
    if (!_id) return res.json({ error: 'missing _id' });

    try {
        const deleted = await Issue.findByIdAndDelete(_id).exec();
        if (!deleted) return res.json({ error: 'could not delete', _id });
        res.json({ result: 'successfully deleted', _id });
    } catch (err) {
        res.json({ error: 'could not delete', _id });
    }
}
