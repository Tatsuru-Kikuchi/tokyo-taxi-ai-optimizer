// MapControls.js - Floating controls to toggle map layers
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MapControls({
  showRain = true,
  showDemand = true,
  onToggleRain = () => {},
  onToggleDemand = () => {},
}) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity 
        style={[
          styles.controlButton,
          showRain && styles.activeButton
        ]}
        onPress={onToggleRain}
      >
        <Text style={styles.controlIcon}>🌧️</Text>
        <Text style={[
          styles.controlLabel,
          showRain && styles.activeLabel
        ]}>
          雨エリア
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.controlButton,
          showDemand && styles.activeButton
        ]}
        onPress={onToggleDemand}
      >
        <Text style={styles.controlIcon}>🔥</Text>
        <Text style={[
          styles.controlLabel,
          showDemand && styles.activeLabel
        ]}>
          需要
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 80,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  activeButton: {
    backgroundColor: '#667eea',
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
});
