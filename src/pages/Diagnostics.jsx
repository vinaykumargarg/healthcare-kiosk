import React, { useState, useEffect } from 'react';
import { Truck, Droplet, Clock, Plus, MapPin } from 'lucide-react';
import './Diagnostics.css';
import API_BASE from '../config';

export const Diagnostics = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ patient_name: '', test_type: 'Blood Test', request_type: 'Home Collection', location: '' });

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/diagnostics`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/diagnostics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({ patient_name: '', test_type: 'Blood Test', request_type: 'Home Collection', location: '' });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="diagnostics-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient">Diagnostics & Logistics <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>/ जांच और लॉजिस्टिक्स</span></h1>
          <p className="text-secondary">Schedule home sample collections and mobile van visits. / घर से सैंपल या मोबाइल वैन बुक करें।</p>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Request / नया अनुरोध
        </button>
      </header>

      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No active requests found.</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.req_id} className="request-card glass-panel animate-fade-in">
              <div className="req-header">
                <span className={`req-badge ${req.request_type === 'Mobile Van' ? 'van' : 'home'}`}>
                  {req.request_type === 'Mobile Van' ? <Truck size={14} /> : <Droplet size={14} />}
                  {req.request_type}
                </span>
                <span className="req-status">{req.status}</span>
              </div>
              <div className="req-content">
                <h3>{req.patient_name}</h3>
                <p className="test-type">{req.test_type}</p>
                <div className="req-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {req.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Schedule Diagnostics / जांच बुक करें</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <div className="input-group">
                <label>Patient Name / मरीज का नाम</label>
                <input required value={formData.patient_name} onChange={e => setFormData({...formData, patient_name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Request Type / प्रकार</label>
                <select value={formData.request_type} onChange={e => setFormData({...formData, request_type: e.target.value})}>
                  <option>Home Collection</option>
                  <option>Mobile Van</option>
                </select>
              </div>
              <div className="input-group">
                <label>Test Type / जांच</label>
                <input required placeholder="e.g. CBC, Chest X-Ray" value={formData.test_type} onChange={e => setFormData({...formData, test_type: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Location / स्थान</label>
                <input required placeholder="Village Name / Address" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="glass-button">Cancel</button>
                <button type="submit" className="glass-button primary">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
