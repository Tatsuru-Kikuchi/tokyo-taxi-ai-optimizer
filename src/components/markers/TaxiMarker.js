// TaxiMarker.js - Driver's current position marker
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MAP_COLORS, MARKER_SIZES } from '../utils/MapConstants';

export default function TaxiMarker({ 
  location, 
  heading = 0, 
  isMoving = false 
}) {
  return (
    <Marker
      coordinate={location}
      title="あなたのタクシー"
      description="現在の位置"
      anchor={{ x: 0.5, y: 0.5 }}
      rotation={heading}
    >
      <View style={[
        styles.markerContainer,
        isMoving && styles.movingMarker
      ]}>
        <Text style={styles.taxiEmoji}>🚕</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: MAP_COLORS.TAXI_COLOR,
    borderRadius: MARKER_SIZES.TAXI_MARKER.width / 2,
    width: MARKER_SIZES.TAXI_MARKER.width,
    height: MARKER_SIZES.TAXI_MARKER.height,
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
  movingMarker: {
    backgroundColor: '#2ecc71', // Green when moving
  },
  taxiEmoji: {
    fontSize: 20,
    color: 'white',
  },
});
