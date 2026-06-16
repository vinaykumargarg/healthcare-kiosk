import React from 'react';
import { Video, Mic, MicOff, PhoneOff, MonitorUp, Settings } from 'lucide-react';
import './Telemedicine.css';

export const Telemedicine = () => {
  return (
    <div className="telemedicine-page">
      <header className="page-header">
        <h1 className="text-gradient">Active Consultation <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>/ सक्रिय परामर्श</span></h1>
        <p className="text-secondary">Connected with Kiosk #42 - Rural Clinic Alpha</p>
      </header>

      <div className="video-container glass-panel">
        <div className="main-video">
          {/* Mock video feed */}
          <div className="video-placeholder">
            <Video size={48} className="video-icon" />
            <span>Waiting for patient video...<br/><span style={{fontSize: '0.9em', opacity: 0.8}}>मरीज के वीडियो का इंतज़ार...</span></span>
          </div>
          
          <div className="video-controls glass-panel">
            <button className="control-btn"><Mic size={20} /></button>
            <button className="control-btn"><Video size={20} /></button>
            <button className="control-btn"><MonitorUp size={20} /></button>
            <button className="control-btn"><Settings size={20} /></button>
            <button className="control-btn end-call"><PhoneOff size={20} /></button>
          </div>
        </div>
        
        <div className="side-panel">
          <div className="patient-card glass-panel">
            <h3>Patient Context / मरीज का संदर्भ</h3>
            <div className="info-row">
              <span className="label">Name / नाम</span>
              <span className="value">Jane Smith</span>
            </div>
            <div className="info-row">
              <span className="label">Age / आयु</span>
              <span className="value">45</span>
            </div>
            <div className="info-row">
              <span className="label">Reason / कारण</span>
              <span className="value">Persistent Cough / लगातार खांसी</span>
            </div>
            <div className="info-row">
              <span className="label">Vitals / स्वास्थ्य स्तर</span>
              <span className="value warning">BP 140/90, HR 88</span>
            </div>
          </div>
          
          <div className="notes-card glass-panel">
            <h3>Notes / नोट्स</h3>
            <textarea placeholder="Type notes here... / यहां नोट्स टाइप करें..." className="notes-input"></textarea>
            <button className="glass-button primary">Save / सहेजें</button>
          </div>
        </div>
      </div>
    </div>
  );
};
