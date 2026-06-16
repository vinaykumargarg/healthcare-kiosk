import React from 'react';
import { Search, Filter, FileText, Download } from 'lucide-react';

export const EHR = () => {
  return (
    <div className="ehr-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header className="page-header">
        <h1 className="text-gradient">Health Records <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>/ स्वास्थ्य रिकॉर्ड</span></h1>
        <p className="text-secondary">Access and manage patient histories securely. / रोगी इतिहास सुरक्षित रूप से प्रबंधित करें।</p>
      </header>

      <div className="ehr-controls glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, margin: 0, width: 'auto' }}>
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search / खोजें..." className="search-input" />
        </div>
        <button className="glass-button">
          <Filter size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Filter / फ़िल्टर
        </button>
      </div>

      <div className="records-list glass-panel" style={{ padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>ID / पहचान</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Name / नाम</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Last Visit / अंतिम यात्रा</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Condition / स्थिति</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Actions / कार्रवाई</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px' }}>#LK-{1000 + i}</td>
                <td style={{ padding: '16px', fontWeight: 500 }}>Patient / मरीज़ {i}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>Oct {10 + i}, 2023</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    background: 'rgba(20, 184, 166, 0.1)', 
                    color: 'var(--accent-color)', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem' 
                  }}>Stable / स्थिर</span>
                </td>
                <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                  <button className="glass-button small" style={{ padding: '6px 12px' }}><FileText size={16} /></button>
                  <button className="glass-button small" style={{ padding: '6px 12px' }}><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
