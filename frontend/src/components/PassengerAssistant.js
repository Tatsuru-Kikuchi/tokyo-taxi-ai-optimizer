import React, { useState, useEffect } from 'react';
import './PassengerAssistant.css';

const PassengerAssistant = () => {
  const [advice, setAdvice] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Popular Tokyo locations for quick selection
  const popularLocations = [
    'Shibuya Station', 'Tokyo Station', 'Shinjuku Station', 'Ginza',
    'Roppongi', 'Harajuku', 'Akihabara', 'Ueno Station',
    'Ikebukuro Station', 'Asakusa'
  ];

  useEffect(() => {
    fetchWeatherForecast();
  }, []);

  const fetchWeatherForecast = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/weather/forecast');
      const data = await response.json();
      if (data.success) {
        setWeatherForecast(data.data);
      }
    } catch (err) {
      console.error('Error fetching weather forecast:', err);
    }
  };

  const fetchPassengerAdvice = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/weather/passenger/advice?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setAdvice(data.data);
      } else {
        throw new Error('Failed to get advice');
      }
    } catch (err) {
      setError('Unable to generate transportation advice');
      console.error('Error fetching passenger advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location, isOrigin) => {
    if (isOrigin) {
      setOrigin(location);
    } else {
      setDestination(location);
    }
  };

  const getRecommendationIcon = (decision) => {
    const iconMap = {
      'take_taxi_now': '🚕',
      'wait_rain_stops': '⏳',
      'use_alternative': '🚅'
    };
    return iconMap[decision] || '🚕';
  };

  const getUrgencyColor = (urgency) => {
    const colorMap = {
      'high': '#FF6B6B',
      'medium': '#4ECDC4', 
      'low': '#45B7D1'
    };
    return colorMap[urgency] || '#45B7D1';
  };

  return (
    <div className="passenger-assistant">
      {/* Header */}
      <header className="assistant-header">
        <div className="header-content">
          <h1>👤 Passenger Assistant</h1>
          <p>Smart transportation decisions based on weather conditions</p>
        </div>
      </header>

      {/* Current Weather Summary */}
      {weatherForecast && (
        <div className="weather-summary-card">
          <div className="weather-summary-content">
            <div className="current-weather">
              <span className="weather-icon">
                {weatherForecast.forecast_timeline[0].is_raining ? '🌧️' : '🌤️'}
              </span>
              <div className="weather-details">
                <h3>Current Conditions</h3>
                <p>{weatherForecast.forecast_timeline[0].condition} • {weatherForecast.forecast_timeline[0].temperature}</p>
                {weatherForecast.forecast_timeline[0].is_raining && (
                  <p className="rain-info">Rain: {weatherForecast.forecast_timeline[0].precipitation}</p>
                )}
              </div>
            </div>
            <div className="transport-impact">
              <div className="impact-item">
                <span className="impact-label">Taxi Demand:</span>
                <span className={`impact-value ${weatherForecast.transportation_impact.taxi_demand_level.toLowerCase()}`}>
                  {weatherForecast.transportation_impact.taxi_demand_level}
                </span>
              </div>
              <div className="impact-item">
                <span className="impact-label">Walking:</span>
                <span className={`impact-value ${weatherForecast.transportation_impact.walking_conditions.toLowerCase()}`}>
                  {weatherForecast.transportation_impact.walking_conditions}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Planning Form */}
      <div className="trip-planning-card">
        <h2>🎯 Plan Your Trip</h2>
        
        <div className="location-inputs">
          <div className="input-group">
            <label htmlFor="origin">From</label>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location"
              className="location-input"
            />
            <div className="quick-select">
              {popularLocations.slice(0, 5).map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location, true)}
                  className="quick-select-btn"
                  type="button"
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="destination">To</label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="location-input"
            />
            <div className="quick-select">
              {popularLocations.slice(5, 10).map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location, false)}
                  className="quick-select-btn"
                  type="button"
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={fetchPassengerAdvice}
          disabled={loading || !origin.trim() || !destination.trim()}
          className="get-advice-btn"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              <span className="btn-icon">🤖</span>
              Get Smart Advice
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Advice Results */}
      {advice && (
        <div className="advice-results">
          {/* Main Recommendation */}
          <div 
            className="recommendation-card"
            style={{ '--urgency-color': getUrgencyColor(advice.recommendation.urgency) }}
          >
            <div className="recommendation-header">
              <div className="recommendation-icon">
                {advice.recommendation.icon}
              </div>
              <div className="recommendation-content">
                <h3>{advice.recommendation.action}</h3>
                <div className="recommendation-meta">
                  <span className={`urgency-badge ${advice.recommendation.urgency}`}>
                    {advice.recommendation.urgency.toUpperCase()}
                  </span>
                  <span className="confidence">
                    {advice.recommendation.confidence} confidence
                  </span>
                </div>
              </div>
            </div>
            
            <div className="recommendation-reasoning">
              <p>{advice.reasoning}</p>
            </div>

            {/* Wait Recommendation */}
            {advice.wait_recommendation && (
              <div className="wait-info">
                <div className="wait-details">
                  <span className="wait-icon">⏱️</span>
                  <div>
                    <strong>Wait {advice.wait_recommendation.wait_duration}</strong>
                    <p>{advice.wait_recommendation.reason}</p>
                    <p className="savings">Potential savings: {advice.wait_recommendation.alternative_savings}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost Comparison */}
          <div className="cost-comparison-card">
            <h3>💰 Cost Comparison</h3>
            <div className="cost-options">
              <div className="cost-option taxi">
                <span className="option-icon">🚕</span>
                <div className="option-details">
                  <span className="option-name">Taxi</span>
                  <span className="option-cost">{advice.cost_comparison.taxi}</span>
                </div>
              </div>
              <div className="cost-option train">
                <span className="option-icon">🚅</span>
                <div className="option-details">
                  <span className="option-name">Train</span>
                  <span className="option-cost">{advice.cost_comparison.train}</span>
                </div>
              </div>
              <div className="cost-option walking">
                <span className="option-icon">🚶</span>
                <div className="option-details">
                  <span className="option-name">Walking</span>
                  <span className="option-cost">{advice.cost_comparison.walking}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Timeline */}
          <div className="weather-timeline-card">
            <h3>🌦️ Weather Timeline</h3>
            <div className="timeline">
              <div className="timeline-item current">
                <div className="timeline-time">Now</div>
                <div className="timeline-condition">
                  {advice.weather_timeline.current.condition}
                  {advice.weather_timeline.current.rain && (
                    <span className="rain-indicator"> • Raining</span>
                  )}
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-time">+1 Hour</div>
                <div className="timeline-condition">
                  {advice.weather_timeline['1_hour'].rain_probability}% rain chance
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-time">+3 Hours</div>
                <div className="timeline-condition">
                  {advice.weather_timeline['3_hour'].rain_probability}% rain chance
                </div>
              </div>
            </div>
          </div>

          {/* Weather Alerts */}
          {advice.weather_alerts && advice.weather_alerts.length > 0 && (
            <div className="weather-alerts-card">
              <h3>⚠️ Weather Alerts</h3>
              {advice.weather_alerts.map((alert, index) => (
                <div key={index} className={`weather-alert ${alert.type}`}>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-impact">{alert.impact}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Research Footer */}
      <div className="research-footer">
        <div className="research-content">
          <div className="research-badge">
            <span className="university-icon">🎓</span>
            <div className="research-text">
              <strong>University of Tokyo Research</strong>
              <p>Intelligent decisions based on 0.847 weather-demand correlation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerAssistant;