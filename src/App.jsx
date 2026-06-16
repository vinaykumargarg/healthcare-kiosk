import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Telemedicine } from './pages/Telemedicine';
import { Diagnostics } from './pages/Diagnostics';
import { EHR } from './pages/EHR';
import { AIScreening } from './pages/AIScreening';
import { Login } from './pages/Login';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { ProviderPortal } from './pages/ProviderPortal';

function App() {
  const [user, setUser] = useState(null);
  const [themeMode, setThemeMode] = useState('auto'); // auto | light | dark
  const [isDaylight, setIsDaylight] = useState(true);

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    const checkTheme = () => {
      const hour = new Date().getHours();
      // Auto Sunlight: Day is 6 AM (6) to 6 PM (18)
      const day = hour >= 6 && hour < 18;
      setIsDaylight(day);

      if (themeMode === 'auto') {
        if (day) {
          document.documentElement.classList.add('light-theme');
        } else {
          document.documentElement.classList.remove('light-theme');
        }
      } else if (themeMode === 'light') {
        document.documentElement.classList.add('light-theme');
      } else if (themeMode === 'dark') {
        document.documentElement.classList.remove('light-theme');
      }
    };

    checkTheme();
    const t = setInterval(checkTheme, 60000); // check sunlight status every minute
    return () => clearInterval(t);
  }, [themeMode]);

  const toggleTheme = () => {
    if (themeMode === 'auto') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('dark');
    else setThemeMode('auto');
  };

  const renderContent = () => {
    if (!user) {
      return <Login onLogin={setUser} />;
    }

    if (user.role === 'doctor') {
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }
    
    if (user.role === 'patient') {
      return <PatientDashboard user={user} onLogout={handleLogout} />;
    }

    if (user.role === 'provider') {
      return <ProviderPortal user={user} onLogout={handleLogout} />;
    }

    // Operator / Kiosk View
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<Dashboard />} />
            <Route path="telemedicine" element={<Telemedicine />} />
            <Route path="diagnostics" element={<Diagnostics />} />
            <Route path="ehr" element={<EHR />} />
            <Route path="ai-screening" element={<AIScreening />} />
          </Route>
        </Routes>
      </Router>
    );
  };

  return (
    <>
      {/* Floating Auto Sunlight Theme Toggle Pill */}
      <button 
        onClick={toggleTheme}
        className="glass-button"
        style={{
          position: 'fixed',
          top: '16px',
          right: '120px',
          zIndex: 999999,
          padding: '8px 14px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {themeMode === 'auto' ? (isDaylight ? '☀️ Auto (Sunlight)' : '🌙 Auto (Night)') : 
         themeMode === 'light' ? '💡 Light Mode' : '🕶️ Dark Mode'}
      </button>

      {renderContent()}
    </>
  );
}

export default App;

