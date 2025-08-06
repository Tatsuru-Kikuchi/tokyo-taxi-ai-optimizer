// MapConstants.js - Configuration and constants for map components
export const TOKYO_LOCATIONS = {
  // Central Tokyo coordinate
  TOKYO_STATION: {
    latitude: 35.6762,
    longitude: 139.6503
  },
  
  // Major stations for demand hotspots
  SHIBUYA_STATION: {
    latitude: 35.6580,
    longitude: 139.7016
  },
  
  SHINJUKU_STATION: {
    latitude: 35.6895,
    longitude: 139.6917
  },
  
  GINZA: {
    latitude: 35.6719,
    longitude: 139.7658
  },
  
  ROPPONGI: {
    latitude: 35.6627,
    longitude: 139.7311
  }
};

export const MAP_CONFIG = {
  // Default zoom level for Tokyo
  DEFAULT_REGION: {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.0922,  // How much area to show
    longitudeDelta: 0.0421
  },
  
  // How often to update location (milliseconds)
  LOCATION_UPDATE_INTERVAL: 5000, // 5 seconds
  
  // Distance for nearby calculations (meters)
  NEARBY_RADIUS: 1000, // 1km
  
  // Animation durations
  MARKER_ANIMATION_DURATION: 300,
  MAP_ANIMATION_DURATION: 1000
};

export const MAP_COLORS = {
  // Rain zone colors by intensity
  RAIN_LIGHT: 'rgba(0, 0, 255, 0.2)',    // Light blue
  RAIN_MODERATE: 'rgba(255, 165, 0, 0.3)', // Orange  
  RAIN_HEAVY: 'rgba(255, 0, 0, 0.3)',     // Red
  
  // Demand level colors
  DEMAND_VERY_HIGH: '#FF0000',  // Red
  DEMAND_HIGH: '#FF8C00',       // Orange
  DEMAND_MEDIUM: '#FFD700',     // Yellow
  DEMAND_LOW: '#00FF00',        // Green
  
  // Taxi marker color
  TAXI_COLOR: '#667eea'         // Your app's blue
};

export const MARKER_SIZES = {
  TAXI_MARKER: {
    width: 40,
    height: 40
  },
  
  CUSTOMER_MARKER: {
    width: 30,
    height: 30
  },
  
  DEMAND_HOTSPOT: {
    width: 50,
    height: 50
  }
};
