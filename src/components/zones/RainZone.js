// RainZone.js - Rain area visualization with colored circles
import React from 'react';
import { Circle } from 'react-native-maps';
import { MAP_COLORS } from '../utils/MapConstants';

export default function RainZone({ 
  center, 
  radius = 1000, 
  intensity = 'moderate' 
}) {
  const getRainColor = (intensity) => {
    switch(intensity) {
      case 'heavy': return MAP_COLORS.RAIN_HEAVY;
      case 'moderate': return MAP_COLORS.RAIN_MODERATE;
      case 'light': return MAP_COLORS.RAIN_LIGHT;
      default: return MAP_COLORS.RAIN_MODERATE;
    }
  };

  const getStrokeColor = (intensity) => {
    switch(intensity) {
      case 'heavy': return '#FF0000';
      case 'moderate': return '#FFA500';
      case 'light': return '#0000FF';
      default: return '#FFA500';
    }
  };

  return (
    <Circle
      center={center}
      radius={radius}
      fillColor={getRainColor(intensity)}
      strokeColor={getStrokeColor(intensity)}
      strokeWidth={2}
      lineDashPattern={intensity === 'heavy' ? [5, 5] : []}
    />
  );
}
