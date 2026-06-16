import React from 'react';
import { Users, Video, Activity, Truck } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="stat-card glass-panel animate-fade-in">
    <div className="stat-header">
      <div className="stat-icon-wrapper">
        <Icon size={24} className="stat-icon" />
      </div>
      <span className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>{title}</p>
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1 className="text-gradient">Platform Overview <span style={{ fontSize: '0.7em', color: 'var(--text-secondary)' }}>/ मंच अवलोकन</span></h1>
        <p className="text-secondary">Welcome back, Dr. Jenkins. / स्वागत है, डॉ. जेनकिंस.</p>
      </header>

      <section className="stats-grid">
        <StatCard title="Active Kiosks&#10;सक्रिय कियोस्क" value="124" icon={Activity} trend={5} />
        <StatCard title="Consultations&#10;परामर्श" value="89" icon={Video} trend={12} />
        <StatCard title="Mobile Units&#10;मोबाइल इकाइयां" value="12" icon={Truck} trend={0} />
        <StatCard title="Total Patients&#10;कुल मरीज़" value="1,204" icon={Users} trend={18} />
      </section>

      <div className="dashboard-content-grid">
        <div className="recent-activity glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2>Recent Activity / हाल की गतिविधि</h2>
          <div className="activity-list">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <h4>New Alert / नया अलर्ट</h4>
                  <p>Kiosk #42 - High probability of retinopathy. / रेटिनोपैथी की उच्च संभावना।</p>
                  <span className="activity-time">10 mins ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="upcoming-appointments glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2>Appointments / नियुक्तियां</h2>
          <div className="appointment-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="appointment-item">
                <div className="patient-avatar">
                  <Users size={20} />
                </div>
                <div className="appointment-details">
                  <h4>John Doe</h4>
                  <p>Follow-up / अनुवर्ती कार्रवाई</p>
                </div>
                <button className="glass-button primary small">Join / जुड़ें</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
