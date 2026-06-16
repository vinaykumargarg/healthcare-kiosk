import React, { useState, useEffect } from 'react';
import API_BASE from '../config';

const STATES = {
  UP:'Uttar Pradesh', MP:'Madhya Pradesh', RJ:'Rajasthan', BR:'Bihar',
  MH:'Maharashtra', GJ:'Gujarat', HR:'Haryana', PB:'Punjab',
  TN:'Tamil Nadu', KA:'Karnataka', AP:'Andhra Pradesh', WB:'West Bengal',
};

const PROVIDER_TYPES = [
  { id:'lab',       label:'Diagnostic Lab',    icon:'🧪', desc:'Blood tests, X-Ray, Scans' },
  { id:'pharmacy',  label:'Pharmacy / Chemist', icon:'💊', desc:'Medicine store, drug store' },
  { id:'doctor',    label:'Doctor / Clinic',    icon:'👨‍⚕️', desc:'Individual clinic/specialist' },
  { id:'hospital',  label:'Hospital',           icon:'🏥', desc:'Full-facility hospital' },
  { id:'ambulance', label:'Ambulance Service',  icon:'🚑', desc:'Emergency transport' },
];

const card = {
  background: 'var(--surface-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '18px',
  backdropFilter: 'blur(14px)',
  transition: 'background-color 0.4s ease, border-color 0.4s ease',
};

const inputS = {
  background: 'var(--input-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: 'var(--text-primary)',
  fontFamily: "'Inter','Mukta',sans-serif",
  fontSize: '1rem',
  width: '100%',
  outline: 'none',
};

const labelS = {
  display: 'block',
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  fontWeight: 500,
  marginBottom: '6px',
};

/* ══════════════════════════════════════════════
   Provider Portal — Self Registration + Dashboard
   ══════════════════════════════════════════════ */
export const ProviderPortal = ({ user, onLogout }) => {
  const [tab, setTab]           = useState('register'); // register | dashboard
  const [myProviders, setMyProviders] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    type: 'lab',
    name: '', name_hi: '',
    address: '', pincode: '', district: '', state: 'UP',
    phone: '', whatsapp: '',
    services: '',
    timings: '',
    accepts_ayushman: false,
    accepts_pmjay: false,
    license: '',
  });

  const fetchMyProviders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/my-providers/${user.id}`);
      setMyProviders(await res.json());
    } catch { setMyProviders([]); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === 'dashboard') fetchMyProviders();
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const services = form.services.split(',').map(s=>s.trim()).filter(Boolean);
    try {
      const res = await fetch(`${API_BASE}/api/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, services, owner_user_id: user?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('🎉 Your listing is submitted! It will be visible to patients near your area. Now switch to "My Listings" tab.');
        setForm({ type:'lab', name:'', name_hi:'', address:'', pincode:'', district:'', state:'UP', phone:'', whatsapp:'', services:'', timings:'', accepts_ayushman:false, accepts_pmjay:false, license:'' });
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch { setError('Server error. Is the backend running?'); }
  };

  const toggleOpenClose = async (provider) => {
    await fetch(`${API_BASE}/api/providers/${provider.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...provider, open_now: provider.open_now ? 0 : 1 }),
    });
    fetchMyProviders();
  };

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ padding:'28px 24px', minHeight:'100vh', color:'var(--text-primary)', fontFamily:"'Inter','Mukta',sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:4 }}>
            🏪 Provider Portal <span style={{ fontWeight:300, opacity:0.6, fontSize:'0.8em' }}>/ प्रदाता पोर्टल</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', fontFamily:"'Mukta',sans-serif" }}>
            Register your Lab, Pharmacy, Hospital or Clinic — be visible to millions of patients
          </p>
        </div>
        <button onClick={onLogout} className="glass-button" style={{ padding:'10px 20px', borderRadius:'10px', fontSize:'0.9rem', fontWeight:600 }}>
          Logout / लॉगआउट
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:28 }}>
        {[['register','➕ Register Listing'],['dashboard','📋 My Listings']].map(([id,lbl]) => (
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:'10px 22px', borderRadius:'12px', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'0.9rem',
              background: tab===id ? 'linear-gradient(135deg,#0EA5E9,#0284C7)' : 'var(--button-secondary-bg)',
              color: tab===id ? 'white' : 'var(--button-secondary-text)', boxShadow: tab===id ? '0 4px 16px rgba(14,165,233,0.3)' : 'none' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── REGISTER TAB ── */}
      {tab === 'register' && (
        <div style={{ maxWidth:720 }}>
          {success && <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid #10B981', color:'#6EE7B7', padding:'14px 18px', borderRadius:'12px', marginBottom:20 }}>{success}</div>}
          {error   && <div style={{ background:'rgba(239,68,68,0.1)',   border:'1px solid #EF4444',  color:'#FCA5A5',  padding:'14px 18px', borderRadius:'12px', marginBottom:20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:22 }}>

            {/* Provider Type */}
            <div>
              <label style={labelS}>Provider Type / प्रदाता प्रकार *</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
                {PROVIDER_TYPES.map(t => (
                  <button key={t.id} type="button" onClick={() => upd('type', t.id)}
                    style={{ padding:'14px 12px', borderRadius:'14px', border:`2px solid ${form.type===t.id?'#0EA5E9':'var(--border-color)'}`,
                      background: form.type===t.id ? 'rgba(14,165,233,0.12)' : 'var(--chip-bg)',
                      color:'var(--text-primary)', cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.2s' }}>
                    <div style={{ fontSize:'1.6rem', marginBottom:6 }}>{t.icon}</div>
                    <div style={{ fontWeight:600, fontSize:'0.88rem', marginBottom:2 }}>{t.label}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-tertiary)' }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Names */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={labelS}>Business Name (English) *</label>
                <input required value={form.name} onChange={e=>upd('name',e.target.value)} placeholder="e.g. Shree Ram Lab" style={inputS} />
              </div>
              <div>
                <label style={labelS}>Business Name (Hindi) / व्यवसाय नाम</label>
                <input value={form.name_hi} onChange={e=>upd('name_hi',e.target.value)} placeholder="जैसे श्री राम लैब" style={inputS} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label style={labelS}>Full Address / पूरा पता *</label>
              <input required value={form.address} onChange={e=>upd('address',e.target.value)} placeholder="Shop No., Street, Landmark, Village" style={inputS} />
            </div>

            {/* Location row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
              <div>
                <label style={labelS}>Pincode / पिनकोड *</label>
                <input required value={form.pincode} onChange={e=>upd('pincode',e.target.value)} placeholder="e.g. 201306" maxLength={6} style={inputS} />
              </div>
              <div>
                <label style={labelS}>District / जिला *</label>
                <input required value={form.district} onChange={e=>upd('district',e.target.value)} placeholder="e.g. Noida" style={inputS} />
              </div>
              <div>
                <label style={labelS}>State / राज्य *</label>
                <select value={form.state} onChange={e=>upd('state',e.target.value)} style={{ ...inputS, cursor:'pointer' }}>
                  {Object.entries(STATES).map(([k,v]) => <option key={k} value={k} style={{background:'var(--select-option-bg)', color:'var(--text-primary)'}}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* Contact */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={labelS}>Phone Number / फ़ोन नंबर *</label>
                <input required type="tel" value={form.phone} onChange={e=>upd('phone',e.target.value)} placeholder="+91 98765 43210" style={inputS} />
              </div>
              <div>
                <label style={labelS}>WhatsApp (optional)</label>
                <input type="tel" value={form.whatsapp} onChange={e=>upd('whatsapp',e.target.value)} placeholder="+91 98765 43210" style={inputS} />
              </div>
            </div>

            {/* Services */}
            <div>
              <label style={labelS}>Services Offered / सेवाएं (comma separated)</label>
              <input value={form.services} onChange={e=>upd('services',e.target.value)} placeholder="e.g. CBC, X-Ray, Ultrasound, Typhoid" style={inputS} />
            </div>

            {/* Timings */}
            <div>
              <label style={labelS}>Timings / समय</label>
              <input value={form.timings} onChange={e=>upd('timings',e.target.value)} placeholder="e.g. 8AM–8PM  or  24 hrs" style={inputS} />
            </div>

            {/* Checkboxes */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
              {[['accepts_ayushman','✅ Accepts Ayushman Bharat'],['accepts_pmjay','✅ Accepts PM-JAY']].map(([key,lbl]) => (
                <label key={key} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', background:'rgba(16,185,129,0.05)', border:`1px solid ${form[key]?'#10B981':'var(--border-color)'}`, padding:'12px 18px', borderRadius:'12px', transition:'all 0.2s', color:'var(--text-primary)' }}>
                  <input type="checkbox" checked={form[key]} onChange={e=>upd(key,e.target.checked)} style={{ width:18, height:18, accentColor:'#10B981', flexShrink:0 }} />
                  <span style={{ fontWeight:500 }}>{lbl}</span>
                </label>
              ))}
            </div>

            {/* License */}
            <div>
              <label style={labelS}>License / Registration No. (optional)</label>
              <input value={form.license} onChange={e=>upd('license',e.target.value)} placeholder="For trust badge — NABL / DGHS / MCI No." style={inputS} />
            </div>

            {/* Submit */}
            <button type="submit"
              style={{ padding:'16px', background:'linear-gradient(135deg,#0EA5E9,#0284C7)', border:'none', borderRadius:'14px', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 20px rgba(14,165,233,0.35)', transition:'all 0.25s' }}
              onMouseEnter={e=>e.target.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.target.style.transform='translateY(0)'}>
              🚀 Submit Listing / सूची दर्ज करें
            </button>
          </form>
        </div>
      )}

      {/* ── DASHBOARD TAB ── */}
      {tab === 'dashboard' && (
        <div>
          {loading ? (
            <p style={{ color:'var(--text-tertiary)' }}>Loading your listings...</p>
          ) : myProviders.length === 0 ? (
            <div style={{ ...card, padding:40, textAlign:'center', color:'var(--text-tertiary)' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>📭</div>
              <h3>No listings yet</h3>
              <p>Go to "Register Listing" tab to add your lab, pharmacy, or clinic.</p>
              <button onClick={()=>setTab('register')} style={{ padding:'12px 24px', background:'linear-gradient(135deg,#0EA5E9,#0284C7)', border:'none', borderRadius:'10px', color:'white', cursor:'pointer', fontFamily:'inherit', fontWeight:600, marginTop:12 }}>
                + Add Listing
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {myProviders.map(p => {
                const services = (() => { try { return JSON.parse(p.services||'[]'); } catch { return []; } })();
                return (
                  <div key={p.id} style={{ ...card, padding:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
                    <div style={{ flex:1 }}>
                      <h3 style={{ margin:'0 0 4px' }}>{p.name}</h3>
                      <p style={{ margin:'0 0 6px', fontSize:'0.85rem', color:'var(--text-secondary)' }}>📍 {p.address} · {p.district}, {p.state}</p>
                      <p style={{ margin:'0 0 8px', fontSize:'0.85rem', color:'var(--text-primary)' }}>📱 {p.phone}  ·  ⏰ {p.timings}</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {services.slice(0,5).map((s,i)=><span key={i} style={{ background:'var(--chip-bg)', border:'1px solid var(--chip-border)', padding:'3px 9px', borderRadius:'8px', fontSize:'0.77rem', color:'var(--text-secondary)' }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
                      <span style={{ background:p.open_now?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color:p.open_now?'#10B981':'#EF4444', padding:'4px 12px', borderRadius:'20px', fontWeight:700, fontSize:'0.85rem', border:`1px solid ${p.open_now?'#10B981':'#EF4444'}` }}>
                        {p.open_now ? '🟢 Open' : '🔴 Closed'}
                      </span>
                      <button onClick={()=>toggleOpenClose(p)}
                        style={{ padding:'8px 16px', background:'var(--button-secondary-bg)', border:'1px solid var(--border-color)', borderRadius:'10px', color:'var(--button-secondary-text)', cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem' }}>
                        {p.open_now ? 'Mark Closed' : 'Mark Open'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
