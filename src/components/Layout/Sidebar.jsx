import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Video, FileText, Activity, Settings, User, Truck } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard / डैशबोर्ड', icon: Home },
  { path: '/telemedicine', label: 'Telemedicine / टेलीमेडिसिन', icon: Video },
  { path: '/diagnostics', label: 'Diagnostics / जांच', icon: Truck },
  { path: '/ehr', label: 'Records / स्वास्थ्य रिकॉर्ड', icon: FileText },
  { path: '/ai-screening', label: 'Screening / एआई जांच', icon: Activity },
];

export const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Activity size={28} color="var(--primary-color)" />
        </div>
        <h2 className="text-gradient" style={{ lineHeight: '1.2' }}>
          Lok Kalyan<br/>
          <span style={{ fontSize: '0.85em', fontWeight: '500' }}>लोक कल्याण</span>
        </h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} className="nav-icon" />
          <span style={{ fontSize: '0.95rem' }}>Settings / सेटिंग्स</span>
        </button>
        <button className="nav-item">
          <User size={20} className="nav-icon" />
          <span style={{ fontSize: '0.95rem' }}>Profile / प्रोफ़ाइल</span>
        </button>
      </div>
    </aside>
  );
};
