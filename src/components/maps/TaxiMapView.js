// TaxiMapView.js - Main Google Maps component
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MAP_CONFIG, TOKYO_LOCATIONS } from '../utils/MapConstants';
import TaxiMarker from '../markers/TaxiMarker';
import DemandHotspot from '../markers/DemandHotspot';
import RainZone from '../zones/RainZone';

export default function TaxiMapView({ 
  showRain = true, 
  showDemand = true, 
  onLocationSelect = () => {} 
}) {
  const [mapRegion, setMapRegion] = useState(MAP_CONFIG.DEFAULT_REGION);
  const [driverLocation, setDriverLocation] = useState(TOKYO_LOCATIONS.TOKYO_STATION);

  // Simulate driver movement for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock data for demo
  const rainZones = [
    {
      id: 1,
      center: TOKYO_LOCATIONS.SHINJUKU_STATION,
      radius: 1000,
      intensity: 'heavy'
    },
    {
      id: 2,
      center: TOKYO_LOCATIONS.SHIBUYA_STATION,
      radius: 800,
      intensity: 'moderate'
    }
  ];

  const demandHotspots = [
    {
      id: 1,
      location: TOKYO_LOCATIONS.SHIBUYA_STATION,
      stationName: '渋谷',
      demandLevel: 'very_high',
      estimatedRevenue: 2800,
      waitTime: 2
    },
    {
      id: 2,
      location: TOKYO_LOCATIONS.SHINJUKU_STATION,
      stationName: '新宿',
      demandLevel: 'high',
      estimatedRevenue: 2400,
      waitTime: 4
    },
    {
      id: 3,
      location: TOKYO_LOCATIONS.TOKYO_STATION,
      stationName: '東京',
      demandLevel: 'medium',
      estimatedRevenue: 1800,
      waitTime: 6
    },
    {
      id: 4,
      location: TOKYO_LOCATIONS.GINZA,
      stationName: '銀座',
      demandLevel: 'low',
      estimatedRevenue: 1200,
      waitTime: 8
    }
  ];

  const handleMarkerPress = (location) => {
    Alert.alert(
      `📍 ${location.stationName}駅エリア`,
      `需要レベル: ${location.demandLevel}\n予想収益: ¥${location.estimatedRevenue}\n待機時間: ${location.waitTime}分`,
      [
        { text: 'ここに向かう', onPress: () => onLocationSelect(location) },
        { text: 'キャンセル', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={false}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        {/* Driver's taxi marker */}
        <TaxiMarker location={driverLocation} />

        {/* Rain zones */}
        {showRain && rainZones.map(zone => (
          <RainZone key={zone.id} {...zone} />
        ))}

        {/* Demand hotspots */}
        {showDemand && demandHotspots.map(hotspot => (
          <DemandHotspot 
            key={hotspot.id} 
            {...hotspot} 
            onPress={() => handleMarkerPress(hotspot)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
