import React, { useState } from 'react';
import axios from 'axios';

export default function StockChecker() {
  const [single, setSingle] = useState('');
  const [singleLike, setSingleLike] = useState(false);
  const [singleResult, setSingleResult] = useState(null);
  const [singleError, setSingleError] = useState('');
  const [singleLoading, setSingleLoading] = useState(false);

  const [compare1, setCompare1] = useState('');
  const [compare2, setCompare2] = useState('');
  const [compareLike, setCompareLike] = useState(false);
  const [compareResult, setCompareResult] = useState(null);
  const [compareError, setCompareError] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);

  const handleSingle = async (e) => {
    e.preventDefault();
    setSingleResult(null);
    setSingleError('');
    setSingleLoading(true);
    if (!single.trim()) {
      setSingleError('Enter a stock symbol.'); setSingleLoading(false); return;
    }
    try {
      const res = await axios.get('/api/stock-prices', {
        params: { stock: single.trim(), like: singleLike }
      });
      console.log('SINGLE RESPONSE', res.data);
      setSingleResult(res.data && res.data.stockData);
    } catch (e) {
      setSingleError(e?.response?.data?.error || 'Error.');
    }
    setSingleLoading(false);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setCompareResult(null);
    setCompareError('');
    setCompareLoading(true);
    if (!compare1.trim() || !compare2.trim()) {
      setCompareError('Enter two symbols.'); setCompareLoading(false); return;
    }
    try {
      const res = await axios.get('/api/stock-prices', {
        params: { stock: [compare1.trim(), compare2.trim()], like: compareLike }
      });
      console.log('COMPARE RESPONSE', res.data);
      setCompareResult(res.data && Array.isArray(res.data.stockData) ? res.data.stockData : null);
    } catch (e) {
      setCompareError(e?.response?.data?.error || 'Error.');
    }
    setCompareLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfd', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '45px 0' }}>
      <div style={{ maxWidth: 600, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 2px 32px #0001', padding: '36px 34px', margin: '0 14px' }}>
        <h1 style={{ textAlign: 'left', fontSize: 28, fontWeight: 700, marginBottom: 26 }}>Stock Price Checker</h1>

        <h2 style={{fontSize:20, fontWeight:700, margin:'24px 2px 6px'}}>Get single price and total likes</h2>
        <form onSubmit={handleSingle} style={{ display:'flex', gap:14, alignItems:'center', marginBottom:10, flexWrap:'wrap' }}>
          <input style={{ maxWidth:130, fontSize:16, borderRadius:7, border:'1.5px solid #a6b6db', padding:'7px', outline:'none' }} value={single} onChange={e=>setSingle(e.target.value)} placeholder="GOOG" />
          <label style={{fontSize:16}}>
            <input type="checkbox" checked={singleLike} onChange={e=>setSingleLike(e.target.checked)} style={{width:19, height:19}}/> Like?
          </label>
          <button className="converter-button" style={{ minWidth:90, padding:'7px 18px', fontWeight:600 }}>Get Price!</button>
        </form>
        {singleLoading && <div style={{textAlign:'left', color:'#7b8cce', margin:'6px 2px 11px 2px'}}>Loading…</div>}
        {singleError && <div style={{color:'#d90429', background:'#f8e3e1', borderRadius:8, fontWeight:600, fontSize:15, padding:'8px', marginBottom:7, marginTop:2}}>{singleError}</div>}
        {singleResult && (
          <div style={{background:'#f6faff', borderRadius:11, padding:'18px 16px 8px', margin:'0 0 15px 0', minWidth:180, maxWidth:310, fontSize:17, fontWeight:500}}>
            <div>Symbol: <b>{singleResult.stock}</b></div>
            <div>Price: <b>${singleResult.price}</b></div>
            <div>Total Likes: <b>{singleResult.likes}</b></div>
          </div>
        )}

        <h2 style={{fontSize:20, fontWeight:700, margin:'32px 2px 10px'}}>Compare and get relative likes</h2>
        <form onSubmit={handleCompare} style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', marginBottom:10 }}>
          <input style={{ maxWidth:90, fontSize:16, borderRadius:7, border:'1.5px solid #a6b6db', padding:'7px', outline:'none' }} value={compare1} onChange={e=>setCompare1(e.target.value)} placeholder="GOOG" />
          <input style={{ maxWidth:90, fontSize:16, borderRadius:7, border:'1.5px solid #a6b6db', padding:'7px', outline:'none' }} value={compare2} onChange={e=>setCompare2(e.target.value)} placeholder="MSFT" />
          <label style={{fontSize:15,marginLeft:3, marginRight:15}}>
            <input type="checkbox" checked={compareLike} onChange={e=>setCompareLike(e.target.checked)} style={{width:17, height:17, marginRight:5}}/> Like both?
          </label>
          <button className="converter-button" style={{ minWidth:90, padding:'7px 18px', fontWeight:600 }}>Get Price!</button>
        </form>
        {compareLoading && <div style={{textAlign:'left', color:'#7b8cce', margin:'6px 2px 11px 2px'}}>Loading…</div>}
        {compareError && <div style={{color:'#d90429', background:'#f8e3e1', borderRadius:8, fontWeight:600, fontSize:15, padding:'8px', marginBottom:8, marginTop:2}}>{compareError}</div>}
        {compareResult && (
          <div style={{display:'flex', gap:20, flexWrap:'wrap', margin:'8px 0 0 2px'}}>
            {compareResult.map((s,i)=>{
              const diff = s.rel_likes;
              const text = diff > 0 ? `${diff} more likes than the other` : diff < 0 ? `${Math.abs(diff)} fewer likes than the other` : 'same number of likes';
              const color = diff > 0 ? '#128c37' : diff < 0 ? '#d90429' : '#888';
              return (
                <div key={s.stock} style={{background:'#f6faff', borderRadius:11, padding:'17px 13px 8px', minWidth:150, fontSize:17, fontWeight:500}}>
                  <div>Symbol: <b>{s.stock}</b></div>
                  <div>Price: <b>${s.price}</b></div>
                  <div style={{marginTop:6, color}}>{text}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
