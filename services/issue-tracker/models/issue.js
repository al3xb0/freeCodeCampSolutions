import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    open: { type: Boolean, default: true },
    project: { type: String, required: true }
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
