import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import MapView, { Marker, Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const TaxiDriverApp = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState({
    condition: 'Rain',
    intensity: 'Heavy',
    temperature: 18,
    humidity: 85,
    duration: '2 hours'
  });
  
  const [demandHotspots, setDemandHotspots] = useState([
    { id: 1, lat: 35.6762, lng: 139.6503, intensity: 0.9, area: 'Shibuya Station', demandIncrease: '+45%' },
    { id: 2, lat: 35.6812, lng: 139.7671, intensity: 0.8, area: 'Tokyo Station', demandIncrease: '+38%' },
    { id: 3, lat: 35.6586, lng: 139.7454, intensity: 0.7, area: 'Ginza', demandIncrease: '+52%' },
    { id: 4, lat: 35.6938, lng: 139.7036, area: 'Shinjuku', intensity: 0.85, demandIncrease: '+41%' }
  ]);

  const [earnings, setEarnings] = useState({
    currentHour: 3420,
    todayTotal: 18650,
    weatherBonus: 5420,
    projectedDaily: 25200
  });

  const [aiRecommendations, setAiRecommendations] = useState([
    {
      priority: 'High',
      action: 'Move to Shibuya Station area',
      reason: 'Heavy rain increasing demand by 45%',
      eta: '8 minutes',
      potentialEarnings: '¥4,200 next hour',
      confidence: 94
    },
    {
      priority: 'Medium',
      action: 'Position near Tokyo Station',
      reason: 'Business district with limited taxi availability',
      eta: '12 minutes',
      potentialEarnings: '¥3,800 next hour',
      confidence: 87
    }
  ]);

  useEffect(() => {
    getCurrentLocation();
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required for weather-based recommendations');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const updateRealTimeData = () => {
    // Simulate real-time earnings update
    setEarnings(prev => ({
      ...prev,
      currentHour: prev.currentHour + Math.floor(Math.random() * 200),
      weatherBonus: prev.weatherBonus + Math.floor(Math.random() * 100)
    }));

    // Update hotspot intensities
    setDemandHotspots(prev => 
      prev.map(hotspot => ({
        ...hotspot,
        intensity: Math.max(0.3, hotspot.intensity + (Math.random() - 0.5) * 0.1)
      }))
    );
  };

  const handleHotspotPress = (hotspot) => {
    Alert.alert(
      `Navigate to ${hotspot.area}?`,
      `Expected demand increase: ${hotspot.demandIncrease}\nEstimated additional earnings: ¥3,000-5,000`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => navigateToHotspot(hotspot) }
      ]
    );
  };

  const navigateToHotspot = (hotspot) => {
    // Integration with navigation apps would go here
    Alert.alert('Navigation', `Starting navigation to ${hotspot.area}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with weather and earnings */}
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🌧️ Weather-Taxi AI</Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherText}>{weatherData.condition} - {weatherData.intensity}</Text>
            <Text style={styles.weatherDetail}>Duration: {weatherData.duration} | {weatherData.temperature}°C</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Real-time earnings */}
      <View style={styles.earningsContainer}>
        <Text style={styles.sectionTitle}>💰 Real-time Earnings</Text>
        <View style={styles.earningsGrid}>
          <View style={styles.earningCard}>
            <Text style={styles.earningValue}>¥{earnings.currentHour.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>This Hour</Text>
          </View>
          <View style={styles.earningCard}>
            <Text style={styles.earningValue}>¥{earnings.todayTotal.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>Today Total</Text>
          </View>
          <View style={styles.earningCard}>
            <Text style={styles.earningValueBonus}>+¥{earnings.weatherBonus.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>Weather Bonus</Text>
          </View>
          <View style={styles.earningCard}>
            <Text style={styles.earningValue}>¥{earnings.projectedDaily.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>Projected Daily</Text>
          </View>
        </View>
      </View>

      {/* AI Recommendations */}
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>🤖 AI Recommendations</Text>
        {aiRecommendations.map((rec, index) => (
          <TouchableOpacity key={index} style={styles.recommendationCard}>
            <View style={styles.recHeader}>
              <Text style={[styles.priority, { color: rec.priority === 'High' ? '#ff4444' : '#ffaa00' }]}>
                {rec.priority} Priority
              </Text>
              <Text style={styles.confidence}>{rec.confidence}% Confidence</Text>
            </View>
            <Text style={styles.recAction}>{rec.action}</Text>
            <Text style={styles.recReason}>{rec.reason}</Text>
            <View style={styles.recDetails}>
              <Text style={styles.recDetail}>ETA: {rec.eta}</Text>
              <Text style={styles.recEarnings}>{rec.potentialEarnings}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map with hotspots */}
      <View style={styles.mapContainer}>
        <Text style={styles.sectionTitle}>🗺️ Weather Demand Hotspots</Text>
        {currentLocation && (
          <MapView
            style={styles.map}
            initialRegion={currentLocation}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Current location marker */}
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />
            
            {/* Demand hotspot markers */}
            {demandHotspots.map((hotspot) => (
              <Marker
                key={hotspot.id}
                coordinate={{
                  latitude: hotspot.lat,
                  longitude: hotspot.lng,
                }}
                title={hotspot.area}
                description={`Demand increase: ${hotspot.demandIncrease}`}
                pinColor={hotspot.intensity > 0.8 ? 'red' : hotspot.intensity > 0.6 ? 'orange' : 'yellow'}
                onPress={() => handleHotspotPress(hotspot)}
              />
            ))}
          </MapView>
        )}
      </View>

      {/* Hotspots list */}
      <View style={styles.hotspotsContainer}>
        <Text style={styles.sectionTitle}>🔥 Top Demand Areas</Text>
        {demandHotspots.map((hotspot) => (
          <TouchableOpacity 
            key={hotspot.id} 
            style={styles.hotspotCard}
            onPress={() => handleHotspotPress(hotspot)}
          >
            <View style={styles.hotspotInfo}>
              <Text style={styles.hotspotArea}>{hotspot.area}</Text>
              <Text style={styles.hotspotDemand}>{hotspot.demandIncrease} demand increase</Text>
            </View>
            <View style={styles.hotspotIntensity}>
              <View style={[styles.intensityBar, { width: `${hotspot.intensity * 100}%` }]} />
              <Text style={styles.intensityText}>{(hotspot.intensity * 100).toFixed(0)}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weather insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>📊 Weather Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Rain Impact Analysis</Text>
          <Text style={styles.insightText}>
            Heavy rain conditions are increasing taxi demand by an average of 42% across Tokyo. 
            Peak demand areas include business districts and shopping centers where people seek immediate shelter.
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Optimal Strategy</Text>
          <Text style={styles.insightText}>
            Position yourself near major stations and shopping areas during the next 2 hours. 
            Expected earnings increase: ¥5,000-8,000 above normal hourly rate.
          </Text>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Feature', 'Emergency mode activated')}>
          <Text style={styles.actionButtonText}>🚨 Emergency Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Feature', 'Break mode activated')}>
          <Text style={styles.actionButtonText}>☕ Take Break</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Feature', 'Offline mode activated')}>
          <Text style={styles.actionButtonText}>📴 Go Offline</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  weatherInfo: {
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  weatherDetail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  earningsContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  earningValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  earningValueBonus: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  earningLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  recommendationsContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priority: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  confidence: {
    fontSize: 12,
    color: '#666',
  },
  recAction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  recDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recDetail: {
    fontSize: 12,
    color: '#666',
  },
  recEarnings: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  mapContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  hotspotsContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotspotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  hotspotInfo: {
    flex: 1,
  },
  hotspotArea: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hotspotDemand: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  hotspotIntensity: {
    alignItems: 'center',
    width: 60,
  },
  intensityBar: {
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    marginBottom: 5,
  },
  intensityText: {
    fontSize: 10,
    color: '#666',
  },
  insightsContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TaxiDriverApp;