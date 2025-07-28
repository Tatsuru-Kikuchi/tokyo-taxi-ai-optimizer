import React, { useState } from 'react';
import DriverDashboard from './components/DriverDashboard';
import PassengerAssistant from './components/PassengerAssistant';
import './App.css';

function App() {
  const [userType, setUserType] = useState('driver'); // 'driver' or 'passenger'

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  return (
    <div className="app">
      {/* User Type Selector */}
      <div className="user-type-selector">
        <div className="selector-container">
          <button
            className={`user-type-btn ${userType === 'driver' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('driver')}
          >
            <span className="btn-icon">🚕</span>
            <span className="btn-text">
              <strong>Driver</strong>
              <small>Where should I go?</small>
            </span>
          </button>
          <button
            className={`user-type-btn ${userType === 'passenger' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('passenger')}
          >
            <span className="btn-icon">👤</span>
            <span className="btn-text">
              <strong>Passenger</strong>
              <small>Should I take a taxi?</small>
            </span>
          </button>
        </div>
        
        <div className="app-branding">
          <h1>🌦️ Tokyo Taxi Weather Intelligence</h1>
          <p>
            <span className="research-badge">🎓 University of Tokyo Research</span>
            • 30.2% productivity improvement through weather-AI integration
          </p>
        </div>
      </div>

      {/* Render appropriate component based on user type */}
      <div className="app-content">
        {userType === 'driver' ? <DriverDashboard /> : <PassengerAssistant />}
      </div>
    </div>
  );
}

export default App;