import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function IssueTracker() {
    const [issues, setIssues] = useState([]);
    const [form, setForm] = useState({
        issue_title: '',
        issue_text: '',
        created_by: '',
        assigned_to: '',
        status_text: ''
    });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchIssues = async () => {
        try {
            const res = await axios.get('/api/issues/test-project');
            setIssues(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/issues/test-project', form);
            setIssues([res.data, ...issues]);
            setForm({ issue_title: '', issue_text: '', created_by: '', assigned_to: '', status_text: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const toggleOpen = async (issue) => {
        try {
            await axios.put('/api/issues/test-project', { _id: issue._id, open: !issue.open });
            setIssues(issues.map(i => i._id === issue._id ? { ...i, open: !i.open } : i));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (_id) => {
        try {
            await axios.delete('/api/issues/test-project', { data: { _id } });
            setIssues(issues.filter(i => i._id !== _id));
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (issue) => {
        setEditId(issue._id);
        setEditForm({
            issue_title: issue.issue_title,
            issue_text: issue.issue_text,
            assigned_to: issue.assigned_to,
            status_text: issue.status_text
        });
    };

    const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const saveEdit = async () => {
        try {
            await axios.put('/api/issues/test-project', { _id: editId, ...editForm });
            setIssues(issues.map(i => i._id === editId ? { ...i, ...editForm } : i));
            setEditId(null);
            setEditForm({});
        } catch (err) {
            console.error(err);
        }
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditForm({});
    };

    return (
        <div className="container">
            <h1>Issue Tracker</h1>

            <form className="converter-form" onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    className="converter-input"
                    type="text"
                    name="issue_title"
                    placeholder="Title"
                    value={form.issue_title}
                    onChange={handleChange}
                    required
                />
                <label>Text</label>
                <input
                    className="converter-input"
                    type="text"
                    name="issue_text"
                    placeholder="Text"
                    value={form.issue_text}
                    onChange={handleChange}
                    required
                />
                <label>Created by</label>
                <input
                    className="converter-input"
                    type="text"
                    name="created_by"
                    placeholder="Created by"
                    value={form.created_by}
                    onChange={handleChange}
                    required
                />
                <label>Assigned to</label>
                <input
                    className="converter-input"
                    type="text"
                    name="assigned_to"
                    placeholder="Assigned to"
                    value={form.assigned_to}
                    onChange={handleChange}
                />
                <label>Status</label>
                <input
                    className="converter-input"
                    type="text"
                    name="status_text"
                    placeholder="Status"
                    value={form.status_text}
                    onChange={handleChange}
                />
                <button className="converter-button" type="submit">Create Issue</button>
            </form>

            <div className="result" style={{ marginTop: '30px' }}>
                {issues.map(issue => (
                    <div
                        key={issue._id}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            backgroundColor: '#fefefe'
                        }}
                    >
                        {editId === issue._id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label>Title</label>
                                <input
                                    className="converter-input"
                                    type="text"
                                    name="issue_title"
                                    value={editForm.issue_title}
                                    onChange={handleEditChange}
                                />
                                <label>Text</label>
                                <input
                                    className="converter-input"
                                    type="text"
                                    name="issue_text"
                                    value={editForm.issue_text}
                                    onChange={handleEditChange}
                                />
                                <label>Assigned to</label>
                                <input
                                    className="converter-input"
                                    type="text"
                                    name="assigned_to"
                                    value={editForm.assigned_to}
                                    onChange={handleEditChange}
                                />
                                <label>Status</label>
                                <input
                                    className="converter-input"
                                    type="text"
                                    name="status_text"
                                    value={editForm.status_text}
                                    onChange={handleEditChange}
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button className="converter-button" style={{ backgroundColor: '#10b981' }} onClick={saveEdit}>Save</button>
                                    <button className="converter-button" style={{ backgroundColor: '#f59e0b' }} onClick={cancelEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p><strong>{issue.issue_title}</strong> - {issue.issue_text}</p>
                                <p>Created by: {issue.created_by} | Assigned to: {issue.assigned_to}</p>
                                <p>Status: {issue.status_text} | {issue.open ? 'Open' : 'Closed'}</p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        className="converter-button"
                                        style={{ backgroundColor: '#f59e0b' }}
                                        onClick={() => toggleOpen(issue)}
                                    >
                                        Toggle Open
                                    </button>
                                    <button
                                        className="converter-button"
                                        style={{ backgroundColor: '#3b82f6' }}
                                        onClick={() => startEdit(issue)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="converter-button"
                                        style={{ backgroundColor: '#ef4444' }}
                                        onClick={() => handleDelete(issue._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
