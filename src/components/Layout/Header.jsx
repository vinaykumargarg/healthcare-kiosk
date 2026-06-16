import React from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import './Header.css';

export const Header = ({ user, onLogout }) => {
  return (
    <header className="app-header glass-panel">
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search / खोजें..." 
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <UserCircle size={32} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user?.name || 'Operator'}</span>
            <span className="user-role">{user?.role === 'doctor' ? 'Doctor / डॉक्टर' : 'Kiosk / कियोस्क'}</span>
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="icon-button" title="Logout">
            <LogOut size={20} color="var(--danger-color)" />
          </button>
        )}
      </div>
    </header>
  );
};
