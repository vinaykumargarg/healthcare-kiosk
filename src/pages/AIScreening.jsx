import React from 'react';
import { Upload, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export const AIScreening = () => {
  return (
    <div className="ai-screening-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header className="page-header">
        <h1 className="text-gradient">AI Screening <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>/ एआई जांच</span></h1>
        <p className="text-secondary">Upload diagnostic imaging for instant AI analysis. / तत्काल एआई विश्लेषण के लिए स्कैन अपलोड करें।</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="upload-section glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: '2px', textAlign: 'center', minHeight: '300px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
            <Upload size={40} color="var(--primary-color)" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Upload Scan / स्कैन अपलोड करें</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Drag and drop files here. / यहां फाइलें लाएं।</p>
          <button className="glass-button primary">Select Files / फाइलें चुनें</button>
        </div>

        <div className="results-section glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Analysis / विश्लेषण</h3>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle color="var(--danger-color)" size={24} style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ color: 'var(--danger-color)', marginBottom: '4px' }}>High Risk / उच्च जोखिम</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Patient #LK-1002 - High probability of issue. / समस्या की उच्च संभावना।</p>
              <button className="glass-button small">Review / समीक्षा करें</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle color="var(--success-color)" size={24} style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ color: 'var(--success-color)', marginBottom: '4px' }}>Normal / सामान्य</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Patient #LK-1001 - No issues detected. / कोई समस्या नहीं।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
