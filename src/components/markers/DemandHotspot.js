<<<<<<< HEAD
import React from 'react';
import { View } from 'react-native';

export default function DemandHotspot() {
  return <View />;
}
=======
// DemandHotspot.js - High-demand area markers
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MAP_COLORS, MARKER_SIZES } from '../utils/MapConstants';

export default function DemandHotspot({ 
  location, 
  demandLevel, 
  stationName,
  estimatedRevenue,
  waitTime,
  onPress = () => {} 
}) {
  const getMarkerColor = (level) => {
    switch(level) {
      case 'very_high': return MAP_COLORS.DEMAND_VERY_HIGH;
      case 'high': return MAP_COLORS.DEMAND_HIGH;
      case 'medium': return MAP_COLORS.DEMAND_MEDIUM;
      case 'low': return MAP_COLORS.DEMAND_LOW;
      default: return '#999999';
    }
  };

  const getDemandEmoji = (level) => {
    switch(level) {
      case 'very_high': return '🔥';
      case 'high': return '🔥';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getDemandText = (level) => {
    switch(level) {
      case 'very_high': return '超高';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };

  return (
    <Marker
      coordinate={location}
      title={`${stationName}駅エリア`}
      description={`需要: ${getDemandText(demandLevel)} | 予想収益: ¥${estimatedRevenue} | 待機: ${waitTime}分`}
      onPress={onPress}
    >
      <View style={[
        styles.hotspotContainer,
        { backgroundColor: getMarkerColor(demandLevel) }
      ]}>
        <Text style={styles.demandEmoji}>
          {getDemandEmoji(demandLevel)}
        </Text>
        <Text style={styles.demandText}>
          {getDemandText(demandLevel)}
        </Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  hotspotContainer: {
    borderRadius: MARKER_SIZES.DEMAND_HOTSPOT.width / 2,
    width: MARKER_SIZES.DEMAND_HOTSPOT.width,
    height: MARKER_SIZES.DEMAND_HOTSPOT.height,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  demandEmoji: {
    fontSize: 16,
    marginBottom: -2,
  },
  demandText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
>>>>>>> origin/main
