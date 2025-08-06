// MapScreen.js - Complete map interface screen
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TaxiMapView from './TaxiMapView';
import MapControls from './MapControls';

export default function MapScreen() {
  const [showRain, setShowRain] = useState(true);
  const [showDemand, setShowDemand] = useState(true);

  const handleLocationSelect = (location) => {
    Alert.alert(
      '🎯 ナビゲーション開始',
      `${location.stationName}駅エリアに向かいますか？\n\n予想収益: ¥${location.estimatedRevenue}\n待機時間: ${location.waitTime}分`,
      [
        { 
          text: 'ナビ開始', 
          onPress: () => {
            // Here you would integrate with navigation
            Alert.alert('ナビゲーション', `${location.stationName}駅への案内を開始しました！`);
          }
        },
        { text: 'キャンセル', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TaxiMapView
        showRain={showRain}
        showDemand={showDemand}
        onLocationSelect={handleLocationSelect}
      />
      
      <MapControls
        showRain={showRain}
        showDemand={showDemand}
        onToggleRain={() => setShowRain(!showRain)}
        onToggleDemand={() => setShowDemand(!showDemand)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
