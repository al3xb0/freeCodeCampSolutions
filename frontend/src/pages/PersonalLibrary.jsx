import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PersonalLibrary() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/books');
      setBooks(res.data);
    } catch (e) {
      setBooks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post('/api/books', { title });
      setBooks([ ...books, res.data ]);
      setTitle('');
    } catch (e) {}
  };

  const showDetails = async (book) => {
    setSelected(book);
    setComment('');
    try {
      const res = await axios.get('/api/books/' + book._id);
      setComments(res.data.comments || []);
    } catch (e) {
      setComments([]);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment || !selected) return;
    try {
      const res = await axios.post(`/api/books/${selected._id}`, { comment });
      setComments(res.data.comments || []);
      setBooks(books.map(b => b._id === selected._id ? { ...b, commentcount: res.data.comments.length } : b));
      setComment('');
    } catch (e) {}
  };

  const deleteBook = async (book) => {
    await axios.delete(`/api/books/${book._id}`);
    setBooks(books.filter(b => b._id !== book._id));
    if (selected && selected._id === book._id) {
      setSelected(null);
      setComments([]);
    }
  };

  const deleteAll = async () => {
    await axios.delete('/api/books');
    setBooks([]);
    setSelected(null);
    setComments([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '48px 0' }}>
      <div style={{ maxWidth: 980, width: '100%', background: '#fff', borderRadius: 20, boxShadow: '0 2px 32px #0001', padding: '36px 32px', margin: '0 16px' }}>
        <h1 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, letterSpacing: '-.04em', marginBottom: 26 }}>Personal Library</h1>
        <form className="converter-form" onSubmit={addBook} style={{marginBottom:24, gap:16, display: 'flex', flexWrap: 'wrap', justifyContent:'center'}}>
          <input 
            style={{ minWidth:160, flex:1, maxWidth:320, marginRight:18 }}
            className="converter-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Book title" required />
          <button className="converter-button" style={{ minWidth:110 }}>Add</button>
          <button type="button" className="converter-button" style={{ background:'#dc2626', minWidth:110, marginLeft:0 }} onClick={deleteAll}>Delete All</button>
        </form>
        <div style={{ display:'flex', gap:40, flexWrap:'wrap-reverse' }}>
          <div style={{flex:'1 1 280px', minWidth:230, maxHeight: '62vh', overflow:'auto', paddingRight:10 }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, margin:'8px 0 16px 4px' }}>Books <span style={{ color: '#64748b' }}>({books.length})</span></h3>
            {loading ? <div>Loading...</div> : books.length===0 ? <div style={{ color:'#7c7c7c', marginTop:16, fontWeight:500 }}>No books</div> : (
              <ul style={{padding:0, margin:0, listStyle:'none'}}>
                {books.map(book => (
                  <li key={book._id}
                    style={{
                      marginBottom:10,
                      cursor:'pointer',
                      padding:'14px 18px',
                      background:selected&&selected._id===book._id?'#e8effe':'#f4f7fa',
                      borderRadius:10,
                      boxShadow:selected&&selected._id===book._id?'0 1px 8px #3085fb33':'0 1px 4px #0001',
                      border: selected&&selected._id===book._id ? '2.5px solid #3b82f6' : '2px solid #e0e7ef',
                      color: selected&&selected._id===book._id ? '#222' : '#48505d',
                      transition: 'all .17s cubic-bezier(.4,0,.2,1)',
                      fontWeight:600,
                      fontSize:16
                    }}
                    onClick={()=>showDetails(book)}
                  >
                    <b>{book.title}</b> &nbsp; <span style={{color:'#64748b'}}>({book.commentcount} comments)</span>
                    <button 
                      className="converter-button"
                      style={{marginLeft:18, background:'#ef4444', fontWeight:600, fontSize:14, padding:'6px 16px', borderRadius:7}}
                      type="button" 
                      onClick={e=>{e.stopPropagation();deleteBook(book)}}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{flex:'2 1 360px', minWidth:290}}>
            {selected ? (
              <div style={{
                border:'2px solid #e0e7ef',
                borderRadius:16, 
                padding:'28px 30px',
                background:'#f6faff',
                boxShadow:'0 2px 24px #3085fb15',
                minHeight:200,
                marginTop:4
              }}>
                <h3 style={{ marginBottom: 14, fontWeight: 700, fontSize: 22 }}>{selected.title}</h3>
                <div style={{color:'#334', fontSize:15, marginBottom:6}}><b>_id:</b> {selected._id}</div>
                <hr style={{marginTop:12, marginBottom:19}} />
                <h4 style={{margin:'0 0 12px 1px', fontWeight:600, fontSize:18, color:'#0e41cf'}}>Comments</h4>
                {comments.length === 0 ? <div style={{ color:'#888',fontSize:15 }}>No comments</div> : (
                  <ul style={{ margin:0, paddingLeft:16 }}>
                    {comments.map((c, i)=> <li key={i} style={{fontSize:15, marginBottom:3}}>{c}</li> )}
                  </ul>
                )}
                <form onSubmit={addComment} style={{marginTop:24, display:'flex', gap:12, alignItems:'center'}}>
                  <input className="converter-input" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment..." required style={{minWidth:0, flex:1, fontSize:15}} />
                  <button className="converter-button" style={{fontSize:15, fontWeight:600, padding:'7px 16px'}}>Add</button>
                </form>
              </div>
            ) : (
              <div style={{color:'#7c7c7c', marginTop:60, fontSize:18, textAlign:'center'}}>← Select a book to view details and add comments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
