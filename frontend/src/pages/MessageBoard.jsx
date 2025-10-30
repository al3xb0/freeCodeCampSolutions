import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MessageBoard() {
  const [board, setBoard] = useState('general');
  const [threads, setThreads] = useState([]);
  const [text, setText] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replyPw, setReplyPw] = useState('');
  const [replyError, setReplyError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setSelected(null); setReplies([]); setReplyText(''); setReplyPw('');
    axios.get(`/api/threads/${board}`).then(r=>setThreads(r.data)).catch(()=>setThreads([]));
  }, [board, refresh]);

  const createThread = async (e) => {
    e.preventDefault(); setError('');
    if (!text.trim() || !pw.trim()) { setError('Text and password required.'); return; }
    await axios.post(`/api/threads/${board}`, { text, delete_password: pw });
    setText(''); setPw(''); setRefresh(v=>!v);
  };

  const reportThread = async (tid) => {
    await axios.put(`/api/threads/${board}`, { thread_id: tid }); setRefresh(v=>!v); };
  const deleteThread = async (tid) => {
    const pwd = prompt('Thread delete password:');
    if (pwd) { await axios.delete(`/api/threads/${board}`, { data: { thread_id: tid, delete_password: pwd } }); setRefresh(v=>!v); }
  };

  const openThread = async (tid) => {
    setSelected(tid); setReplyText(''); setReplyPw(''); setReplies([]); setReplyError('');
    const r = await axios.get(`/api/replies/${board}?thread_id=${tid}`);
    setReplies((r.data?.replies||[]));
  };

  const addReply = async (e) => {
    e.preventDefault(); setReplyError('');
    if (!replyText.trim() || !replyPw.trim()) { setReplyError('Text and password required.'); return; }
    await axios.post(`/api/replies/${board}`, { thread_id: selected, text: replyText, delete_password: replyPw });
    setReplyText(''); setReplyPw(''); openThread(selected); setRefresh(v=>!v);
  };
  const reportReply = async rid => { await axios.put(`/api/replies/${board}`, { thread_id: selected, reply_id: rid }); openThread(selected); };
  const deleteReply = async rid => {
    const pwd = prompt('Reply delete password:');
    if (pwd) { await axios.delete(`/api/replies/${board}`, { data: { thread_id: selected, reply_id: rid, delete_password: pwd } }); openThread(selected); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfd', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 0' }}>
      <div style={{ maxWidth:820, width:'100%', background: '#fff', borderRadius: 18, boxShadow: '0 2px 32px #0001', padding: '32px 24px', margin: '0 12px' }}>
        <h1 style={{ fontSize: 29, fontWeight: 800, marginBottom: 10 }}>Message Board</h1>
        <form onSubmit={e=>{e.preventDefault(); setBoard(board.trim()||'general');}} style={{margin:'10px 0 20px', display:'flex',gap:13,alignItems:'center'}}>
          <input value={board} onChange={e=>setBoard(e.target.value)} style={{border:'1.5px solid #b7caf2', borderRadius:7, fontSize:16, padding:'6px 11px',maxWidth:120}} placeholder="board" />
          <span style={{color:'#789', fontWeight:500}}>Current: <b>{board||'general'}</b></span>
        </form>
        <form onSubmit={createThread} style={{display: 'flex',gap:10,alignItems:'center',marginBottom:12,flexWrap:'wrap'}}>
          <textarea value={text} onChange={e=>setText(e.target.value)} style={{border:'1.5px solid #a6b6db', borderRadius:7, fontSize:15, minHeight:30, padding:'7px 9px 7px 9px',maxWidth:350,minWidth:180}} placeholder="New thread text"/>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Delete password" style={{fontSize:15,padding:'7px 9px',maxWidth:130,borderRadius:7,border:'1.5px solid #a6b6db'}}/>
          <button className="converter-button">Create Thread</button>
        </form>
        {error && <div style={{color:'#d90429', background:'#f8e3e1', borderRadius:8, padding:'6.5px', fontWeight:600, maxWidth:280, marginBottom:7}}>{error}</div>}
        <div style={{marginTop:18, marginBottom:38}}>
          {threads.length === 0 ? <div style={{color:'#888',fontWeight:500}}>No threads yet.</div> : (
            threads.map(t=>(
              <div key={t._id} style={{border:'1.5px solid #e0e7ef',borderRadius:12,padding:'14px 19px',background:selected===t._id?'#f0f5ff':'#f0f1f9',marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontWeight:700,fontSize:17}}>{t.text}</div>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <button className="converter-button" style={{background:'#8b5cf6'}} type="button" onClick={()=>reportThread(t._id)}>Report</button>
                    <button className="converter-button" style={{background:'#ef4444'}} type="button" onClick={()=>deleteThread(t._id)}>Delete</button>
                    <button className="converter-button" style={{background:'#3b82f6'}} type="button" onClick={()=>openThread(t._id)}>Show all</button>
                  </div>
                </div>
                <div style={{marginTop:7,marginBottom:4,color:'#4d5777'}}><b>Created:</b> {new Date(t.created_on).toLocaleString()} | <b>Replies:</b> {t.replycount}</div>
                <div style={{marginTop:6,display:'flex',gap:11,flexWrap:'wrap'}}>
                  {(t.replies || []).map(r=>(
                    <div key={r._id} style={{background:'#e8ecef', fontSize:15, padding:'6px 10px 5px 10px',borderRadius:8,marginBottom:3,minWidth:70}}>{r.text}</div>
                  ))}
                </div>
              </div>
            )))}
        </div>
        {selected && (
          <div style={{background:'#f6faff',border:'2.5px solid #d3e8fd', borderRadius:13,margin:'8px 0 46px',padding:'25px 22px',maxWidth:600}}>
            <div style={{fontWeight:800,fontSize:18,marginBottom:7}}>Thread: {threads.find(x=>x._id===selected)?.text}</div>
            <form onSubmit={addReply} style={{gap:8,display:'flex',alignItems:'center',marginBottom:12}}>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} style={{minHeight:28, fontSize:15, borderRadius:7, border:'1.5px solid #b3baf2', padding:'6px 10px', maxWidth:260}} placeholder="New reply text"/>
              <input type="password" value={replyPw} onChange={e=>setReplyPw(e.target.value)} placeholder="Delete password" style={{fontSize:15, padding:'7px 9px', maxWidth:115, borderRadius:7, border:'1.5px solid #a6b6db'}}/>
              <button className="converter-button">Add Reply</button>
            </form>
            {replyError && <div style={{color:'#d90429', background:'#f8e3e1', borderRadius:7, padding:'6px 10px', fontWeight:600, marginBottom:6, maxWidth:270}}>{replyError}</div>}
            <div style={{marginTop:7}}>
              {(replies||[]).map(r=>(
                <div key={r._id} style={{background:'#eaf0ff',fontSize:15,padding:'7px 10px 6px',borderRadius:8,marginBottom:7,minWidth:70,display:'flex',alignItems:'center',gap:8}}>
                  <span style={{flex:1,wordBreak:'break-word'}}>{r.text}</span>
                  <button className="converter-button" style={{background:'#8b5cf6',fontSize:13}} type="button" onClick={()=>reportReply(r._id)}>Report</button>
                  <button className="converter-button" style={{background:'#ef4444',fontSize:13}} type="button" onClick={()=>deleteReply(r._id)}>Delete</button>
                </div>
              ))}
            </div>
            <button className="converter-button" style={{background:'#3b82f6',marginTop:14}} type="button" onClick={()=>{setSelected(null);setReplies([]);}}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
