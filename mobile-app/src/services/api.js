import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000' 
  : 'https://your-production-domain.com';

const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token (if needed in future)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration for performance monitoring
    const endTime = new Date();
    const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
    
    if (__DEV__) {
      console.log(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear stored auth token
          AsyncStorage.removeItem('authToken');
          break;
        case 503:
          // Service unavailable
          error.message = 'Service temporarily unavailable. Please try again later.';
          break;
        case 500:
          // Internal server error
          error.message = 'Server error. Please try again later.';
          break;
        default:
          error.message = data?.detail || error.message || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Weather Intelligence API Service
export const WeatherIntelligenceAPI = {
  /**
   * Get driver hotspot recommendations
   */
  getDriverHotspots: async () => {
    try {
      const response = await apiClient.get('/api/v1/weather/driver/hotspots');
      return response.data;
    } catch (error) {
      console.error('Error fetching driver hotspots:', error);
      throw error;
    }
  },

  /**
   * Get passenger transportation advice
   */
  getPassengerAdvice: async (origin, destination) => {
    try {
      const response = await apiClient.get('/api/v1/weather/passenger/advice', {
        params: { origin, destination }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching passenger advice:', error);
      throw error;
    }
  },

  /**
   * Get weather forecast
   */
  getWeatherForecast: async () => {
    try {
      const response = await apiClient.get('/api/v1/weather/forecast');
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  },

  /**
   * Get intelligence summary
   */
  getIntelligenceSummary: async () => {
    try {
      const response = await apiClient.get('/api/v1/weather/intelligence/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching intelligence summary:', error);
      throw error;
    }
  },
};

// Core System API Service
export const CoreSystemAPI = {
  /**
   * Get current weather data
   */
  getCurrentWeather: async () => {
    try {
      const response = await apiClient.get('/api/v1/weather');
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  /**
   * Get demand hotspots
   */
  getDemandHotspots: async (userType = 'driver', limit = 10) => {
    try {
      const response = await apiClient.get('/api/v1/hotspots', {
        params: { user_type: userType, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching demand hotspots:', error);
      throw error;
    }
  },

  /**
   * Get user recommendations
   */
  getUserRecommendations: async (userType, lat = null, lng = null) => {
    try {
      const params = {};
      if (lat && lng) {
        params.location_lat = lat;
        params.location_lng = lng;
      }
      
      const response = await apiClient.get(`/api/v1/recommendations/${userType}`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      throw error;
    }
  },

  /**
   * Get system health status
   */
  getSystemHealth: async () => {
    try {
      const response = await apiClient.get('/api/v1/system/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  },

  /**
   * Get performance statistics
   */
  getPerformanceStats: async () => {
    try {
      const response = await apiClient.get('/api/v1/stats/performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      throw error;
    }
  },
};

// Utility Functions
export const APIUtils = {
  /**
   * Check if API is reachable
   */
  checkConnection: async () => {
    try {
      const response = await apiClient.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get API base URL
   */
  getBaseURL: () => API_BASE_URL,

  /**
   * Cache API response
   */
  cacheResponse: async (key, data, ttl = 300) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: ttl * 1000, // Convert to milliseconds
      };
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching response:', error);
    }
  },

  /**
   * Get cached API response
   */
  getCachedResponse: async (key) => {
    try {
      const cachedData = await AsyncStorage.getItem(`cache_${key}`);
      if (!cachedData) return null;

      const parsed = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - parsed.timestamp > parsed.ttl) {
        // Cache expired, remove it
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Error getting cached response:', error);
      return null;
    }
  },

  /**
   * Clear all cached responses
   */
  clearCache: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
};

// Enhanced API service with caching
export const CachedAPI = {
  /**
   * Get driver hotspots with caching
   */
  getDriverHotspots: async (useCache = true) => {
    const cacheKey = 'driver_hotspots';
    
    if (useCache) {
      const cached = await APIUtils.getCachedResponse(cacheKey);
      if (cached) return cached;
    }

    const data = await WeatherIntelligenceAPI.getDriverHotspots();
    await APIUtils.cacheResponse(cacheKey, data, 60); // Cache for 1 minute
    return data;
  },

  /**
   * Get weather forecast with caching
   */
  getWeatherForecast: async (useCache = true) => {
    const cacheKey = 'weather_forecast';
    
    if (useCache) {
      const cached = await APIUtils.getCachedResponse(cacheKey);
      if (cached) return cached;
    }

    const data = await WeatherIntelligenceAPI.getWeatherForecast();
    await APIUtils.cacheResponse(cacheKey, data, 300); // Cache for 5 minutes
    return data;
  },

  /**
   * Get passenger advice with caching (short TTL due to location-specific nature)
   */
  getPassengerAdvice: async (origin, destination, useCache = true) => {
    const cacheKey = `passenger_advice_${origin}_${destination}`;
    
    if (useCache) {
      const cached = await APIUtils.getCachedResponse(cacheKey);
      if (cached) return cached;
    }

    const data = await WeatherIntelligenceAPI.getPassengerAdvice(origin, destination);
    await APIUtils.cacheResponse(cacheKey, data, 120); // Cache for 2 minutes
    return data;
  },
};

// Error handling utilities
export const APIErrorHandler = {
  /**
   * Get user-friendly error message
   */
  getErrorMessage: (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'Access denied. You don\'t have permission.';
        case 404:
          return 'Requested information not found.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    } else if (error.request) {
      return 'Network error. Please check your internet connection.';
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  },

  /**
   * Check if error is retryable
   */
  isRetryableError: (error) => {
    if (!error.response) return true; // Network errors are retryable
    
    const status = error.response.status;
    return status >= 500 || status === 408 || status === 429;
  },
};

// Performance monitoring
export const APIMonitor = {
  /**
   * Track API performance
   */
  trackPerformance: async (endpoint, duration) => {
    try {
      const performanceData = await AsyncStorage.getItem('api_performance');
      const data = performanceData ? JSON.parse(performanceData) : {};
      
      if (!data[endpoint]) {
        data[endpoint] = { calls: 0, totalTime: 0, avgTime: 0 };
      }
      
      data[endpoint].calls += 1;
      data[endpoint].totalTime += duration;
      data[endpoint].avgTime = data[endpoint].totalTime / data[endpoint].calls;
      
      await AsyncStorage.setItem('api_performance', JSON.stringify(data));
    } catch (error) {
      console.error('Error tracking API performance:', error);
    }
  },

  /**
   * Get performance stats
   */
  getPerformanceStats: async () => {
    try {
      const performanceData = await AsyncStorage.getItem('api_performance');
      return performanceData ? JSON.parse(performanceData) : {};
    } catch (error) {
      console.error('Error getting performance stats:', error);
      return {};
    }
  },
};

export default {
  WeatherIntelligenceAPI,
  CoreSystemAPI,
  APIUtils,
  CachedAPI,
  APIErrorHandler,
  APIMonitor,
};