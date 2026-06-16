import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AITriage } from '../AITriage';
import './Layout.css';

export const Layout = ({ user, onLogout }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header user={user} onLogout={onLogout} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <AITriage />
    </div>
  );
};
