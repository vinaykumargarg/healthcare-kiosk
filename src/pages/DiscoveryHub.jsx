import React, { useState, useEffect } from 'react';
import API_BASE from '../config';

const STATES = ['UP','MP','RJ','BR','MH','GJ','HR','PB','TN','KA','AP','WB','OD','JH','RJ'];
const STATE_NAMES = { UP:'Uttar Pradesh',MP:'Madhya Pradesh',RJ:'Rajasthan',BR:'Bihar',MH:'Maharashtra',GJ:'Gujarat',HR:'Haryana',PB:'Punjab',TN:'Tamil Nadu',KA:'Karnataka',AP:'Andhra Pradesh',WB:'West Bengal',OD:'Odisha',JH:'Jharkhand' };

const CATEGORIES = [
  { id:'all',       label:'All / सभी',          icon:'🔍', color:'#0EA5E9' },
  { id:'lab',       label:'Labs / लैब',          icon:'🧪', color:'#14B8A6' },
  { id:'pharmacy',  label:'Pharmacy / दवाखाना',   icon:'💊', color:'#10B981' },
  { id:'doctor',    label:'Doctors / डॉक्टर',     icon:'👨‍⚕️', color:'#8B5CF6' },
  { id:'hospital',  label:'Hospital / अस्पताल',   icon:'🏥', color:'#EF4444' },
];

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

/* ── Shared card style ── */
const card = {
  background: 'var(--surface-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '18px',
  padding: '20px',
  backdropFilter: 'blur(14px)',
  transition: 'background-color 0.4s ease, border-color 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease',
};

const pill = (color) => ({
  background: `${color}25`,
  color: color,
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 700,
  border: `1px solid ${color}50`,
  display: 'inline-block',
});

/* ── Provider Card ── */
const ProviderCard = ({ p }) => {
  const services = (() => { try { return JSON.parse(p.services||'[]'); } catch { return []; } })();
  const catColor = CATEGORIES.find(c=>c.id===p.type)?.color || '#0EA5E9';
  const catIcon  = CATEGORIES.find(c=>c.id===p.type)?.icon  || '🏥';

  return (
    <div style={{ ...card, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ fontSize:'1.8rem', background:`${catColor}18`, padding:'8px', borderRadius:'12px', lineHeight:1 }}>{catIcon}</div>
          <div>
            <h3 style={{ margin:0, fontSize:'1.05rem' }}>{p.name}</h3>
            {p.name_hi && <p style={{ margin:0, fontSize:'0.85rem', opacity:0.7, fontFamily:"'Mukta',sans-serif" }}>{p.name_hi}</p>}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          {p.rating && <span style={{ color:'#F59E0B', fontWeight:700, fontSize:'0.9rem' }}>⭐ {p.rating}</span>}
          <span style={{ ...pill(p.open_now?'#10B981':'#EF4444') }}>{p.open_now?'Open':'Closed'}</span>
        </div>
      </div>

      {/* Info rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:12 }}>
        <p style={{ margin:0, fontSize:'0.88rem', color:'var(--text-secondary)' }}>
          📍 {p.address} {p.pincode && `· ${p.pincode}`}
        </p>
        <p style={{ margin:0, fontSize:'0.85rem', color:'var(--text-tertiary)' }}>
          🕐 {p.timings || 'Timings not listed'}
        </p>
        {p.phone && (
          <p style={{ margin:0, fontSize:'0.88rem' }}>
            📱 <a href={`tel:${p.phone.replace(/\s+/g,'')}`} style={{ color:'#10B981', textDecoration:'none' }}>{p.phone}</a>
            {p.whatsapp && <> &nbsp;|&nbsp; <a href={`https://wa.me/${p.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ color:'#25D366', textDecoration:'none' }}>WhatsApp</a></>}
          </p>
        )}
      </div>

      {/* Services chips */}
      {services.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
          {services.slice(0,4).map((s,i) => (
            <span key={i} style={{ background:'var(--chip-bg)', border:'1px solid var(--chip-border)', color:'var(--text-secondary)', padding:'3px 9px', borderRadius:'8px', fontSize:'0.78rem' }}>{s}</span>
          ))}
          {services.length > 4 && <span style={{ fontSize:'0.78rem', opacity:0.5 }}>+{services.length-4} more</span>}
        </div>
      )}

      {/* Badges + Action */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:6 }}>
          {p.accepts_ayushman===1 && <span style={{ ...pill('#10B981') }}>✅ Ayushman</span>}
          {p.accepts_pmjay===1    && <span style={{ ...pill('#0EA5E9') }}>✅ PM-JAY</span>}
          {p.verified===1         && <span style={{ ...pill('#8B5CF6') }}>🔵 Verified</span>}
        </div>
        <a href={`https://maps.google.com/?q=${encodeURIComponent((p.name||'')+' '+(p.address||''))}`}
          target="_blank" rel="noreferrer"
          style={{ background:'linear-gradient(135deg,#0EA5E9,#0284C7)', color:'white', padding:'8px 14px', borderRadius:'10px', textDecoration:'none', fontSize:'0.82rem', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
          🧭 Directions
        </a>
      </div>
    </div>
  );
};

/* ── Blood Donor Card ── */
const DonorCard = ({ d }) => (
  <div style={{ ...card, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <span style={{ background:'rgba(239,68,68,0.15)', color:'#EF4444', padding:'6px 12px', borderRadius:'10px', fontWeight:700, fontSize:'1.1rem', border:'1px solid rgba(239,68,68,0.3)' }}>{d.blood_group}</span>
        <h4 style={{ margin:0 }}>{d.name}</h4>
      </div>
      <p style={{ margin:0, fontSize:'0.85rem', color:'var(--text-secondary)' }}>📍 {d.district}, {d.state}</p>
      {d.last_donated && <p style={{ margin:0, fontSize:'0.8rem', color:'var(--text-tertiary)' }}>Last donated: {d.last_donated}</p>}
    </div>
    <a href={`tel:${d.phone?.replace(/\s+/g,'')}`} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#FCA5A5', padding:'10px 16px', borderRadius:'12px', textDecoration:'none', fontWeight:600, fontSize:'0.85rem', flexShrink:0 }}>
      📞 Call
    </a>
  </div>
);

/* ══════════════════════════════════════════════
   Main Discovery Hub Component
══════════════════════════════════════════════ */
export const DiscoveryHub = ({ user }) => {
  const [activeTab, setActiveTab]   = useState('providers'); // providers | blood
  const [providers, setProviders]   = useState([]);
  const [donors, setDonors]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [category, setCategory]     = useState('all');
  const [stateFilter, setStateFilter] = useState(user?.state || 'UP');
  const [search, setSearch]         = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [donorForm, setDonorForm]   = useState({ name:'', blood_group:'A+', district:'', phone:'' });
  const [msg, setMsg]               = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('type', category);
      if (stateFilter)        params.set('state', stateFilter);
      if (search)             params.set('query', search);
      const res = await fetch(`${API_BASE}/api/providers?${params}`);
      setProviders(await res.json());
    } catch { setProviders([]); } finally { setLoading(false); }
  };

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (bloodGroup)  params.set('blood_group', bloodGroup);
      if (stateFilter) params.set('state', stateFilter);
      const res = await fetch(`${API_BASE}/api/blood-donors?${params}`);
      setDonors(await res.json());
    } catch { setDonors([]); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'providers') fetchProviders();
    else fetchDonors();
  }, [activeTab, category, stateFilter, bloodGroup]);

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/api/blood-donors`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...donorForm, state: stateFilter }),
    });
    setShowAddDonor(false);
    setMsg('You are now registered as a blood donor! Thank you. 🩸');
    setTimeout(()=>setMsg(''), 4000);
    fetchDonors();
  };

  const inputS = {
    background:'var(--input-bg)', border:'1px solid var(--border-color)',
    borderRadius:'10px', padding:'10px 14px', color:'var(--text-primary)', fontFamily:'inherit',
    fontSize:'0.95rem', width:'100%',
  };

  return (
    <div style={{ padding:'28px 24px', minHeight:'100vh', color:'var(--text-primary)', fontFamily:"'Inter','Mukta',sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:4 }}>
          🗺️ Discovery Hub <span style={{ fontWeight:300, opacity:0.6, fontSize:'0.85em' }}>/ खोज केंद्र</span>
        </h1>
        <p style={{ color:'var(--text-secondary)', fontFamily:"'Mukta',sans-serif" }}>
          Find Labs, Pharmacies, Doctors, Hospitals & Blood Donors across India
        </p>
      </div>

      {/* Success message */}
      {msg && <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid #10B981', color:'#6EE7B7', padding:'12px 16px', borderRadius:'12px', marginBottom:16 }}>{msg}</div>}

      {/* Tab switcher */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['providers','🏥 Healthcare Providers'],['blood','🩸 Blood Donors']].map(([id,label]) => (
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{ padding:'10px 20px', borderRadius:'12px', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'0.9rem',
              background: activeTab===id ? 'linear-gradient(135deg,#0EA5E9,#0284C7)' : 'var(--button-secondary-bg)',
              color: activeTab===id ? 'white' : 'var(--button-secondary-text)', boxShadow: activeTab===id ? '0 4px 15px rgba(14,165,233,0.35)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PROVIDERS TAB ── */}
      {activeTab === 'providers' && (
        <>
          {/* Filters bar */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:20 }}>
            <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)} style={{ ...inputS, width:'auto', minWidth:160 }}>
              {STATES.map(s => <option key={s} value={s} style={{background:'var(--select-option-bg)', color:'var(--text-primary)'}}>{STATE_NAMES[s]||s}</option>)}
            </select>
            <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchProviders()}
              placeholder="Search name or test... 🔍" style={{ ...inputS, flex:1, minWidth:200 }} />
            <button onClick={fetchProviders} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#0EA5E9,#0284C7)', border:'none', borderRadius:'10px', color:'white', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              Search
            </button>
          </div>

          {/* Category chips */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={()=>setCategory(c.id)}
                style={{ padding:'8px 16px', borderRadius:'20px', border:`1px solid ${category===c.id?c.color:'var(--chip-border)'}`,
                  background: category===c.id ? `${c.color}20` : 'var(--chip-bg)',
                  color: category===c.id ? c.color : 'var(--text-secondary)',
                  cursor:'pointer', fontFamily:'inherit', fontWeight:category===c.id?700:400, fontSize:'0.85rem',
                  transition:'all 0.2s ease' }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height:220, borderRadius:18, background:'linear-gradient(90deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.08) 40px,rgba(255,255,255,0.04) 80px)', backgroundSize:'400px 100%', animation:'shimmer 1.4s ease infinite' }} />)}
            </div>
          ) : providers.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-tertiary)' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>🔍</div>
              <p>No providers found. Try a different state or category.</p>
              <p style={{ fontFamily:"'Mukta',sans-serif" }}>कोई प्रदाता नहीं मिला। अलग राज्य या श्रेणी आज़माएं।</p>
            </div>
          ) : (
            <>
              <p style={{ color:'var(--text-tertiary)', fontSize:'0.85rem', marginBottom:14 }}>
                Showing {providers.length} providers in {STATE_NAMES[stateFilter]||stateFilter}
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
                {providers.map(p => <ProviderCard key={p.id} p={p} />)}
              </div>
            </>
          )}
        </>
      )}

      {/* ── BLOOD DONORS TAB ── */}
      {activeTab === 'blood' && (
        <>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:20, justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)} style={{ ...inputS, width:'auto', minWidth:160 }}>
                {STATES.map(s => <option key={s} value={s} style={{background:'var(--select-option-bg)', color:'var(--text-primary)'}}>{STATE_NAMES[s]||s}</option>)}
              </select>
              <select value={bloodGroup} onChange={e=>setBloodGroup(e.target.value)} style={{ ...inputS, width:'auto' }}>
                <option value="" style={{background:'var(--select-option-bg)', color:'var(--text-primary)'}}>All Blood Groups</option>
                {BLOOD_GROUPS.map(g=><option key={g} value={g} style={{background:'var(--select-option-bg)', color:'var(--text-primary)'}}>{g}</option>)}
              </select>
            </div>
            <button onClick={()=>setShowAddDonor(true)}
              style={{ padding:'10px 18px', background:'linear-gradient(135deg,#EF4444,#DC2626)', border:'none', borderRadius:'10px', color:'white', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              🩸 Register as Donor
            </button>
          </div>

          {loading ? (
            <div style={{ display:'grid', gap:12 }}>
              {[1,2,3].map(i => <div key={i} style={{ height:90, borderRadius:16, background:'var(--chip-bg)', animation:'shimmer 1.4s ease infinite' }} />)}
            </div>
          ) : donors.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-tertiary)' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>🩸</div>
              <p>No donors found for this filter.</p>
              <p style={{ fontFamily:"'Mukta',sans-serif" }}>इस फ़िल्टर के लिए कोई दाता नहीं मिला।</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {donors.map(d => <DonorCard key={d.id} d={d} />)}
            </div>
          )}

          {/* Add Donor Modal */}
          {showAddDonor && (
            <div style={{ position:'fixed', inset:0, background:'var(--modal-overlay-bg)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
              <div style={{ ...card, maxWidth:440, width:'100%', padding:32, margin:'auto' }}>
                <h2 style={{ marginBottom:20 }}>🩸 Register as Blood Donor</h2>
                <form onSubmit={handleDonorSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div><label style={{ display:'block', fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:5 }}>Full Name</label><input required value={donorForm.name} onChange={e=>setDonorForm({...donorForm,name:e.target.value})} style={inputS} /></div>
                  <div><label style={{ display:'block', fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:5 }}>Blood Group</label>
                    <select value={donorForm.blood_group} onChange={e=>setDonorForm({...donorForm,blood_group:e.target.value})} style={inputS}>
                      {BLOOD_GROUPS.map(g=><option key={g} value={g} style={{background:'var(--select-option-bg)', color:'var(--text-primary)'}}>{g}</option>)}
                    </select>
                  </div>
                  <div><label style={{ display:'block', fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:5 }}>District</label><input required value={donorForm.district} onChange={e=>setDonorForm({...donorForm,district:e.target.value})} style={inputS} /></div>
                  <div><label style={{ display:'block', fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:5 }}>Phone</label><input required type="tel" value={donorForm.phone} onChange={e=>setDonorForm({...donorForm,phone:e.target.value})} style={inputS} /></div>
                  <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:8 }}>
                    <button type="button" onClick={()=>setShowAddDonor(false)} style={{ padding:'10px 18px', background:'var(--button-secondary-bg)', border:'1px solid var(--border-color)', color:'var(--button-secondary-text)', borderRadius:'10px', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
                    <button type="submit" style={{ padding:'10px 20px', background:'linear-gradient(135deg,#EF4444,#DC2626)', border:'none', borderRadius:'10px', color:'white', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Register</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
