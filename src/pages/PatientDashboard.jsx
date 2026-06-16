import React, { useState, useEffect } from 'react';
import {
  FileText, Video, Truck, LogOut, Edit, Activity, Upload, Clock,
  MapPin, Calendar as CalendarIcon, Info, Map, Stethoscope, Phone,
  Star, Navigation, Crosshair, AlertTriangle, Pill, Scale, Home,
  Heart, Trash2, Plus, User, BellRing, ChevronRight
} from 'lucide-react';
import './PatientDashboard.css';
import { DiscoveryHub } from './DiscoveryHub';
import API_BASE from '../config';

// ── Pill Time Icon Helper ──────────────────
const timeIcons = {
  'Morning': '🌅',
  'Afternoon': '☀️',
  'Evening': '🌇',
  'Night': '🌙',
};

// ── BMI Calculator Component ───────────────
const BMICalculator = () => {
  const [h, setH] = useState('');
  const [w, setW] = useState('');
  const [result, setResult] = useState(null);

  const calcBMI = () => {
    const hm = parseFloat(h) / 100;
    const wkg = parseFloat(w);
    if (!hm || !wkg) return;
    const bmi = (wkg / (hm * hm)).toFixed(1);
    let label = '', cls = '';
    if (bmi < 18.5)       { label = 'Underweight / कम वजन';  cls = 'bmi-warning'; }
    else if (bmi < 25)    { label = 'Normal / सामान्य';        cls = 'bmi-normal';  }
    else if (bmi < 30)    { label = 'Overweight / अधिक वजन'; cls = 'bmi-warning'; }
    else                  { label = 'Obese / मोटापा';          cls = 'bmi-danger';  }
    setResult({ bmi, label, cls });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Height (cm) / ऊंचाई</label>
          <input type="number" value={h} onChange={e => setH(e.target.value)} placeholder="e.g. 165" />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Weight (kg) / वजन</label>
          <input type="number" value={w} onChange={e => setW(e.target.value)} placeholder="e.g. 65" />
        </div>
      </div>
      <button onClick={calcBMI} className="glass-button primary" style={{ width: '100%', padding: '12px' }}>
        Calculate BMI / BMI जाँचें
      </button>
      {result && (
        <div className={`bmi-result ${result.cls}`} style={{ marginTop: '14px' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{result.bmi}</p>
          <p style={{ fontSize: '1rem' }}>{result.label}</p>
        </div>
      )}
    </div>
  );};

// ── Pregnancy Tracker Component ────────────
const PregnancyTracker = () => {
  const [week, setWeek] = useState(12);

  const getWeekData = (w) => {
    if (w <= 12) {
      return {
        trimester: '1st Trimester / पहली तिमाही',
        size: 'Lemon 🍋 / नींबू के समान',
        tips: 'Eat small, frequent meals to help with morning sickness. Take folic acid regularly.',
        tipsHi: 'उबकाई से बचने के लिए थोड़ा-थोड़ा करके कई बार खाएं। फोलिक एसिड नियमित रूप से लें।',
      };
    } else if (w <= 27) {
      return {
        trimester: '2nd Trimester / दूसरी तिमाही',
        size: 'Mango 🥭 / आम के समान',
        tips: 'Ensure calcium and iron intake. Sleep on your left side to improve circulation.',
        tipsHi: 'कैल्शियम और आयरन का सेवन सुनिश्चित करें। रक्त संचार के लिए बाईं ओर करवट लेकर सोएं।',
      };
    } else {
      return {
        trimester: '3rd Trimester / तीसरी तिमाही',
        size: 'Coconut 🥥 / नारियल के समान',
        tips: 'Count fetal movements daily. Keep emergency numbers and maternal hospital bags ready.',
        tipsHi: 'भ्रूण की गतिविधियों की दैनिक गिनती करें। आपातकालीन नंबर और प्रसव के लिए अस्पताल बैग तैयार रखें।',
      };
    }
  };

  const data = getWeekData(week);

  return (
    <div className="pregnancy-tracker-widget" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem' }}>Current Week: <strong>Week {week}</strong></span>
        <span style={{ fontSize: '0.78rem', background: '#ec489920', color: '#ec4899', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>{data.trimester}</span>
      </div>
      <input
        type="range"
        min="1"
        max="40"
        value={week}
        onChange={e => setWeek(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
      />
      <div style={{ background: 'var(--chip-bg)', padding: '12px', borderRadius: '10px', border: '1px solid var(--chip-border)' }}>
        <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem' }}>👶 Baby Size: <strong>{data.size}</strong></p>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', color: 'var(--text-primary)' }}>💡 <strong>Tip:</strong> {data.tips}</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: "'Mukta', sans-serif" }}>💡 {data.tipsHi}</p>
      </div>
    </div>
  );
};

// ── Mental Health Support Component ────────
const MentalHealthSupport = () => {
  const [mood, setMood] = useState('good');

  const copingTips = {
    good: {
      tip: 'Share your positive energy with family or friends today! Positive social connections boost health.',
      tipHi: 'आज अपने परिवार या दोस्तों के साथ सकारात्मक ऊर्जा साझा करें! सामाजिक संबंध स्वास्थ्य को बढ़ावा देते हैं।',
    },
    okay: {
      tip: 'Take a short 5-minute break. Focus on slow, deep breaths to center yourself.',
      tipHi: '5 मिनट का छोटा ब्रेक लें। अपने आप को केंद्रित करने के लिए धीमी, गहरी सांसों पर ध्यान दें।',
    },
    sad: {
      tip: 'It is okay to feel down. Try sharing your thoughts with a trusted friend. You can also contact iCall at 9152987821.',
      tipHi: 'उदास होना ठीक है। अपने विचार किसी भरोसेमंद मित्र के साथ साझा करें। आप iCall से 9152987821 पर संपर्क कर सकते हैं।',
    },
    stressed: {
      tip: 'Close your eyes. Inhale for 4 seconds, hold for 4, exhale for 4. Repeat 5 times to reduce cortisol levels.',
      tipHi: 'अपनी आँखें बंद करें। 4 सेकंड के लिए सांस लें, 4 सेकंड रोकें, 4 सेकंड छोड़ें। कोर्टिसोल स्तर को कम करने के लिए दोहराएं।',
    }
  };

  return (
    <div className="mental-health-widget" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>How are you feeling today? / आज कैसा महसूस हो रहा है?</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'good', label: '😊 Good', color: '#10B981' },
            { id: 'okay', label: '😐 Okay', color: '#3B82F6' },
            { id: 'sad', label: '😔 Sad', color: '#F59E0B' },
            { id: 'stressed', label: '😠 Stressed', color: '#EF4444' }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMood(item.id)}
              style={{
                flex: 1,
                padding: '6px 4px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: `1px solid ${mood === item.id ? item.color : 'var(--border-color)'}`,
                background: mood === item.id ? `${item.color}20` : 'var(--chip-bg)',
                color: mood === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: mood === item.id ? 700 : 400
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--chip-bg)', padding: '12px', borderRadius: '10px', border: '1px solid var(--chip-border)' }}>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', color: 'var(--text-primary)' }}>🧠 <strong>Support:</strong> {copingTips[mood].tip}</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: "'Mukta', sans-serif" }}>🧠 {copingTips[mood].tipHi}</p>
      </div>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '0.82rem' }}>
        📞 Free iCall Helpline: <a href="tel:9152987821" style={{ color: '#FCA5A5', fontWeight: '700', textDecoration: 'none' }}>9152987821</a> (Mon-Sat, 10AM-10PM)
      </div>
    </div>
  );
};

// ── Teleconsult History Component ──────────
const TeleconsultHistory = () => {
  const history = [
    {
      date: '2026-05-15',
      doctor: 'Dr. Anil Sharma',
      symptoms: 'Mild fever and dry cough',
      prescription: 'Paracetamol 650mg (1-0-1 after food for 3 days), Cetirizine 10mg (0-0-1 before sleep for 3 days)',
      diagnosis: 'Acute Viral Pharyngitis'
    },
    {
      date: '2026-03-22',
      doctor: 'Dr. Rekha Gupta',
      symptoms: 'Routine maternal checkup (Month 3)',
      prescription: 'Folic Acid 5mg (1-0-0, 30 days), Iron Supplement (0-1-0, 30 days)',
      diagnosis: 'Normal early pregnancy'
    }
  ];

  return (
    <div className="teleconsult-history-widget" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {history.map((item, idx) => (
        <div key={idx} style={{ background: 'var(--chip-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--chip-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{item.doctor}</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{item.date}</span>
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }}>📋 Diagnosis: <strong>{item.diagnosis}</strong></p>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>📝 Rx: {item.prescription}</p>
        </div>
      ))}
    </div>
  );
};

// ── Main Component ─────────────────────────
export const PatientDashboard = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState('home'); // home | doctors | labs | vitals | profile

  // Data states
  const [activeQueue, setActiveQueue] = useState(null);
  const [activeDiagnostics, setActiveDiagnostics] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [labs, setLabs] = useState([]);
  const [awareness, setAwareness] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [loading, setLoading] = useState(true);

  // Modal visibility
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBookDoctor, setShowBookDoctor] = useState(false);
  const [showBookTest, setShowBookTest] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showMedicine, setShowMedicine] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  // Form states
  const [editName, setEditName] = useState(currentUser.name || user.name);
  const [editState, setEditState] = useState(currentUser.state || user.state || 'UP');
  const [editDistrict, setEditDistrict] = useState(currentUser.district || user.district || 'Gautam Buddh Nagar');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditState(currentUser.state || 'UP');
      setEditDistrict(currentUser.district || '');
    }
  }, [currentUser]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSymptoms, setDoctorSymptoms] = useState('');
  const [testForm, setTestForm] = useState({ testType: 'Complete Blood Count (CBC)', date: '', time: '', house: '', village: '', landmark: '' });
  const [vitalsForm, setVitalsForm] = useState({ bp: '', sugar: '', weight: '' });
  const [medForm, setMedForm] = useState({ name: '', dose: '', time: 'Morning' });
  const [successMessage, setSuccessMessage] = useState('');

  // ── Data fetching ───────────────────────
  const fetchData = async () => {
    try {
      const [bRes, vRes, dRes, lRes, aRes, mRes] = await Promise.all([
        fetch(`${API_BASE}/api/patient/${currentUser.name}/bookings`),
        fetch(`${API_BASE}/api/vitals/${currentUser.name}`),
        fetch(`${API_BASE}/api/doctors`),
        fetch(`${API_BASE}/api/labs`),
        fetch(`${API_BASE}/api/awareness`),
        fetch(`${API_BASE}/api/medicines/${encodeURIComponent(currentUser.name)}`),
      ]);
      const bData = await bRes.json();
      setActiveQueue(bData.queue);
      setActiveDiagnostics(bData.diagnostics);
      setVitalsHistory(await vRes.json());
      setDoctors(await dRes.json());
      setLabs(await lRes.json());
      setAwareness(await aRes.json());
      setMedicines(await mRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, [currentUser.name]);

  const showMsg = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(''), 4000); };

  // ── Handlers ───────────────────────────
  const handleEditProfile = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentUser.id, name: editName, state: editState, district: editDistrict })
    });
    if (res.ok) {
      setCurrentUser({ ...currentUser, name: editName, state: editState, district: editDistrict });
      setShowEditProfile(false);
      showMsg('Profile updated! / प्रोफ़ाइल अपडेट हो गई!');
    }
  };

  const handleBookDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    await fetch(`${API_BASE}/api/queue`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_name: currentUser.name, age: 30, gender: 'U', triage_notes: `${selectedDoctor.name}: ${doctorSymptoms}` }) });
    setShowBookDoctor(false); setSelectedDoctor(null); setDoctorSymptoms('');
    showMsg('Consultation requested! / परामर्श अनुरोध हो गया!'); fetchData();
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    const addr = `${testForm.house}, ${testForm.village} (Near ${testForm.landmark})`;
    await fetch(`${API_BASE}/api/diagnostics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_name: currentUser.name, test_type: testForm.testType, request_type: 'Home Collection', location: addr, scheduled_date: testForm.date, scheduled_time: testForm.time }) });
    setShowBookTest(false); showMsg('Test scheduled! / जांच बुक हो गई!'); fetchData();
  };

  const handleLogVitals = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/api/vitals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_name: currentUser.name, ...vitalsForm }) });
    setShowVitals(false); setVitalsForm({ bp: '', sugar: '', weight: '' }); showMsg('Vitals saved! / आंकड़े दर्ज हो गए!'); fetchData();
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/api/medicines`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_name: currentUser.name, ...medForm }) });
    setShowMedicine(false); setMedForm({ name: '', dose: '', time: 'Morning' }); showMsg('Medicine reminder added! / दवाई याद जोड़ी गई!'); fetchData();
  };

  const handleDeleteMedicine = async (id) => {
    await fetch(`${API_BASE}/api/medicines/${id}`, { method: 'DELETE' });
    showMsg('Reminder removed.'); fetchData();
  };

  const handleDetectLocation = () => {
    setLocationStatus('detecting');
    showMsg('Detecting GPS Coordinates...');
    setTimeout(() => { setLocationStatus('detected'); showMsg('Location found! Showing Top 3 labs within 30KM.'); }, 1500);
  };

  const hasActiveLive = activeQueue || activeDiagnostics.length > 0;

  // ── Skeleton Loader ─────────────────────
  if (loading) return (
    <div className="patient-dashboard-container">
      <div className="skeleton" style={{ height: 140, borderRadius: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="skeleton" style={{ height: 160, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 20 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="skeleton" style={{ height: 160, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 100, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="patient-dashboard-container animate-fade-in">

      {/* ── 1. Hero Banner ──────────────────── */}
      <header className="hero-banner">
        <div>
          <h1 className="text-gradient">
            {activeTab === 'home' ? `🙏 ${currentUser.name}` :
             activeTab === 'doctors' ? '👨‍⚕️ Doctors' :
             activeTab === 'labs' ? '🗺️ Discovery Hub / खोज केंद्र' :
             activeTab === 'vitals' ? '❤️ Health Vitals' : '👤 My Profile'}
          </h1>
          <p style={{ fontFamily: "'Mukta', sans-serif" }}>
            {activeTab === 'home' ? 'Lok Kalyan — आपका स्वास्थ्य, हमारी जिम्मेदारी' :
             activeTab === 'doctors' ? 'Available Doctors / उपलब्ध डॉक्टर' :
             activeTab === 'labs' ? 'Find labs, pharmacies, doctors & blood donors' :
             activeTab === 'vitals' ? 'Track your health / अपना स्वास्थ्य जाँचें' :
             'Manage your account / अपना खाता'}
          </p>
        </div>
        <div className="hero-actions">
          {/* SOS Button */}
          <button onClick={() => setShowSOS(true)} className="glass-button sos-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}>
            🆘 SOS
          </button>
          <button onClick={() => setShowEditProfile(true)} className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit size={16} /> Profile
          </button>
          <button onClick={onLogout} className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* ── Success Toast ──────────────────── */}
      {successMessage && (
        <div className="animate-slide-up" style={{ padding: '14px 20px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success-color)', color: 'var(--success-color)', borderRadius: '14px', textAlign: 'center', fontWeight: '600' }}>
          ✓ {successMessage}
        </div>
      )}

      {/* ── Active SOS Banner ─────────────── */}
      {activeTab === 'home' && (hasActiveLive) && (
        <div className="sos-banner animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="live-dot" />
            <strong>You have an active booking</strong>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>— Check below for status.</span>
          </div>
          <ChevronRight size={20} style={{ opacity: 0.5 }} />
        </div>
      )}

      {/* ════════════════════════════════════
          TAB: HOME
      ════════════════════════════════════ */}
      {activeTab === 'home' && (
        <div className="dashboard-grid">

          {/* LEFT: Main Column */}
          <div className="main-column">

            {/* Action Hub */}
            <div className="premium-card">
              <h2 className="card-header"><BellRing size={20} color="var(--primary-color)" /> Services / सेवाएं</h2>
              <div className="action-buttons-container">
                <button onClick={() => setShowBookDoctor(true)} className="glass-button primary action-btn">
                  <Stethoscope size={26} />
                  <div>Consult Doctor<br/><span className="action-subtitle">डॉक्टर से परामर्श</span></div>
                </button>
                <button onClick={() => setShowBookTest(true)} className="glass-button action-btn" style={{ borderColor: 'rgba(14,165,233,0.3)' }}>
                  <CalendarIcon size={26} color="var(--primary-color)" />
                  <div>Book Lab Test<br/><span className="action-subtitle">जांच बुक करें</span></div>
                </button>
                <button onClick={() => setShowMedicine(true)} className="glass-button action-btn" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
                  <Pill size={26} color="var(--success-color)" />
                  <div>Add Reminder<br/><span className="action-subtitle">दवाई याद जोड़ें</span></div>
                </button>
                <button onClick={() => setShowUpload(true)} className="glass-button action-btn" style={{ borderStyle: 'dashed' }}>
                  <Upload size={26} color="var(--accent-color)" />
                  <div>Upload Docs<br/><span className="action-subtitle">दस्तावेज अपलोड</span></div>
                </button>
              </div>
            </div>

            {/* Active Bookings */}
            <div className="premium-card">
              <h2 className="card-header">
                <Clock size={20} color="var(--primary-color)" /> Active Bookings / सक्रिय बुकिंग
                {hasActiveLive && <span className="live-dot" />}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {!activeQueue && activeDiagnostics.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                    No active bookings. / कोई सक्रिय बुकिंग नहीं।
                  </p>
                )}
                {activeQueue && (
                  <div className="booking-card warning animate-fade-in">
                    <h4 style={{ color: 'var(--warning-color)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={15} /> Telemedicine Queue
                    </h4>
                    <p style={{ marginBottom: '4px' }}>Status: <strong>{activeQueue.status.toUpperCase()}</strong></p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>{activeQueue.triage_notes}</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(activeQueue.timestamp).toLocaleString('hi-IN')}</p>
                  </div>
                )}
                {activeDiagnostics.map(diag => (
                  <div key={diag.id} className="booking-card animate-fade-in">
                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={15} /> Diagnostic Scheduled
                    </h4>
                    <p style={{ fontSize: '1.05rem', marginBottom: '8px' }}><strong>{diag.test_type}</strong></p>
                    <p style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}><CalendarIcon size={13}/> {diag.scheduled_date} at {diag.scheduled_time}</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, display: 'flex', alignItems: 'flex-start', gap: '6px' }}><MapPin size={13}/> {diag.location}</p>
                    <span style={{ display: 'inline-block', marginTop: '10px', background: 'var(--primary-color)', color: 'white', padding: '3px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700' }}>{diag.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pregnancy Tracker & Mental Health Widgets */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div className="premium-card" style={{ flex: '1 1 300px', marginBottom: 0 }}>
                <h2 className="card-header" style={{ color: '#ec4899' }}>🤰 Pregnancy Guide / गर्भावस्था गाइड</h2>
                <PregnancyTracker />
              </div>
              <div className="premium-card" style={{ flex: '1 1 300px', marginBottom: 0 }}>
                <h2 className="card-header" style={{ color: '#8B5CF6' }}>🧠 Mental Wellness / मानसिक स्वास्थ्य</h2>
                <MentalHealthSupport />
              </div>
            </div>

            {/* Teleconsult History */}
            <div className="premium-card">
              <h2 className="card-header">📜 Consultation History / परामर्श इतिहास</h2>
              <TeleconsultHistory />
            </div>

            {/* Awareness Feed */}
            <div className="premium-card">
              <h2 className="card-header"><Info size={20} color="var(--success-color)" /> Health Awareness / स्वास्थ्य जागरूकता</h2>
              <div className="wellness-feed">
                {awareness.map((item, i) => (
                  <div key={i} className={`wellness-card ${item.type.toLowerCase()}`}>
                    <span className="wellness-badge">{item.type}</span>
                    <h4 style={{ marginBottom: '6px', lineHeight: 1.3 }}>
                      {item.title}<br/>
                      <span style={{ fontSize: '0.85em', fontWeight: 400, opacity: 0.9, fontFamily: "'Mukta', sans-serif" }}>{item.title_hi}</span>
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{item.desc}</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.75, fontFamily: "'Mukta', sans-serif" }}>{item.desc_hi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="side-column">

            {/* Vitals Tracker */}
            <div className="premium-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--danger-color)" /> Vitals <span style={{ fontSize: '0.7em', fontWeight: 400, opacity: 0.7, fontFamily: "'Mukta', sans-serif" }}>/ आंकड़े</span>
                </h2>
                <button onClick={() => setShowVitals(true)} className="glass-button small" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12} /> Log
                </button>
              </div>
              {vitalsHistory.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '10px 0' }}>No vitals logged yet.</p>
              ) : (
                <div>
                  <div className="vitals-grid">
                    <div className="vital-item">
                      <span>Blood Pressure<br/><span style={{fontFamily:"'Mukta', sans-serif"}}>रक्तचाप</span></span>
                      <strong>{vitalsHistory[0].bp || '—'}</strong>
                    </div>
                    <div className="vital-item vitals-divider">
                      <span>Sugar<br/><span style={{fontFamily:"'Mukta', sans-serif"}}>शुगर</span></span>
                      <strong>{vitalsHistory[0].sugar || '—'}</strong>
                    </div>
                    <div className="vital-item">
                      <span>Weight<br/><span style={{fontFamily:"'Mukta', sans-serif"}}>वजन</span></span>
                      <strong>{vitalsHistory[0].weight ? `${vitalsHistory[0].weight}kg` : '—'}</strong>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', textAlign: 'center', opacity: 0.5, marginTop: '10px' }}>
                    Updated: {new Date(vitalsHistory[0].timestamp).toLocaleDateString('hi-IN')}
                  </p>
                </div>
              )}
            </div>

            {/* BMI Calculator */}
            <div className="premium-card">
              <h2 className="card-header"><Scale size={18} color="var(--accent-color)" /> BMI जाँच</h2>
              <BMICalculator />
            </div>

            {/* Medicine Reminders */}
            <div className="premium-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Pill size={18} color="var(--success-color)" /> Medicines <span style={{ fontSize: '0.7em', fontWeight: 400, opacity: 0.7 }}>/ दवाई</span>
                </h2>
                <button onClick={() => setShowMedicine(true)} className="glass-button small" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12} /> Add
                </button>
              </div>
              {medicines.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '10px 0' }}>No reminders set.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {medicines.map(med => (
                    <div key={med.id} className="medicine-card">
                      <span style={{ fontSize: '1.5rem' }}>{timeIcons[med.time] || '💊'}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', marginBottom: '2px' }}>{med.name}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{med.dose} • {med.time}</p>
                      </div>
                      <button onClick={() => handleDeleteMedicine(med.id)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Vault */}
            <div className="premium-card">
              <h2 className="card-header"><FileText size={18} color="var(--accent-color)" /> Vault / दस्तावेज</h2>
              <button onClick={() => setShowUpload(true)} className="glass-button" style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderStyle: 'dashed' }}>
                <Upload size={18} /> Upload File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          TAB: DOCTORS
      ════════════════════════════════════ */}
      {activeTab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
          <p style={{ color: 'var(--text-secondary)', fontFamily: "'Mukta', sans-serif" }}>Select a specialist to request an online consultation. / ऑनलाइन परामर्श के लिए विशेषज्ञ चुनें।</p>
          {doctors.map(doc => (
            <div key={doc.id} className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>👨‍⚕️</div>
                <div>
                  <h3 style={{ marginBottom: '2px' }}>{doc.name}</h3>
                  <p style={{ fontFamily: "'Mukta', sans-serif", opacity: 0.8, fontSize: '0.9rem' }}>{doc.name_hi}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{doc.specialty} / {doc.specialty_hi} • {doc.exp}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '8px' }}>₹{doc.fee}</p>
                <button onClick={() => { setSelectedDoctor(doc); setShowBookDoctor(true); }} className="glass-button primary small">Book</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════
          TAB: DISCOVERY HUB
      ════════════════════════════════════ */}
      {activeTab === 'labs' && (
        <DiscoveryHub user={currentUser} />
      )}

      {/* ════════════════════════════════════
          TAB: VITALS
      ════════════════════════════════════ */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }} className="animate-fade-in">
          <div className="premium-card">
            <h2 className="card-header"><Heart size={20} color="var(--danger-color)" /> Vitals History / इतिहास</h2>
            {vitalsHistory.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No data yet. Log your first vitals!</p>
            ) : vitalsHistory.slice(0, 5).map(v => (
              <div key={v.id} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.9rem' }}>BP: <strong>{v.bp || '—'}</strong> &nbsp; Sugar: <strong>{v.sugar || '—'}</strong> &nbsp; Weight: <strong>{v.weight ? `${v.weight}kg` : '—'}</strong></p>
                  <p style={{ fontSize: '0.78rem', opacity: 0.55, marginTop: '3px' }}>{new Date(v.timestamp).toLocaleString('hi-IN')}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setShowVitals(true)} className="glass-button primary" style={{ width: '100%', marginTop: '12px' }}>
              <Plus size={16} /> Log New Vitals
            </button>
          </div>
          <div className="premium-card">
            <h2 className="card-header"><Scale size={20} color="var(--accent-color)" /> BMI Calculator / BMI जाँच</h2>
            <BMICalculator />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          TAB: PROFILE
      ════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '500px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
          <div className="premium-card" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 16px' }}>🧑‍🦱</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{currentUser.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Patient • Lok Kalyan</p>
          </div>
          <div className="premium-card">
            <h3 className="card-header"><User size={18} /> Account Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <label>Full Name / पूरा नाम</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <button onClick={() => handleEditProfile({ preventDefault: () => {} })} className="glass-button primary" style={{ padding: '12px', marginTop: '8px' }}>Save Changes</button>
            </div>
          </div>
          <button onClick={onLogout} className="glass-button danger" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <LogOut size={18} /> Sign Out / लॉग आउट
          </button>
        </div>
      )}

      {/* ── Bottom Navigation Bar (Mobile) ── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {[
            { id: 'home',    icon: <Home size={22} />,        label: 'Home / होम' },
            { id: 'doctors', icon: <Stethoscope size={22} />, label: 'Doctors' },
            { id: 'labs',    icon: <MapPin size={22} />,      label: 'Search / खोज' },
            { id: 'vitals',  icon: <Activity size={22} />,    label: 'Vitals' },
            { id: 'profile', icon: <User size={22} />,        label: 'Profile' },
          ].map(tab => (
            <button key={tab.id} className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon}
              {tab.label}
              {tab.id === 'home' && hasActiveLive && <span className="live-dot" style={{ position: 'absolute', top: '6px', right: '10px' }} />}
            </button>
          ))}
        </div>
      </nav>

      {/* ════ MODALS ════ */}

      {/* SOS Modal */}
      {showSOS && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🆘</div>
            <h2 style={{ color: '#EF4444', marginBottom: '8px' }}>Emergency Help</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontFamily: "'Mukta', sans-serif" }}>आपातकालीन सहायता के लिए कॉल करें</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <a href="tel:108" className="glass-button danger" style={{ padding: '18px', fontSize: '1.2rem', fontWeight: '700', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Phone size={22} /> Call 108 — Ambulance
              </a>
              <a href="tel:112" className="glass-button" style={{ padding: '16px', fontSize: '1.1rem', fontWeight: '600', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderColor: 'rgba(239,68,68,0.3)' }}>
                <Phone size={20} /> Call 112 — Police / Police
              </a>
              <a href="tel:102" className="glass-button" style={{ padding: '16px', fontSize: '1.1rem', fontWeight: '600', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderColor: 'rgba(239,68,68,0.3)' }}>
                <Phone size={20} /> Call 102 — Maternity
              </a>
            </div>
            <button onClick={() => setShowSOS(false)} className="glass-button" style={{ width: '100%' }}>Close / बंद करें</button>
          </div>
        </div>
      )}

      {/* Book Doctor Modal */}
      {showBookDoctor && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up" style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '6px' }}>Available Doctors / उपलब्ध डॉक्टर</h2>
            <p className="text-secondary" style={{ marginBottom: '18px', fontFamily: "'Mukta', sans-serif" }}>Select a specialist / विशेषज्ञ चुनें</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
              {doctors.map(doc => (
                <div key={doc.id} onClick={() => setSelectedDoctor(doc)} style={{ padding: '14px 16px', borderRadius: '12px', border: selectedDoctor?.id === doc.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', background: selectedDoctor?.id === doc.id ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{doc.name}</h4>
                    <p style={{ fontSize: '0.85rem', opacity: 0.75, fontFamily: "'Mukta', sans-serif", margin: 0 }}>{doc.name_hi}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{doc.specialty} • {doc.exp}</p>
                  </div>
                  <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-color)' }}>₹{doc.fee}</span>
                </div>
              ))}
            </div>
            {selectedDoctor && (
              <form onSubmit={handleBookDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label>Symptoms / लक्षण</label>
                  <textarea required value={doctorSymptoms} onChange={e => setDoctorSymptoms(e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => {setShowBookDoctor(false); setSelectedDoctor(null);}} className="glass-button">Cancel</button>
                  <button type="submit" className="glass-button primary">Book Consult (₹{selectedDoctor.fee})</button>
                </div>
              </form>
            )}
            {!selectedDoctor && <div style={{textAlign:'right'}}><button onClick={() => setShowBookDoctor(false)} className="glass-button">Cancel</button></div>}
          </div>
        </div>
      )}

      {/* Book Test Modal */}
      {showBookTest && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up" style={{ maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px' }}>Schedule Lab Test / जांच बुक करें</h2>
            <form onSubmit={handleBookTest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Select Test / जांच चुनें</label>
                <select value={testForm.testType} onChange={e => setTestForm({...testForm, testType: e.target.value})}>
                  <option>Complete Blood Count (CBC)</option>
                  <option>Malaria Antigen</option>
                  <option>Dengue NS1</option>
                  <option>Typhoid (Widal)</option>
                  <option>Maternal Health Panel</option>
                  <option>Chest X-Ray</option>
                  <option>ECG</option>
                  <option>Ultrasound (Mobile Van)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Date / तारीख</label>
                  <input type="date" required value={testForm.date} onChange={e => setTestForm({...testForm, date: e.target.value})} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Time / समय</label>
                  <input type="time" required value={testForm.time} onChange={e => setTestForm({...testForm, time: e.target.value})} />
                </div>
              </div>
              <h3 style={{ fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '14px', color: 'var(--text-secondary)' }}>Address / पता</h3>
              <div className="input-group">
                <label>House / Street</label>
                <input required value={testForm.house} onChange={e => setTestForm({...testForm, house: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Village / Panchayat</label>
                  <input required value={testForm.village} onChange={e => setTestForm({...testForm, village: e.target.value})} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Landmark</label>
                  <input required value={testForm.landmark} onChange={e => setTestForm({...testForm, landmark: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowBookTest(false)} className="glass-button">Cancel</button>
                <button type="submit" className="glass-button primary">Schedule / बुक करें</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Vitals Modal */}
      {showVitals && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up">
            <h2 style={{ marginBottom: '20px' }}>Log Vitals / आंकड़े दर्ज करें</h2>
            <form onSubmit={handleLogVitals} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Blood Pressure (e.g. 120/80) / रक्तचाप</label>
                <input value={vitalsForm.bp} onChange={e => setVitalsForm({...vitalsForm, bp: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Blood Sugar (mg/dL) / रक्त शर्करा</label>
                <input type="number" value={vitalsForm.sugar} onChange={e => setVitalsForm({...vitalsForm, sugar: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Weight (kg) / वजन</label>
                <input type="number" value={vitalsForm.weight} onChange={e => setVitalsForm({...vitalsForm, weight: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowVitals(false)} className="glass-button">Cancel</button>
                <button type="submit" className="glass-button primary">Save / सहेजें</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showMedicine && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up">
            <h2 style={{ marginBottom: '20px' }}>💊 Add Medicine Reminder / दवाई जोड़ें</h2>
            <form onSubmit={handleAddMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Medicine Name / दवाई का नाम</label>
                <input required value={medForm.name} onChange={e => setMedForm({...medForm, name: e.target.value})} placeholder="e.g. Paracetamol" />
              </div>
              <div className="input-group">
                <label>Dose / खुराक</label>
                <input required value={medForm.dose} onChange={e => setMedForm({...medForm, dose: e.target.value})} placeholder="e.g. 500mg, 1 tablet" />
              </div>
              <div className="input-group">
                <label>Time / समय</label>
                <select value={medForm.time} onChange={e => setMedForm({...medForm, time: e.target.value})}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowMedicine(false)} className="glass-button">Cancel</button>
                <button type="submit" className="glass-button primary">Add Reminder / जोड़ें</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up">
            <h2 style={{ marginBottom: '20px' }}>📁 Upload Document / दस्तावेज</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowUpload(false); showMsg('Document uploaded! / दस्तावेज अपलोड हो गया!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Select File</label>
                <input type="file" required style={{ padding: '8px' }} accept="image/*,.pdf" />
              </div>
              <div className="input-group">
                <label>Description / विवरण</label>
                <input required placeholder="e.g. Prescription from Dr. Sharma" />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowUpload(false)} className="glass-button">Cancel</button>
                <button type="submit" className="glass-button primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-up" style={{ maxWidth: '440px' }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Profile / प्रोफ़ाइल</h2>
            <form onSubmit={handleEditProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Full Name / पूरा नाम</label>
                <input required value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>State / राज्य</label>
                <select value={editState} onChange={e => setEditState(e.target.value)}>
                  <option value="UP">Uttar Pradesh / उत्तर प्रदेश</option>
                  <option value="MP">Madhya Pradesh / मध्य प्रदेश</option>
                  <option value="RJ">Rajasthan / राजस्थान</option>
                  <option value="BR">Bihar / बिहार</option>
                  <option value="MH">Maharashtra / महाराष्ट्र</option>
                </select>
              </div>
              <div className="input-group">
                <label>District / जिला</label>
                <input required value={editDistrict} onChange={e => setEditDistrict(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowEditProfile(false)} className="glass-button">Cancel</button>
                <button type="submit" className="glass-button primary">Save / सहेजें</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
