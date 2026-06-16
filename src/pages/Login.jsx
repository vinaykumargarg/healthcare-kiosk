import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
import API_BASE from '../config';

/* ── Feature slides ─────────────────────── */
const slides = [
  {
    emoji: '🩺',
    title: 'Consult Top Doctors',
    titleHi: 'शीर्ष डॉक्टरों से परामर्श',
    desc: 'Connect instantly with city specialists via video call from your village.',
    descHi: 'वीडियो कॉल के माध्यम से शहर के विशेषज्ञों से तुरंत जुड़ें।',
    color: '#0EA5E9',
  },
  {
    emoji: '🏥',
    title: 'Diagnostics at Home',
    titleHi: 'घर पर जांच सेवा',
    desc: 'Book blood tests, X-Ray vans & ultrasounds at your doorstep.',
    descHi: 'रक्त परीक्षण, एक्स-रे वैन और अल्ट्रासाउंड घर पर बुक करें।',
    color: '#14B8A6',
  },
  {
    emoji: '🆘',
    title: 'Emergency SOS',
    titleHi: 'आपातकालीन SOS',
    desc: 'One-tap ambulance call — 108, 112 & maternity services always ready.',
    descHi: 'एक टैप से एम्बुलेंस कॉल — 108, 112 हमेशा तैयार।',
    color: '#EF4444',
  },
  {
    emoji: '💊',
    title: 'Medicine Reminders',
    titleHi: 'दवाई याद-दिलाएं',
    desc: 'Never miss a dose — set smart daily reminders for any medication.',
    descHi: 'कोई खुराक न भूलें — किसी भी दवाई के लिए स्मार्ट रिमाइंडर सेट करें।',
    color: '#10B981',
  },
  {
    emoji: '🤖',
    title: 'AI Health Assistant',
    titleHi: 'AI स्वास्थ्य सहायक',
    desc: 'Describe symptoms in Hindi or English — get instant AI-powered triage.',
    descHi: 'हिंदी या अंग्रेजी में लक्षण बताएं — तुरंत AI ट्राइएज प्राप्त करें।',
    color: '#8B5CF6',
  },
  {
    emoji: '📋',
    title: 'Govt Health Schemes',
    titleHi: 'सरकारी स्वास्थ्य योजनाएं',
    desc: 'Access Ayushman Bharat, PM-JAY & maternal health programme info.',
    descHi: 'आयुष्मान भारत, PM-JAY और मातृ स्वास्थ्य योजना की जानकारी।',
    color: '#F59E0B',
  },
];

export const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);
  const [agreed, setAgreed] = useState(false);

  /* Auto-advance slides */
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegister && !agreed) return setError('Please agree to terms first.');
    setLoading(true);
    setError('');

    const endpoint = isRegister
      ? `${API_BASE}/api/register`
      : `${API_BASE}/api/login`;
    const payload = isRegister
      ? { mobile, name, age: role === 'patient' ? (parseInt(age) || 0) : 0, gender: role === 'patient' ? gender : 'O', role }
      : { username: mobile };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Authentication failed. Try again.');
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(p => !p);
    setError('');
    setMobile('');
    setName('');
    setAge('');
    setGender('');
    setRole('patient');
    setAgreed(false);
  };

  const cur = slides[slide];

  /* Shared input style — 100% inline to avoid all CSS conflicts */
  const inputStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    height: '100%',
    fontFamily: "'Inter', 'Mukta', sans-serif",
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box',
  };

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0 18px',
    height: '52px',
    transition: 'border-color 0.2s ease, background-color 0.3s ease',
    boxSizing: 'border-box',
  };

  return (
    <div className="lk-login-root">

      {/* ── LEFT PANEL ── */}
      <div className="lk-left-panel" style={{ '--slide-color': cur.color }}>
        {/* Top brand */}
        <div className="lk-brand">
          <div className="lk-brand-icon">🏥</div>
          <div>
            <h1 className="lk-brand-name">Lok Kalyan</h1>
            <p className="lk-brand-tagline">लोक कल्याण</p>
          </div>
        </div>

        {/* Feature Slide */}
        <div className="lk-slide-area" key={slide}>
          <div className="lk-slide-emoji">{cur.emoji}</div>
          <h2 className="lk-slide-title">{cur.title}</h2>
          <h3 className="lk-slide-title-hi">{cur.titleHi}</h3>
          <p className="lk-slide-desc">{cur.desc}</p>
          <p className="lk-slide-desc-hi">{cur.descHi}</p>
        </div>

        {/* Slide dots */}
        <div className="lk-dots">
          {slides.map((s, i) => (
            <button
              key={i}
              className={`lk-dot ${i === slide ? 'active' : ''}`}
              onClick={() => setSlide(i)}
              style={{ background: i === slide ? cur.color : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>

        {/* Stats strip */}
        <div className="lk-stats">
          <div className="lk-stat"><span>500+</span><p>Villages Covered</p></div>
          <div className="lk-stat"><span>50+</span><p>Doctors</p></div>
          <div className="lk-stat"><span>Free</span><p>Registration</p></div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lk-right-panel">
        <div className="lk-form-card">

          {/* Card Header */}
          <div className="lk-card-header">
            <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="lk-card-sub">
              {isRegister ? 'खाता बनाएं — Join Lok Kalyan for free' : 'लॉगिन करें — Enter your mobile number'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="lk-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="lk-form">

            {/* Name field — Register only */}
            {isRegister && (
              <div>
                <label className="lk-label">Full Name / पूरा नाम</label>
                <div style={wrapperStyle}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '100%' }}>👤</span>
                  <input
                    type="text"
                    placeholder="Ramesh Kumar"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoComplete="name"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Mobile */}
            <div>
              <label className="lk-label">Mobile Number / मोबाइल नंबर</label>
              <div style={wrapperStyle}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '100%' }}>📱</span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  required
                  maxLength={10}
                  autoComplete="tel"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Role Select — Register only */}
            {isRegister && (
              <div>
                <label className="lk-label">Register As / किस रूप में पंजीकृत करें</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `2px solid ${role === 'patient' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      background: role === 'patient' ? 'rgba(14,165,233,0.15)' : 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    👤 Patient / नागरिक
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `2px solid ${role === 'provider' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      background: role === 'provider' ? 'rgba(14,165,233,0.15)' : 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🏪 Provider / प्रदाता
                  </button>
                </div>
              </div>
            )}

            {/* Age + Gender — Register only */}
            {isRegister && role === 'patient' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label className="lk-label">Age / उम्र</label>
                  <div style={wrapperStyle}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>🎂</span>
                    <input
                      type="number"
                      placeholder="25"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      min="1"
                      max="120"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="lk-label">Gender / लिंग</label>
                  <div style={{ ...wrapperStyle, padding: '4px 12px' }}>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      required
                      style={{
                        ...inputStyle,
                        padding: '14px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="" style={{ background: 'var(--select-option-bg)', color: 'var(--text-primary)' }}>Select</option>
                      <option value="M" style={{ background: 'var(--select-option-bg)', color: 'var(--text-primary)' }}>Male / पुरुष</option>
                      <option value="F" style={{ background: 'var(--select-option-bg)', color: 'var(--text-primary)' }}>Female / महिला</option>
                      <option value="O" style={{ background: 'var(--select-option-bg)', color: 'var(--text-primary)' }}>Other / अन्य</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Terms — Register only */}
            {isRegister && (
              <label className="lk-terms">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0EA5E9', flexShrink: 0 }}
                />
                <span>I agree to the terms of service and privacy policy. / मैं सेवा की शर्तों से सहमत हूं।</span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="lk-submit-btn"
              disabled={loading || (isRegister && !agreed)}
            >
              {loading
                ? '⏳ Please wait...'
                : isRegister
                  ? '✅ Create Account / खाता बनाएं'
                  : '🔐 Login / लॉगिन करें'}
            </button>
          </form>

          {/* Toggle */}
          <div className="lk-toggle-area">
            <span className="lk-divider-text">or / या</span>
            <button className="lk-toggle-btn" onClick={switchMode}>
              {isRegister
                ? '← Already have an account? Login'
                : 'New patient? Create Free Account →'}
            </button>
          </div>

          {/* Demo Accounts */}
          {!isRegister && (
            <div className="lk-demo-accounts">
              <p className="lk-demo-title">🏥 Demo Staff Login</p>
              <div className="lk-demo-chips">
                <button className="lk-chip" onClick={() => setMobile('kiosk1')}>
                  🖥️ kiosk1 <span>Operator</span>
                </button>
                <button className="lk-chip" onClick={() => setMobile('doctor1')}>
                  👨‍⚕️ doctor1 <span>Doctor</span>
                </button>
                <button className="lk-chip" onClick={() => setMobile('provider1')}>
                  🧪 provider1 <span>Provider</span>
                </button>
              </div>
            </div>
          )}

          {/* Emergency strip */}
          <div className="lk-emergency-strip">
            🆘 Emergency? Call <a href="tel:108">108</a> &nbsp;|&nbsp; <a href="tel:112">112</a>
          </div>
        </div>
      </div>
    </div>
  );
};
