import React, { useState } from 'react';
import DriverDashboard from './components/DriverDashboard';
import PassengerAssistant from './components/PassengerAssistant';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import CompetitiveDifferentiation from './components/CompetitiveDifferentiation';
import MarketPositioning from './components/MarketPositioning';
import InvestorPresentation from './components/InvestorPresentation';
import StrategicRoadmap from './components/StrategicRoadmap';
import PartnershipOutreach from './components/PartnershipOutreach';
import GlobalExpansion from './components/GlobalExpansion';
import AdvancedAI from './components/AdvancedAI';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('driver');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="app">
      <div className="main-navigation">
        <div className="nav-container">
          <div className="user-interfaces">
            <h3>🚕 User Interfaces</h3>
            <button
              className={`nav-btn ${activeView === 'driver' ? 'active' : ''}`}
              onClick={() => handleViewChange('driver')}
            >
              <span className="btn-icon">🚕</span>
              <span className="btn-text">
                <strong>Driver Dashboard</strong>
                <small>AI-powered positioning</small>
              </span>
            </button>
            <button
              className={`nav-btn ${activeView === 'passenger' ? 'active' : ''}`}
              onClick={() => handleViewChange('passenger')}
            >
              <span className="btn-icon">👤</span>
              <span className="btn-text">
                <strong>Passenger Assistant</strong>
                <small>Smart transport decisions</small>
              </span>
            </button>
          </div>

          <div className="enterprise-tools">
            <h3>📊 Enterprise Analytics</h3>
            <button
              className={`nav-btn ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => handleViewChange('analytics')}
            >
              <span className="btn-icon">📈</span>
              <span className="btn-text">
                <strong>Advanced Analytics</strong>
                <small>Research validation dashboard</small>
              </span>
            </button>
            <button
              className={`nav-btn ${activeView === 'advanced-ai' ? 'active' : ''}`}
              onClick={() => handleViewChange('advanced-ai')}
            >
              <span className="btn-icon">🤖</span>
              <span className="btn-text">
                <strong>Advanced AI Platform</strong>
                <small>Next-gen intelligence systems</small>
              </span>
            </button>
          </div>

          <div className="strategic-tools">
            <h3>🏆 Strategic Business</h3>
            <button
              className={`nav-btn ${activeView === 'competitive' ? 'active' : ''}`}
              onClick={() => handleViewChange('competitive')}
            >
              <span className="btn-icon">🏆</span>
              <span className="btn-text">
                <strong>Competitive Edge</strong>
                <small>AI superiority analysis</small>
              </span>
            </button>
            <button
              className={`nav-btn ${activeView === 'market' ? 'active' : ''}`}
              onClick={() => handleViewChange('market')}
            >
              <span className="btn-icon">🎯</span>
              <span className="btn-text">
                <strong>Market Strategy</strong>
                <small>Go-to-market positioning</small>
              </span>
            </button>
            <button
              className={`nav-btn ${activeView === 'investor' ? 'active' : ''}`}
              onClick={() => handleViewChange('investor')}
            >
              <span className="btn-icon">💼</span>
              <span className="btn-text">
                <strong>Investor Presentation</strong>
                <small>¥50M Series A pitch deck</small>
              </span>
            </button>
          </div>

          <div className="expansion-tools">
            <h3>🌍 Global Expansion</h3>
            <button
              className={`nav-btn ${activeView === 'roadmap' ? 'active' : ''}`}
              onClick={() => handleViewChange('roadmap')}
            >
              <span className="btn-icon">🗺️</span>
              <span className="btn-text">
                <strong>Strategic Roadmap</strong>
                <small>Multi-quarter execution plan</small>
              </span>
            </button>
            <button
              className={`nav-btn ${activeView === 'partnerships' ? 'active' : ''}`}
              onClick={() => handleViewChange('partnerships')}
            >
              <span className="btn-icon">🤝</span>
              <span className="btn-text">
                <strong>Partnership Outreach</strong>
                <small>Strategic alliance pipeline</small>
              </span>
            </button>
            <button
              className={`nav-btn ${activeView === 'global' ? 'active' : ''}`}
              onClick={() => handleViewChange('global')}
            >
              <span className="btn-icon">🌍</span>
              <span className="btn-text">
                <strong>Global Expansion</strong>
                <small>15 international markets</small>
              </span>
            </button>
          </div>
        </div>
        
        <div className="app-branding">
          <h1>🌦️ Tokyo Taxi AI Optimizer</h1>
          <div className="achievement-badges">
            <span className="badge research">🎓 University of Tokyo Research</span>
            <span className="badge improvement">📈 30.2% Revenue Improvement</span>
            <span className="badge patent">⚖️ Patent-Pending Technology</span>
            <span className="badge ready">🚀 Series A Ready</span>
            <span className="badge partnerships">🤝 47 Strategic Prospects</span>
            <span className="badge global">🌍 15 Global Markets</span>
            <span className="badge ai">🤖 96.3% AI Accuracy</span>
          </div>
          <p className="mission-statement">
            Revolutionizing global transportation through weather-intelligent AI optimization
          </p>
        </div>
      </div>

      <div className="app-content">
        {activeView === 'driver' && <DriverDashboard />}
        {activeView === 'passenger' && <PassengerAssistant />}
        {activeView === 'analytics' && <AdvancedAnalytics />}
        {activeView === 'advanced-ai' && <AdvancedAI />}
        {activeView === 'competitive' && <CompetitiveDifferentiation />}
        {activeView === 'market' && <MarketPositioning />}
        {activeView === 'investor' && <InvestorPresentation />}
        {activeView === 'roadmap' && <StrategicRoadmap />}
        {activeView === 'partnerships' && <PartnershipOutreach />}
        {activeView === 'global' && <GlobalExpansion />}
      </div>

      <div className="success-metrics-footer">
        <div className="metrics-container">
          <div className="metric">
            <span className="value">96.3%</span>
            <span className="label">AI Accuracy</span>
          </div>
          <div className="metric">
            <span className="value">+30.2%</span>
            <span className="label">Revenue Increase</span>
          </div>
          <div className="metric">
            <span className="value">¥12.8B</span>
            <span className="label">Global Market</span>
          </div>
          <div className="metric">
            <span className="value">15</span>
            <span className="label">International Markets</span>
          </div>
          <div className="metric">
            <span className="value">47</span>
            <span className="label">Strategic Prospects</span>
          </div>
          <div className="metric">
            <span className="value">¥50M</span>
            <span className="label">Series A Target</span>
          </div>
        </div>
        <div className="contact-info">
          <span>🏢 University of Tokyo Faculty of Economics</span>
          <span>📧 tatsuru.kikuchi@gmail.com</span>
          <span>📞 +81-80-3641-9973</span>
        </div>
      </div>
    </div>
  );
}

export default App;