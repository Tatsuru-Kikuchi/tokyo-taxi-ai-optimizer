import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Linking,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const DriverHotspotMap = () => {
  const [hotspots, setHotspots] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
    fetchHotspotData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchHotspotData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Location error:', error);
        // Default to Tokyo Station if location fails
        setUserLocation({ latitude: 35.6812, longitude: 139.7671 });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchHotspotData = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      // Fetch hotspot recommendations from backend
      const response = await fetch('http://localhost:8000/api/v1/weather/driver/hotspots');
      const data = await response.json();
      
      if (data.success) {
        setHotspots(data.data.recommendations);
        setWeatherData(data.data.weather_context);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        throw new Error('Failed to fetch hotspot data');
      }
    } catch (error) {
      console.error('Error fetching hotspots:', error);
      Alert.alert('Connection Error', 'Unable to fetch latest hotspots. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getCurrentLocation();
    fetchHotspotData();
  };

  const navigateToHotspot = (coordinates) => {
    const { latitude, longitude } = coordinates;
    const url = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps application');
      }
    });
  };

  const focusOnHotspot = (hotspot) => {
    setSelectedHotspot(hotspot);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: hotspot.coordinates.latitude,
        longitude: hotspot.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const getHotspotColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      default: return '#3498db';
    }
  };

  const getWeatherIcon = (condition) => {
    if (condition?.includes('Rain')) return '🌧️';
    if (condition?.includes('Clear')) return '☀️';
    if (condition?.includes('Cloudy')) return '☁️';
    return '🌤️';
  };

  if (loading && !hotspots.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>📍 Loading Hotspots...</Text>
        <Text style={styles.loadingSubtext}>Finding weather opportunities</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Weather Alert Bar */}
      {weatherData && weatherData.is_raining && (
        <LinearGradient
          colors={['#f39c12', '#e67e22']}
          style={styles.weatherAlert}
        >
          <Icon name="flash-on" size={20} color="#ffffff" />
          <Text style={styles.weatherAlertText}>
            Rain Opportunity Active! Demand increased {Math.round((weatherData.demand_multiplier - 1) * 100)}%
          </Text>
        </LinearGradient>
      )}

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 35.6812,
          longitude: userLocation?.longitude || 139.7671,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Hotspot Markers */}
        {hotspots.map((hotspot, index) => (
          <React.Fragment key={index}>
            <Marker
              coordinate={{
                latitude: hotspot.coordinates.latitude,
                longitude: hotspot.coordinates.longitude,
              }}
              onPress={() => setSelectedHotspot(hotspot)}
            >
              <View style={[
                styles.markerContainer,
                { backgroundColor: getHotspotColor(hotspot.priority) }
              ]}>
                <Icon name="local-taxi" size={20} color="#ffffff" />
                <Text style={styles.markerText}>{hotspot.opportunity.demand_increase}</Text>
              </View>
            </Marker>
            
            {/* Demand Circle */}
            <Circle
              center={{
                latitude: hotspot.coordinates.latitude,
                longitude: hotspot.coordinates.longitude,
              }}
              radius={1000}
              strokeColor={getHotspotColor(hotspot.priority)}
              fillColor={`${getHotspotColor(hotspot.priority)}20`}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Current Weather Info */}
      {weatherData && (
        <View style={styles.weatherInfo}>
          <View style={styles.weatherRow}>
            <Text style={styles.weatherIcon}>
              {getWeatherIcon(weatherData.current_condition)}
            </Text>
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherCondition}>{weatherData.current_condition}</Text>
              <Text style={styles.weatherTemp}>{weatherData.temperature}</Text>
            </View>
            <Text style={styles.lastUpdateText}>Updated: {lastUpdate}</Text>
          </View>
        </View>
      )}

      {/* Hotspot List */}
      <ScrollView
        style={styles.hotspotList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {hotspots.length === 0 ? (
          <View style={styles.noHotspots}>
            <Icon name="info" size={40} color="#7f8c8d" />
            <Text style={styles.noHotspotsText}>No high-opportunity zones detected</Text>
            <Text style={styles.noHotspotsSubtext}>Continue normal operations</Text>
          </View>
        ) : (
          hotspots.map((hotspot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.hotspotCard,
                selectedHotspot === hotspot && styles.selectedHotspotCard
              ]}
              onPress={() => focusOnHotspot(hotspot)}
            >
              <View style={styles.hotspotHeader}>
                <View style={styles.hotspotLocation}>
                  <Text style={styles.hotspotName}>{hotspot.location}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getHotspotColor(hotspot.priority) }
                  ]}>
                    <Text style={styles.priorityText}>{hotspot.priority.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.hotspotMetrics}>
                  <Text style={styles.demandIncrease}>{hotspot.opportunity.demand_increase}</Text>
                  <Text style={styles.revenueBoost}>{hotspot.opportunity.revenue_boost}</Text>
                </View>
              </View>

              <Text style={styles.hotspotReasoning}>{hotspot.reasoning}</Text>
              
              <View style={styles.hotspotFooter}>
                <View style={styles.hotspotStats}>
                  <Text style={styles.travelTime}>🕐 {hotspot.logistics.travel_time}</Text>
                  <Text style={styles.confidence}>🎯 {hotspot.opportunity.confidence}</Text>
                </View>
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => navigateToHotspot(hotspot.coordinates)}
                >
                  <Icon name="navigation" size={16} color="#ffffff" />
                  <Text style={styles.navigateText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Research Footer */}
        <View style={styles.researchFooter}>
          <Icon name="school" size={16} color="#3498db" />
          <Text style={styles.researchText}>
            University of Tokyo Research • 30.2% productivity improvement validated
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  weatherAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  weatherAlertText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  map: {
    height: height * 0.4,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 60,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  markerText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  weatherInfo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherIcon: {
    fontSize: 24,
  },
  weatherDetails: {
    flex: 1,
    marginLeft: 12,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  weatherTemp: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  hotspotList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  noHotspots: {
    alignItems: 'center',
    padding: 40,
  },
  noHotspotsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 5,
  },
  noHotspotsSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  hotspotCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedHotspotCard: {
    borderColor: '#3498db',
    borderWidth: 2,
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  hotspotLocation: {
    flex: 1,
  },
  hotspotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hotspotMetrics: {
    alignItems: 'flex-end',
  },
  demandIncrease: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  revenueBoost: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  hotspotReasoning: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
    marginBottom: 12,
  },
  hotspotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotspotStats: {
    flexDirection: 'row',
    gap: 15,
  },
  travelTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  confidence: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navigateText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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

export default DriverHotspotMap;