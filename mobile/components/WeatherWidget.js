import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from '../localization/LocalizationContext';

const WeatherWidget = ({ onLocationPress, onRefreshPress }) => {
  const { t, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  const [weatherData, setWeatherData] = React.useState({
    condition: 'rain',
    temperature: 18,
    humidity: 85,
    windSpeed: 12,
    visibility: 2,
    forecast: [
      { time: '+1h', condition: 'rain', temp: 17 },
      { time: '+2h', condition: 'light_rain', temp: 19 },
      { time: '+3h', condition: 'cloudy', temp: 21 }
    ]
  });

  const getWeatherIcon = (condition) => {
    const icons = {
      'rain': '🌧️',
      'heavy_rain': '⛈️',
      'light_rain': '🌦️',
      'cloudy': '☁️',
      'clear': '☀️',
      'snow': '❄️',
      'typhoon': '🌀'
    };
    return icons[condition] || '🌤️';
  };

  const getWeatherText = (condition) => {
    if (localeInfo.isJapanese) {
      const conditions = {
        'rain': '雨',
        'heavy_rain': '大雨',
        'light_rain': '小雨',
        'cloudy': '曇り',
        'clear': '晴れ',
        'snow': '雪',
        'typhoon': '台風'
      };
      return conditions[condition] || '晴れ時々曇り';
    } else {
      const conditions = {
        'rain': 'Rain',
        'heavy_rain': 'Heavy Rain',
        'light_rain': 'Light Rain',
        'cloudy': 'Cloudy',
        'clear': 'Clear',
        'snow': 'Snow',
        'typhoon': 'Typhoon'
      };
      return conditions[condition] || 'Partly Cloudy';
    }
  };

  const handleLocationPress = () => {
    Alert.alert(
      localeInfo.isJapanese ? '位置情報の更新' : 'Update Location',
      localeInfo.isJapanese 
        ? '現在の位置情報を更新しますか？'
        : 'Would you like to update your current location?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.ok'), onPress: onLocationPress }
      ]
    );
  };

  const handleRefresh = () => {
    // Simulate weather data refresh
    setWeatherData(prev => ({
      ...prev,
      temperature: prev.temperature + (Math.random() - 0.5) * 4,
      humidity: Math.max(20, Math.min(100, prev.humidity + (Math.random() - 0.5) * 20)),
      windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 10)
    }));
    
    if (onRefreshPress) onRefreshPress();
    
    Alert.alert(
      t('common.success'),
      localeInfo.isJapanese ? '天気情報が更新されました' : 'Weather information updated'
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.weatherCard}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleLocationPress} style={styles.locationButton}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {localeInfo.isJapanese ? '東京' : 'Tokyo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Current Weather */}
        <View style={styles.currentWeather}>
          <View style={styles.mainWeatherInfo}>
            <Text style={styles.weatherIcon}>{getWeatherIcon(weatherData.condition)}</Text>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>{Math.round(weatherData.temperature)}°</Text>
              <Text style={styles.weatherCondition}>
                {getWeatherText(weatherData.condition)}
              </Text>
            </View>
          </View>
          
          {/* Weather Details */}
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💧</Text>
              <Text style={styles.detailText}>
                {weatherData.humidity}% {localeInfo.isJapanese ? '湿度' : 'Humidity'}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🌬️</Text>
              <Text style={styles.detailText}>
                {weatherData.windSpeed}km/h {localeInfo.isJapanese ? '風速' : 'Wind'}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>👁️</Text>
              <Text style={styles.detailText}>
                {weatherData.visibility}km {localeInfo.isJapanese ? '視界' : 'Visibility'}
              </Text>
            </View>
          </View>
        </View>

        {/* Forecast */}
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>
            {localeInfo.isJapanese ? '今後の天気' : 'Forecast'}
          </Text>
          <View style={styles.forecastRow}>
            {weatherData.forecast.map((item, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastTime}>{item.time}</Text>
                <Text style={styles.forecastIcon}>{getWeatherIcon(item.condition)}</Text>
                <Text style={styles.forecastTemp}>{Math.round(item.temp)}°</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weather Impact */}
        <View style={styles.impactContainer}>
          <Text style={styles.impactTitle}>
            {localeInfo.isJapanese ? '🚕 タクシー需要への影響' : '🚕 Taxi Demand Impact'}
          </Text>
          <Text style={styles.impactText}>
            {localeInfo.isJapanese 
              ? '現在の雨により、タクシー需要が42%増加しています'
              : 'Current rain conditions are increasing taxi demand by 42%'
            }
          </Text>
          
          <View style={styles.impactBadges}>
            <View style={[styles.impactBadge, styles.highImpact]}>
              <Text style={styles.badgeText}>
                {localeInfo.isJapanese ? '高需要' : 'High Demand'}
              </Text>
            </View>
            <View style={[styles.impactBadge, styles.surgeActive]}>
              <Text style={styles.badgeText}>
                {localeInfo.isJapanese ? 'サージ料金' : 'Surge Pricing'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  weatherCard: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  refreshIcon: {
    fontSize: 16,
  },
  currentWeather: {
    marginBottom: 25,
  },
  mainWeatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherIcon: {
    fontSize: 60,
    marginRight: 20,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 50,
  },
  weatherCondition: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  detailText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  forecastContainer: {
    marginBottom: 20,
  },
  forecastTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    minWidth: 60,
  },
  forecastTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  forecastIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  forecastTemp: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  impactContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 15,
  },
  impactTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  impactText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  impactBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highImpact: {
    backgroundColor: '#FF5722',
  },
  surgeActive: {
    backgroundColor: '#FF9800',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default WeatherWidget;