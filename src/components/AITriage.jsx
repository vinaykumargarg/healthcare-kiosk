import React, { useState } from 'react';
import { Bot, Send, AlertCircle, X } from 'lucide-react';
import API_BASE from '../config';

export const AITriage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ report: "Network error", severity: "low" });
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="glass-button primary"
        style={{ position: 'fixed', bottom: '24px', right: '24px', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)', zIndex: 1000 }}
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ position: 'fixed', bottom: '24px', right: '24px', width: '380px', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
      <div style={{ background: 'var(--primary-color)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={24} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Triage Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--surface-color)' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Describe the patient's symptoms to get an instant AI risk assessment before adding them to the queue.</p>
        
        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea 
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. Patient has a high fever, cough, and chest pain..."
            style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border-color)', color: 'white', fontFamily: 'inherit', resize: 'none' }}
          />
          <button type="submit" disabled={loading} className="glass-button primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {loading ? 'Analyzing...' : <><Send size={16} /> Analyze Symptoms</>}
          </button>
        </form>

        {result && (
          <div style={{ padding: '16px', borderRadius: '8px', background: result.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : result.severity === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${result.severity === 'high' ? 'var(--danger-color)' : result.severity === 'medium' ? 'var(--warning-color)' : 'var(--success-color)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: result.severity === 'high' ? 'var(--danger-color)' : result.severity === 'medium' ? 'var(--warning-color)' : 'var(--success-color)' }}>
              <AlertCircle size={18} />
              <strong>{result.severity.toUpperCase()} RISK</strong>
            </div>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>{result.report}</p>
          </div>
        )}
      </div>
    </div>
  );
};
