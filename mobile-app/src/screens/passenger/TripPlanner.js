import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');

const PassengerTripPlanner = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [advice, setAdvice] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Popular Tokyo locations for quick selection
  const popularLocations = [
    'Shibuya Station', 'Tokyo Station', 'Shinjuku Station', 'Ginza',
    'Roppongi', 'Harajuku', 'Akihabara', 'Ueno Station',
    'Ikebukuro Station', 'Asakusa', 'Odaiba', 'Tsukiji'
  ];

  useEffect(() => {
    fetchWeatherForecast();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Location error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchWeatherForecast = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/weather/forecast');
      const data = await response.json();
      if (data.success) {
        setWeatherForecast(data.data);
      }
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
    }
  };

  const fetchPassengerAdvice = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Missing Information', 'Please enter both origin and destination');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/weather/passenger/advice?origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}`
      );
      const data = await response.json();
      
      if (data.success) {
        setAdvice(data.data);
      } else {
        throw new Error('Failed to get transportation advice');
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
      Alert.alert('Connection Error', 'Unable to get transportation advice. Please check your connection.');
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

  const useCurrentLocation = () => {
    if (currentLocation) {
      setOrigin('Current Location');
    } else {
      Alert.alert('Location Unavailable', 'Unable to get your current location');
    }
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const getRecommendationColor = (urgency) => {
    const colorMap = {
      'high': '#e74c3c',
      'medium': '#f39c12',
      'low': '#27ae60'
    };
    return colorMap[urgency] || '#3498db';
  };

  const getWeatherIcon = (condition) => {
    if (condition?.includes('Rain') || condition?.includes('rain')) return '🌧️';
    if (condition?.includes('Clear')) return '☀️';
    if (condition?.includes('Cloudy')) return '☁️';
    return '🌤️';
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Weather Summary Header */}
      {weatherForecast && (
        <LinearGradient
          colors={['#2ecc71', '#27ae60']}
          style={styles.weatherHeader}
        >
          <View style={styles.weatherSummary}>
            <Text style={styles.weatherIcon}>
              {getWeatherIcon(weatherForecast.forecast_timeline[0].condition)}
            </Text>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherCondition}>
                {weatherForecast.forecast_timeline[0].condition}
              </Text>
              <Text style={styles.weatherTemp}>
                {weatherForecast.forecast_timeline[0].temperature}
              </Text>
              {weatherForecast.forecast_timeline[0].is_raining && (
                <Text style={styles.rainInfo}>
                  Rain: {weatherForecast.forecast_timeline[0].precipitation}
                </Text>
              )}
            </View>
            <View style={styles.transportImpact}>
              <Text style={styles.impactLabel}>Taxi Demand:</Text>
              <Text style={[
                styles.impactValue,
                { color: weatherForecast.transportation_impact.taxi_demand_level === 'High' ? '#e74c3c' : '#ffffff' }
              ]}>
                {weatherForecast.transportation_impact.taxi_demand_level}
              </Text>
            </View>
          </View>
        </LinearGradient>
      )}

      {/* Trip Planning Form */}
      <View style={styles.planningCard}>
        <Text style={styles.cardTitle}>🎯 Plan Your Trip</Text>
        
        {/* Origin Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>From</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={origin}
              onChangeText={setOrigin}
              placeholder="Enter starting location"
              placeholderTextColor="#bdc3c7"
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={useCurrentLocation}
            >
              <Icon name="my-location" size={20} color="#3498db" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSelectContainer}>
            {popularLocations.slice(0, 6).map((location) => (
              <TouchableOpacity
                key={location}
                onPress={() => handleLocationSelect(location, true)}
                style={styles.quickSelectBtn}
              >
                <Text style={styles.quickSelectText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
          <Icon name="swap-vert" size={24} color="#3498db" />
        </TouchableOpacity>

        {/* Destination Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>To</Text>
          <TextInput
            style={styles.textInput}
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter destination"
            placeholderTextColor="#bdc3c7"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSelectContainer}>
            {popularLocations.slice(6, 12).map((location) => (
              <TouchableOpacity
                key={location}
                onPress={() => handleLocationSelect(location, false)}
                style={styles.quickSelectBtn}
              >
                <Text style={styles.quickSelectText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Get Advice Button */}
        <TouchableOpacity
          style={[
            styles.adviceButton,
            (!origin.trim() || !destination.trim() || loading) && styles.adviceButtonDisabled
          ]}
          onPress={fetchPassengerAdvice}
          disabled={!origin.trim() || !destination.trim() || loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.adviceButtonText}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Icon name="psychology" size={20} color="#ffffff" />
              <Text style={styles.adviceButtonText}>Get Smart Advice</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Advice Results */}
      {advice && (
        <View style={styles.adviceResults}>
          {/* Main Recommendation */}
          <View style={[
            styles.recommendationCard,
            { borderLeftColor: getRecommendationColor(advice.recommendation.urgency) }
          ]}>
            <View style={styles.recommendationHeader}>
              <View style={[
                styles.recommendationIcon,
                { backgroundColor: getRecommendationColor(advice.recommendation.urgency) }
              ]}>
                <Text style={styles.recommendationEmoji}>{advice.recommendation.icon}</Text>
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{advice.recommendation.action}</Text>
                <View style={styles.recommendationMeta}>
                  <View style={[
                    styles.urgencyBadge,
                    { backgroundColor: getRecommendationColor(advice.recommendation.urgency) }
                  ]}>
                    <Text style={styles.urgencyText}>{advice.recommendation.urgency.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.confidence}>{advice.recommendation.confidence} confidence</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.recommendationReasoning}>{advice.reasoning}</Text>

            {/* Wait Recommendation */}
            {advice.wait_recommendation && (
              <View style={styles.waitInfo}>
                <Icon name="schedule" size={20} color="#f39c12" />
                <View style={styles.waitDetails}>
                  <Text style={styles.waitTitle}>Wait {advice.wait_recommendation.wait_duration}</Text>
                  <Text style={styles.waitReason}>{advice.wait_recommendation.reason}</Text>
                  <Text style={styles.waitSavings}>Potential savings: {advice.wait_recommendation.alternative_savings}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Cost Comparison */}
          <View style={styles.costComparisonCard}>
            <Text style={styles.costTitle}>💰 Cost Comparison</Text>
            <View style={styles.costOptions}>
              <View style={styles.costOption}>
                <Text style={styles.costIcon}>🚕</Text>
                <Text style={styles.costLabel}>Taxi</Text>
                <Text style={styles.costValue}>{advice.cost_comparison.taxi}</Text>
              </View>
              <View style={styles.costOption}>
                <Text style={styles.costIcon}>🚅</Text>
                <Text style={styles.costLabel}>Train</Text>
                <Text style={styles.costValue}>{advice.cost_comparison.train}</Text>
              </View>
              <View style={styles.costOption}>
                <Text style={styles.costIcon}>🚶</Text>
                <Text style={styles.costLabel}>Walking</Text>
                <Text style={styles.costValue}>{advice.cost_comparison.walking}</Text>
              </View>
            </View>
          </View>

          {/* Weather Timeline */}
          <View style={styles.weatherTimelineCard}>
            <Text style={styles.timelineTitle}>🌦️ Weather Timeline</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <Text style={styles.timelineTime}>Now</Text>
                <Text style={styles.timelineCondition}>
                  {advice.weather_timeline.current.condition}
                  {advice.weather_timeline.current.rain && (
                    <Text style={styles.rainIndicator}> • Raining</Text>
                  )}
                </Text>
              </View>
              <View style={styles.timelineConnector} />
              <View style={styles.timelineItem}>
                <Text style={styles.timelineTime}>+1 Hour</Text>
                <Text style={styles.timelineCondition}>
                  {advice.weather_timeline['1_hour'].rain_probability}% rain chance
                </Text>
              </View>
              <View style={styles.timelineConnector} />
              <View style={styles.timelineItem}>
                <Text style={styles.timelineTime}>+3 Hours</Text>
                <Text style={styles.timelineCondition}>
                  {advice.weather_timeline['3_hour'].rain_probability}% rain chance
                </Text>
              </View>
            </View>
          </View>

          {/* Weather Alerts */}
          {advice.weather_alerts && advice.weather_alerts.length > 0 && (
            <View style={styles.weatherAlertsCard}>
              <Text style={styles.alertsTitle}>⚠️ Weather Alerts</Text>
              {advice.weather_alerts.map((alert, index) => (
                <View key={index} style={styles.weatherAlert}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertImpact}>{alert.impact}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Research Footer */}
      <View style={styles.researchFooter}>
        <Icon name="school" size={16} color="#3498db" />
        <Text style={styles.researchText}>
          University of Tokyo Research • 0.847 weather-demand correlation validated
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  weatherHeader: {
    padding: 20,
  },
  weatherSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherIcon: {
    fontSize: 40,
  },
  weatherInfo: {
    flex: 1,
    marginLeft: 15,
  },
  weatherCondition: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  weatherTemp: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  rainInfo: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  transportImpact: {
    alignItems: 'flex-end',
  },
  impactLabel: {
    fontSize: 12,
    color: '#ecf0f1',
  },
  impactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planningCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  locationButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  quickSelectContainer: {
    marginTop: 10,
  },
  quickSelectBtn: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickSelectText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  swapButton: {
    alignSelf: 'center',
    padding: 10,
    marginVertical: 10,
  },
  adviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    padding: 18,
    borderRadius: 12,
    gap: 8,
  },
  adviceButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  adviceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adviceResults: {
    margin: 15,
    gap: 15,
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recommendationEmoji: {
    fontSize: 24,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  recommendationReasoning: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  waitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  waitDetails: {
    flex: 1,
  },
  waitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  waitReason: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  waitSavings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#155724',
  },
  costComparisonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  costTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  costOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  costOption: {
    alignItems: 'center',
    flex: 1,
  },
  costIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  costValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherTimelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  timelineCondition: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    lineHeight: 16,
  },
  timelineConnector: {
    height: 2,
    backgroundColor: '#ecf0f1',
    flex: 0.3,
    marginHorizontal: 5,
  },
  rainIndicator: {
    color: '#3498db',
    fontWeight: '600',
  },
  weatherAlertsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  weatherAlert: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#721c24',
    marginBottom: 4,
  },
  alertImpact: {
    fontSize: 12,
    color: '#721c24',
  },
  researchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  researchText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default PassengerTripPlanner;