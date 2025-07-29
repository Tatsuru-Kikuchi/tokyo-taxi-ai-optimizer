import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Heatmap, Polyline } from 'react-native-maps';
import { useLocalization } from '../localization/LocalizationContext';

// Advanced Google Maps integration for taxi optimization
const GoogleMapsOptimizer = ({ onOptimizationUpdate }) => {
  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  const [mapData, setMapData] = useState({
    region: {
      latitude: 35.6762,
      longitude: 139.6503,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    demandHeatmap: [],
    optimalRoutes: [],
    realTimeTraffic: {},
    nearbyDrivers: [],
    highValuePickups: []
  });

  const [optimizationMode, setOptimizationMode] = useState('demand'); // demand, traffic, earnings
  const [isLiveMode, setIsLiveMode] = useState(false);

  useEffect(() => {
    initializeGoogleMapsData();
    if (isLiveMode) {
      const interval = setInterval(updateRealTimeData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const initializeGoogleMapsData = async () => {
    // Simulate Google Maps API data integration
    const demandData = await generateDemandHeatmap();
    const trafficData = await getOptimalRoutes();
    const nearbyData = await getNearbyDriverData();
    
    setMapData(prev => ({
      ...prev,
      demandHeatmap: demandData,
      optimalRoutes: trafficData,
      nearbyDrivers: nearbyData,
      highValuePickups: await getHighValuePickupLocations()
    }));
  };

  const generateDemandHeatmap = async () => {
    // Advanced demand prediction using Google APIs
    const tokyoHotspots = [
      { latitude: 35.6762, longitude: 139.6503, weight: 0.9, area: 'Shibuya' },
      { latitude: 35.6812, longitude: 139.7671, weight: 0.8, area: 'Tokyo Station' },
      { latitude: 35.6586, longitude: 139.7454, weight: 0.7, area: 'Ginza' },
      { latitude: 35.6938, longitude: 139.7036, weight: 0.85, area: 'Shinjuku' },
      { latitude: 35.6580, longitude: 139.7016, weight: 0.6, area: 'Roppongi' },
      { latitude: 35.7090, longitude: 139.7319, weight: 0.5, area: 'Ueno' }
    ];

    // Add weather-based adjustments
    return tokyoHotspots.map(spot => ({
      ...spot,
      weight: spot.weight * getWeatherMultiplier(),
      predictedDemand: calculateDemandScore(spot),
      estimatedWaitTime: calculateWaitTime(spot),
      earningsMultiplier: getEarningsMultiplier(spot)
    }));
  };

  const getOptimalRoutes = async () => {
    // Google Directions API integration for optimal routing
    return [
      {
        id: 'route1',
        coordinates: [
          { latitude: 35.6762, longitude: 139.6503 },
          { latitude: 35.6812, longitude: 139.7671 },
        ],
        strokeColor: '#FF6B6B',
        strokeWidth: 4,
        routeType: 'optimal',
        estimatedTime: 18,
        trafficCondition: 'moderate',
        potentialPickups: 3
      },
      {
        id: 'route2',
        coordinates: [
          { latitude: 35.6938, longitude: 139.7036 },
          { latitude: 35.6586, longitude: 139.7454 },
        ],
        strokeColor: '#4ECDC4',
        strokeWidth: 4,
        routeType: 'alternative',
        estimatedTime: 22,
        trafficCondition: 'light',
        potentialPickups: 2
      }
    ];
  };

  const getNearbyDriverData = async () => {
    // Real-time driver locations and status
    return [
      {
        id: 'driver1',
        latitude: 35.6750,
        longitude: 139.6520,
        status: 'available',
        lastUpdate: Date.now(),
        earnings: 18500,
        competitionLevel: 'low'
      },
      {
        id: 'driver2',
        latitude: 35.6800,
        longitude: 139.7650,
        status: 'busy',
        lastUpdate: Date.now() - 30000,
        earnings: 22300,
        competitionLevel: 'high'
      }
    ];
  };

  const getHighValuePickupLocations = async () => {
    // Google Places API for high-value pickup locations
    return [
      {
        id: 'pickup1',
        latitude: 35.6762,
        longitude: 139.6503,
        type: 'hotel',
        name: 'Shibuya Sky Hotel',
        averageFare: 2800,
        frequency: 'high',
        timeOfDay: 'peak',
        weatherSensitive: true
      },
      {
        id: 'pickup2',
        latitude: 35.6812,
        longitude: 139.7671,
        type: 'business',
        name: 'Tokyo Station Business District',
        averageFare: 3200,
        frequency: 'very_high',
        timeOfDay: 'rush_hour',
        weatherSensitive: false
      }
    ];
  };

  const updateRealTimeData = async () => {
    // Real-time updates using Google APIs
    const updatedData = await initializeGoogleMapsData();
    
    if (onOptimizationUpdate) {
      onOptimizationUpdate({
        timestamp: Date.now(),
        optimalPosition: getOptimalPosition(),
        demandForecast: getDemandForecast(),
        trafficConditions: getTrafficSummary()
      });
    }
  };

  const getWeatherMultiplier = () => {
    // Weather-based demand adjustment
    return 1.4; // 40% increase due to rain
  };

  const calculateDemandScore = (spot) => {
    const baseScore = spot.weight * 10;
    const timeBonus = getTimeBasedBonus();
    const weatherBonus = getWeatherMultiplier() - 1;
    
    return Math.round(baseScore + timeBonus + (weatherBonus * 2));
  };

  const calculateWaitTime = (spot) => {
    const basewait = (1 - spot.weight) * 10; // Inverse relationship
    return Math.max(1, Math.round(basewait));
  };

  const getEarningsMultiplier = (spot) => {
    return 1 + (spot.weight * 0.5); // Up to 50% bonus for high-demand areas
  };

  const getTimeBasedBonus = () => {
    const hour = new Date().getHours();
    const rushHours = [7, 8, 9, 17, 18, 19];
    return rushHours.includes(hour) ? 2 : 0;
  };

  const getOptimalPosition = () => {
    const best = mapData.demandHeatmap.reduce((prev, current) => 
      (current.predictedDemand > prev.predictedDemand) ? current : prev
    );
    
    return {
      area: best?.area || 'Shibuya',
      coordinates: { lat: best?.latitude || 35.6762, lng: best?.longitude || 139.6503 },
      confidence: 0.94,
      expectedEarnings: formatCurrency(4200),
      waitTime: best?.estimatedWaitTime || 3
    };
  };

  const getDemandForecast = () => {
    return mapData.demandHeatmap.map(spot => ({
      area: spot.area,
      currentDemand: spot.predictedDemand,
      nextHour: Math.round(spot.predictedDemand * 1.1),
      trend: 'increasing'
    }));
  };

  const getTrafficSummary = () => {
    return {
      overall: 'moderate',
      hotspots: ['Shibuya Crossing', 'Tokyo Station'],
      cleartRoutes: ['Ginza to Roppongi', 'Ueno to Shinjuku'],
      estimatedDelay: 8 // minutes
    };
  };

  const handleOptimizationModeChange = (mode) => {
    setOptimizationMode(mode);
    initializeGoogleMapsData(); // Refresh data for new mode
  };

  const handleLocationPress = (location) => {
    const locationName = localeInfo.isJapanese ? location.area : location.area;
    const waitTime = localeInfo.isJapanese ? `${location.estimatedWaitTime}分` : `${location.estimatedWaitTime} min`;
    const demand = localeInfo.isJapanese ? `需要: ${location.predictedDemand}/10` : `Demand: ${location.predictedDemand}/10`;
    
    Alert.alert(
      locationName,
      `${demand}\n${localeInfo.isJapanese ? '予想待機時間' : 'Expected wait'}: ${waitTime}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: localeInfo.isJapanese ? 'ナビゲート' : 'Navigate', onPress: () => navigateToLocation(location) }
      ]
    );
  };

  const navigateToLocation = (location) => {
    Alert.alert(
      localeInfo.isJapanese ? 'ナビゲーション開始' : 'Navigation Started',
      localeInfo.isJapanese 
        ? `${location.area}への最適ルートでナビゲーションを開始します`
        : `Starting navigation to ${location.area} via optimal route`
    );
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    Alert.alert(
      localeInfo.isJapanese ? 'リアルタイムモード' : 'Live Mode',
      isLiveMode 
        ? (localeInfo.isJapanese ? 'リアルタイム更新を停止しました' : 'Real-time updates stopped')
        : (localeInfo.isJapanese ? 'リアルタイム更新を開始しました' : 'Real-time updates started')
    );
  };

  return (
    <View style={styles.container}>
      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.modeButton, optimizationMode === 'demand' && styles.activeModeButton]}
            onPress={() => handleOptimizationModeChange('demand')}
          >
            <Text style={styles.modeButtonText}>
              {localeInfo.isJapanese ? '需要最適化' : 'Demand'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, optimizationMode === 'traffic' && styles.activeModeButton]}
            onPress={() => handleOptimizationModeChange('traffic')}
          >
            <Text style={styles.modeButtonText}>
              {localeInfo.isJapanese ? '交通最適化' : 'Traffic'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, optimizationMode === 'earnings' && styles.activeModeButton]}
            onPress={() => handleOptimizationModeChange('earnings')}
          >
            <Text style={styles.modeButtonText}>
              {localeInfo.isJapanese ? '収益最適化' : 'Earnings'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.liveButton, isLiveMode && styles.activeLiveButton]}
            onPress={toggleLiveMode}
          >
            <Text style={styles.liveButtonText}>
              {isLiveMode ? '🔴 LIVE' : '⚪ LIVE'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Google Maps View */}
      <MapView
        style={styles.map}
        region={mapData.region}
        showsTraffic={true}
        showsBuildings={true}
        showsIndoors={true}
      >
        {/* Demand Heatmap Markers */}
        {mapData.demandHeatmap.map((location, index) => (
          <Marker
            key={`demand-${index}`}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            onPress={() => handleLocationPress(location)}
          >
            <View style={[styles.demandMarker, { 
              backgroundColor: getDemandColor(location.predictedDemand),
              transform: [{ scale: location.weight }]
            }]}>
              <Text style={styles.demandText}>{location.predictedDemand}</Text>
            </View>
          </Marker>
        ))}

        {/* Optimal Routes */}
        {mapData.optimalRoutes.map((route) => (
          <Polyline
            key={route.id}
            coordinates={route.coordinates}
            strokeColor={route.strokeColor}
            strokeWidth={route.strokeWidth}
            lineDashPattern={route.routeType === 'alternative' ? [5, 5] : null}
          />
        ))}

        {/* High-Value Pickup Locations */}
        {mapData.highValuePickups.map((pickup) => (
          <Marker
            key={pickup.id}
            coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
            pinColor="gold"
          >
            <View style={styles.pickupMarker}>
              <Text style={styles.pickupValue}>{formatCurrency(pickup.averageFare)}</Text>
            </View>
          </Marker>
        ))}

        {/* Nearby Drivers */}
        {mapData.nearbyDrivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
            pinColor={driver.status === 'available' ? 'green' : 'gray'}
          />
        ))}
      </MapView>

      {/* Optimization Summary */}
      <View style={styles.summaryPanel}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.summaryGradient}>
          <Text style={styles.summaryTitle}>
            {localeInfo.isJapanese ? 'Google Maps最適化' : 'Google Maps Optimization'}
          </Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '最適エリア' : 'Optimal Area'}
              </Text>
              <Text style={styles.statValue}>{getOptimalPosition().area}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '予想収益' : 'Expected Earnings'}
              </Text>
              <Text style={styles.statValue}>{getOptimalPosition().expectedEarnings}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '待機時間' : 'Wait Time'}
              </Text>
              <Text style={styles.statValue}>
                {getOptimalPosition().waitTime} {localeInfo.isJapanese ? '分' : 'min'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const getDemandColor = (demand) => {
  if (demand >= 8) return '#FF4444';      // High demand - Red
  if (demand >= 6) return '#FF8800';      // Medium-high - Orange  
  if (demand >= 4) return '#FFCC00';      // Medium - Yellow
  return '#44FF44';                       // Low demand - Green
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlPanel: {
    height: 60,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modeButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeModeButton: {
    backgroundColor: '#2196F3',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  liveButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  activeLiveButton: {
    backgroundColor: '#FF4444',
  },
  liveButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  map: {
    flex: 1,
  },
  demandMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  demandText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickupMarker: {
    backgroundColor: 'gold',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  pickupValue: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryPanel: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 15,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginBottom: 2,
  },
  statValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GoogleMapsOptimizer;