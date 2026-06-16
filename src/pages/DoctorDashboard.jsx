import React, { useState, useEffect } from 'react';
import { Users, Activity, Phone, CheckCircle, Clock } from 'lucide-react';
import API_BASE from '../config';

export const DoctorDashboard = ({ user, onLogout }) => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/queue`);
        const data = await res.json();
        setQueue(data);
      } catch (err) {
        console.error("Failed to fetch queue", err);
      }
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="doctor-dashboard" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', height: '100vh', overflowY: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Doctor Portal</h1>
          <p className="text-secondary">Welcome, {user.name}</p>
        </div>
        <button onClick={onLogout} className="glass-button">Logout</button>
      </header>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '24px' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users color="var(--primary-color)" /> Waiting Queue
          </h2>
          
          {queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <CheckCircle size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <p>No patients in queue. Excellent!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {queue.map(patient => (
                <div key={patient.queue_id} className="patient-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{patient.name} ({patient.age}{patient.gender})</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Waiting since {new Date(patient.timestamp).toLocaleTimeString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning-color)' }}><Activity size={14} /> Triage: {patient.triage_notes}</span>
                    </div>
                  </div>
                  <button className="glass-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} /> Accept Call
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="glass-panel" style={{ padding: '20px' }}>
             <h3>Session Stats</h3>
             <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Consults Today</span>
                  <strong>14</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Avg Time</span>
                  <strong>8m 30s</strong>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
