import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Polyline, Heatmap, Circle } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useLocalization } from '../localization/LocalizationContext';

const { width, height } = Dimensions.get('window');

// Google Maps integration service for taxi optimization
class GoogleMapsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  // Get real-time traffic data for optimal taxi positioning
  async getDirectionsWithTraffic(origin, destination, optimizeWaypoints = true) {
    try {
      const url = `${this.baseUrl}/directions/json?` +
        `origin=${origin.latitude},${origin.longitude}&` +
        `destination=${destination.latitude},${destination.longitude}&` +
        `departure_time=now&` +
        `traffic_model=best_guess&` +
        `optimize=${optimizeWaypoints}&` +
        `key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return this.parseDirectionsResponse(data);
      } else {
        throw new Error(`Directions API error: ${data.status}`);
      }
    } catch (error) {
      console.error('Directions API error:', error);
      return null;
    }
  }

  // Find nearby high-demand places using Google Places API
  async getNearbyDemandHotspots(location, radius = 2000) {
    try {
      const types = ['transit_station', 'airport', 'hospital', 'shopping_mall', 'hotel', 'restaurant'];
      const placesUrl = `${this.baseUrl}/place/nearbysearch/json?` +
        `location=${location.latitude},${location.longitude}&` +
        `radius=${radius}&` +
        `type=${types.join('|')}&` +
        `key=${this.apiKey}`;

      const response = await fetch(placesUrl);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          location: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng
          },
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          types: place.types,
          demandScore: this.calculateDemandScore(place),
          weatherSensitivity: this.getWeatherSensitivity(place.types)
        }));
      } else {
        throw new Error(`Places API error: ${data.status}`);
      }
    } catch (error) {
      console.error('Places API error:', error);
      return [];
    }
  }

  // Calculate taxi demand score based on place characteristics
  calculateDemandScore(place) {
    const baseScore = (place.rating || 3) * Math.log(place.user_ratings_total || 1);
    const typeMultipliers = {
      'transit_station': 3.0,
      'airport': 3.5,
      'hospital': 2.5,
      'shopping_mall': 2.0,
      'hotel': 2.5,
      'restaurant': 1.5,
      'night_club': 2.0,
      'university': 1.8
    };
    
    const maxMultiplier = Math.max(...place.types.map(type => typeMultipliers[type] || 1.0));
    return Math.min(10, baseScore * maxMultiplier / 10);
  }

  getWeatherSensitivity(types) {
    const sensitivities = {
      'transit_station': 0.9, // High demand increase in bad weather
      'shopping_mall': 0.7,
      'airport': 0.5,
      'hospital': 0.3, // Weather independent
      'hotel': 0.6
    };
    
    return Math.max(...types.map(type => sensitivities[type] || 0.5));
  }

  parseDirectionsResponse(data) {
    const route = data.routes[0];
    const leg = route.legs[0];
    
    return {
      distance: leg.distance,
      duration: leg.duration,
      durationInTraffic: leg.duration_in_traffic,
      trafficFactor: leg.duration_in_traffic ? 
        leg.duration_in_traffic.value / leg.duration.value : 1.0,
      polyline: route.overview_polyline.points,
      steps: leg.steps,
      bounds: route.bounds
    };
  }

  // Get real-time traffic conditions for area analysis
  async getAreaTrafficAnalysis(centerLocation, radiusKm = 5) {
    const points = this.generateAnalysisPoints(centerLocation, radiusKm);
    const trafficPromises = points.map(point => 
      this.getDirectionsWithTraffic(centerLocation, point)
    );
    
    try {
      const results = await Promise.all(trafficPromises);
      return this.analyzeAreaTraffic(results);
    } catch (error) {
      console.error('Area traffic analysis error:', error);
      return null;
    }
  }

  generateAnalysisPoints(center, radiusKm) {
    const points = [];
    const earthRadius = 6371; // km
    const radians = radiusKm / earthRadius;
    
    // Generate 8 points around the center for traffic analysis
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * Math.PI / 180;
      const lat = center.latitude + (radians * Math.cos(angle) * 180 / Math.PI);
      const lng = center.longitude + (radians * Math.sin(angle) * 180 / Math.PI / Math.cos(center.latitude * Math.PI / 180));
      
      points.push({ latitude: lat, longitude: lng });
    }
    
    return points;
  }

  analyzeAreaTraffic(trafficResults) {
    const validResults = trafficResults.filter(result => result !== null);
    if (validResults.length === 0) return null;
    
    const avgTrafficFactor = validResults.reduce((sum, result) => 
      sum + result.trafficFactor, 0) / validResults.length;
    
    return {
      averageTrafficFactor: avgTrafficFactor,
      trafficLevel: this.getTrafficLevel(avgTrafficFactor),
      bestDirections: validResults.filter(result => result.trafficFactor < avgTrafficFactor),
      worstDirections: validResults.filter(result => result.trafficFactor > avgTrafficFactor)
    };
  }

  getTrafficLevel(trafficFactor) {
    if (trafficFactor >= 2.0) return 'heavy';
    if (trafficFactor >= 1.5) return 'moderate';
    if (trafficFactor >= 1.2) return 'light';
    return 'free_flow';
  }
}

// Enhanced Google Maps component for taxi optimization
const GoogleMapsOptimizedView = ({ weatherConditions, userLocation }) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 35.6762, // Shibuya
    longitude: 139.6503,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [demandHotspots, setDemandHotspots] = useState([]);
  const [optimalRoutes, setOptimalRoutes] = useState([]);
  const [trafficAnalysis, setTrafficAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [showHeatmap, setShowHeatmap] = useState(true);
  
  const mapRef = useRef(null);
  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();
  
  // Initialize Google Maps service (replace with your actual API key)
  const googleMapsService = new GoogleMapsService('YOUR_GOOGLE_MAPS_API_KEY');

  useEffect(() => {
    if (userLocation) {
      setMapRegion({
        ...mapRegion,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
      loadOptimizationData(userLocation);
    }
  }, [userLocation]);

  const loadOptimizationData = async (location) => {
    setIsLoading(true);
    try {
      // Load nearby demand hotspots
      const hotspots = await googleMapsService.getNearbyDemandHotspots(location);
      setDemandHotspots(hotspots);
      
      // Analyze area traffic conditions
      const traffic = await googleMapsService.getAreaTrafficAnalysis(location);
      setTrafficAnalysis(traffic);
      
      // Generate optimal routes to high-demand areas
      if (hotspots.length > 0) {
        const routes = await generateOptimalRoutes(location, hotspots.slice(0, 3));
        setOptimalRoutes(routes);
      }
    } catch (error) {
      console.error('Optimization data loading error:', error);
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese 
          ? 'マップデータの読み込みに失敗しました'
          : 'Failed to load map optimization data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateOptimalRoutes = async (origin, destinations) => {
    const routePromises = destinations.map(async (dest, index) => {
      const route = await googleMapsService.getDirectionsWithTraffic(origin, dest.location);
      if (route) {
        return {
          id: `route_${index}`,
          destination: dest,
          polyline: route.polyline,
          duration: route.duration,
          durationInTraffic: route.durationInTraffic,
          trafficFactor: route.trafficFactor,
          color: getRouteColor(route.trafficFactor),
          earnings_potential: calculateEarningsPotential(dest, route)
        };
      }
      return null;
    });

    const routes = await Promise.all(routePromises);
    return routes.filter(route => route !== null);
  };

  const getRouteColor = (trafficFactor) => {
    if (trafficFactor >= 1.8) return '#FF5722'; // Heavy traffic - red
    if (trafficFactor >= 1.4) return '#FF9800'; // Moderate traffic - orange
    if (trafficFactor >= 1.2) return '#FFC107'; // Light traffic - yellow
    return '#4CAF50'; // Free flow - green
  };

  const calculateEarningsPotential = (destination, route) => {
    const baseFare = 2000; // Base Tokyo taxi fare
    const distanceBonus = route.distance ? route.distance.value * 0.1 : 0;
    const demandBonus = destination.demandScore * 500;
    const weatherBonus = getWeatherBonus(destination.weatherSensitivity, weatherConditions);
    
    return Math.round(baseFare + distanceBonus + demandBonus + weatherBonus);
  };

  const getWeatherBonus = (sensitivity, weather) => {
    if (!weather || weather.condition === 'clear') return 0;
    
    const weatherMultipliers = {
      'rain': 1.4,
      'heavy_rain': 1.8,
      'snow': 1.6,
      'typhoon': 2.0
    };
    
    const multiplier = weatherMultipliers[weather.condition] || 1.0;
    return sensitivity * (multiplier - 1) * 1000;
  };

  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    // Add custom marker or analyze location
    console.log('Map pressed at:', coordinate);
  };

  const handleMarkerPress = (hotspot) => {
    Alert.alert(
      hotspot.name,
      localeInfo.isJapanese 
        ? `需要スコア: ${hotspot.demandScore.toFixed(1)}/10\n評価: ${hotspot.rating}/5 (${hotspot.userRatingsTotal}件)`
        : `Demand Score: ${hotspot.demandScore.toFixed(1)}/10\nRating: ${hotspot.rating}/5 (${hotspot.userRatingsTotal} reviews)`,
      [
        { text: localeInfo.isJapanese ? 'キャンセル' : 'Cancel', style: 'cancel' },
        { 
          text: localeInfo.isJapanese ? 'ナビゲート' : 'Navigate', 
          onPress: () => navigateToLocation(hotspot.location) 
        }
      ]
    );
  };

  const navigateToLocation = async (destination) => {
    if (!userLocation) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? '現在位置が取得できません' : 'Current location not available'
      );
      return;
    }

    try {
      const route = await googleMapsService.getDirectionsWithTraffic(userLocation, destination);
      if (route) {
        const durationText = route.durationInTraffic ? 
          `${Math.round(route.durationInTraffic.value / 60)} ${localeInfo.isJapanese ? '分' : 'min'}` :
          `${Math.round(route.duration.value / 60)} ${localeInfo.isJapanese ? '分' : 'min'}`;
        
        Alert.alert(
          localeInfo.isJapanese ? 'ルート情報' : 'Route Information',
          localeInfo.isJapanese 
            ? `推定時間: ${durationText}\n距離: ${(route.distance.value / 1000).toFixed(1)}km\n交通状況: ${getTrafficDescription(route.trafficFactor)}`
            : `Estimated time: ${durationText}\nDistance: ${(route.distance.value / 1000).toFixed(1)}km\nTraffic: ${getTrafficDescription(route.trafficFactor)}`
        );
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const getTrafficDescription = (trafficFactor) => {
    if (localeInfo.isJapanese) {
      if (trafficFactor >= 1.8) return '渋滞';
      if (trafficFactor >= 1.4) return '混雑';
      if (trafficFactor >= 1.2) return '軽微な渋滞';
      return 'スムーズ';
    } else {
      if (trafficFactor >= 1.8) return 'Heavy';
      if (trafficFactor >= 1.4) return 'Moderate';
      if (trafficFactor >= 1.2) return 'Light';
      return 'Clear';
    }
  };

  const toggleMapType = () => {
    const types = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  const getDemandHeatmapData = () => {
    return demandHotspots.map(hotspot => ({
      latitude: hotspot.location.latitude,
      longitude: hotspot.location.longitude,
      weight: hotspot.demandScore / 10 // Normalize to 0-1
    }));
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        onPress={handleMapPress}
        mapType={mapType}
        showsTraffic={true}
        showsBuildings={true}
        showsIndoors={true}
        loadingEnabled={true}
        onRegionChangeComplete={setMapRegion}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title={localeInfo.isJapanese ? '現在位置' : 'Current Location'}
            pinColor="blue"
          >
            <View style={styles.userMarker}>
              <Ionicons name="locate" size={20} color="white" />
            </View>
          </Marker>
        )}

        {/* Demand hotspot markers */}
        {demandHotspots.map((hotspot) => (
          <Marker
            key={hotspot.id}
            coordinate={hotspot.location}
            onPress={() => handleMarkerPress(hotspot)}
          >
            <View style={[styles.demandMarker, { 
              backgroundColor: getDemandColor(hotspot.demandScore),
              transform: [{ scale: 0.8 + (hotspot.demandScore / 10) * 0.4 }]
            }]}>
              <Text style={styles.demandText}>{hotspot.demandScore.toFixed(1)}</Text>
            </View>
          </Marker>
        ))}

        {/* Optimal route polylines */}
        {optimalRoutes.map((route) => (
          <Polyline
            key={route.id}
            coordinates={decodePolyline(route.polyline)}
            strokeColor={route.color}
            strokeWidth={4}
            lineDashPattern={route.trafficFactor > 1.5 ? [5, 5] : null}
          />
        ))}

        {/* Demand heatmap */}
        {showHeatmap && demandHotspots.length > 0 && (
          <Heatmap
            points={getDemandHeatmapData()}
            radius={50}
            opacity={0.6}
            gradient={{
              colors: ['#00FF00', '#FFFF00', '#FF8800', '#FF0000'],
              startPoints: [0.1, 0.4, 0.7, 1.0],
              colorMapSize: 256
            }}
          />
        )}
      </MapView>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
          <Ionicons name="layers" size={20} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Ionicons name="analytics" size={20} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => userLocation && loadOptimizationData(userLocation)}
        >
          <Ionicons name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Traffic Analysis Panel */}
      {trafficAnalysis && (
        <View style={styles.trafficPanel}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.trafficGradient}>
            <Text style={styles.trafficTitle}>
              🚦 {localeInfo.isJapanese ? '交通分析' : 'Traffic Analysis'}
            </Text>
            <Text style={styles.trafficText}>
              {localeInfo.isJapanese ? '状況' : 'Condition'}: {getTrafficDescription(trafficAnalysis.averageTrafficFactor)}
            </Text>
            <Text style={styles.trafficText}>
              {localeInfo.isJapanese ? '遅延係数' : 'Delay Factor'}: {trafficAnalysis.averageTrafficFactor.toFixed(1)}x
            </Text>
          </LinearGradient>
        </View>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>
            {localeInfo.isJapanese ? '最適化データ読み込み中...' : 'Loading optimization data...'}
          </Text>
        </View>
      )}
    </View>
  );
};

// Utility function to decode Google Maps polyline
const decodePolyline = (encoded) => {
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coordinates.push({
      latitude: lat * 1e-5,
      longitude: lng * 1e-5
    });
  }

  return coordinates;
};

const getDemandColor = (demandScore) => {
  if (demandScore >= 8) return '#FF4444';      // High demand - Red
  if (demandScore >= 6) return '#FF8800';      // Medium-high - Orange  
  if (demandScore >= 4) return '#FFCC00';      // Medium - Yellow
  return '#44FF44';                            // Low demand - Green
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  userMarker: {
    backgroundColor: '#1976D2',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  demandMarker: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  demandText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  controlPanel: {
    position: 'absolute',
    top: 50,
    right: 15,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  trafficPanel: {
    position: 'absolute',
    bottom: 100,
    left: 15,
    right: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  trafficGradient: {
    padding: 15,
  },
  trafficTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trafficText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
  },
});

export default GoogleMapsOptimizedView;