import React, { useState, useEffect } from 'react';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const [hotspots, setHotspots] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchDriverData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchDriverData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/weather/driver/hotspots');
      const data = await response.json();
      
      if (data.success) {
        setHotspots(data.data.recommendations);
        setWeatherData(data.data.weather_context);
        setLastUpdate(new Date().toLocaleTimeString());
        setError(null);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError('Unable to fetch driver recommendations');
      console.error('Error fetching driver data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openMapsNavigation = (coordinates) => {
    const { latitude, longitude } = coordinates;
    const mapsUrl = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      default: return '#95A5A6';
    }
  };

  const getWeatherIcon = (condition) => {
    if (condition.includes('Rain')) return '🌧️';
    if (condition.includes('Clear')) return '☀️';
    if (condition.includes('Cloudy')) return '☁️';
    return '🌤️';
  };

  if (loading && !hotspots.length) {
    return (
      <div className="driver-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading driver recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🚕 Driver Dashboard</h1>
          <div className="header-stats">
            <div className="weather-summary">
              {weatherData && (
                <>
                  <span className="weather-icon">
                    {getWeatherIcon(weatherData.current_condition)}
                  </span>
                  <span className="weather-text">
                    {weatherData.current_condition} • {weatherData.temperature}
                  </span>
                  {weatherData.is_raining && (
                    <span className="rain-intensity">
                      • {weatherData.rain_intensity} rain
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="last-update">
              Last update: {lastUpdate}
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={fetchDriverData} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Weather Alert */}
      {weatherData && weatherData.is_raining && (
        <div className="weather-alert">
          <div className="alert-content">
            <span className="alert-icon">⚡</span>
            <div className="alert-text">
              <strong>Rain Opportunity Active!</strong>
              <p>Demand increased by {Math.round((weatherData.demand_multiplier - 1) * 100)}% • Higher earnings potential</p>
            </div>
          </div>
        </div>
      )}

      {/* Hotspots Grid */}
      <div className="hotspots-container">
        <div className="section-header">
          <h2>📍 Recommended Positions</h2>
          {hotspots.length > 0 && (
            <span className="opportunity-count">
              {hotspots.length} opportunity{hotspots.length !== 1 ? 's' : ''} detected
            </span>
          )}
        </div>

        {hotspots.length === 0 ? (
          <div className="no-opportunities">
            <div className="no-opportunities-content">
              <span className="no-opportunities-icon">🎯</span>
              <h3>No High-Opportunity Zones</h3>
              <p>Normal demand patterns detected. Continue regular operations.</p>
              <div className="baseline-advice">
                <strong>Baseline Strategy:</strong> Focus on traditional high-traffic areas like Tokyo Station, Shibuya, and Shinjuku.
              </div>
            </div>
          </div>
        ) : (
          <div className="hotspots-grid">
            {hotspots.map((hotspot, index) => (
              <div 
                key={index} 
                className="hotspot-card"
                style={{ '--priority-color': getPriorityColor(hotspot.priority) }}
              >
                <div className="card-header">
                  <div className="location-info">
                    <h3 className="location-name">{hotspot.location}</h3>
                    <span className={`priority-badge ${hotspot.priority}`}>
                      {hotspot.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="opportunity-metrics">
                    <div className="metric">
                      <span className="metric-value">{hotspot.opportunity.demand_increase}</span>
                      <span className="metric-label">Demand</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{hotspot.opportunity.revenue_boost}</span>
                      <span className="metric-label">Revenue</span>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="reasoning">
                    <p>{hotspot.reasoning}</p>
                  </div>
                  
                  <div className="weather-trigger">
                    <strong>Weather Trigger:</strong> {hotspot.weather_trigger}
                  </div>

                  <div className="logistics">
                    <div className="logistics-item">
                      <span className="logistics-icon">🕐</span>
                      <span>Travel: {hotspot.logistics.travel_time}</span>
                    </div>
                    <div className="logistics-item">
                      <span className="logistics-icon">🎯</span>
                      <span>Confidence: {hotspot.opportunity.confidence}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button 
                    className="navigate-button"
                    onClick={() => openMapsNavigation(hotspot.coordinates)}
                  >
                    <span className="button-icon">🧭</span>
                    Navigate There
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Research Footer */}
      <div className="research-footer">
        <div className="research-content">
          <div className="research-badge">
            <span className="university-icon">🎓</span>
            <div className="research-text">
              <strong>University of Tokyo Research</strong>
              <p>30.2% productivity improvement • 0.847 rain-demand correlation</p>
            </div>
          </div>
          <div className="refresh-button-container">
            <button 
              onClick={fetchDriverData} 
              className="refresh-button"
              disabled={loading}
            >
              {loading ? '🔄' : '↻'} Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;