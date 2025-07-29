import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { useLocalization } from '../localization/LocalizationContext';

const { width } = Dimensions.get('window');

// Intelligent Route Optimization System
class IntelligentRouteOptimizer {
  constructor() {
    this.routes = [];
    this.trafficPatterns = [];
    this.optimizationSettings = {
      prioritizeTime: true,
      avoidTolls: false,
      preferHighways: false,
      minimizeFuelConsumption: true,
      maximizeEarnings: true,
      considerWeather: true
    };
    this.analytics = {};
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('route_optimizer_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.routes = data.routes || [];
        this.trafficPatterns = data.trafficPatterns || [];
        this.optimizationSettings = { ...this.optimizationSettings, ...(data.optimizationSettings || {}) };
        this.analytics = data.analytics || {};
      }
      
      if (this.routes.length === 0) {
        this.generateSampleData();
      }
      
      this.calculateOptimizations();
    } catch (error) {
      console.error('Route optimizer initialization error:', error);
    }
  }

  generateSampleData() {
    const tokyoAreas = [
      { name: 'Shibuya', lat: 35.6598, lng: 139.7006 },
      { name: 'Shinjuku', lat: 35.6896, lng: 139.6917 },
      { name: 'Tokyo Station', lat: 35.6812, lng: 139.7671 },
      { name: 'Ginza', lat: 35.6722, lng: 139.7649 },
      { name: 'Roppongi', lat: 35.6627, lng: 139.7279 },
      { name: 'Harajuku', lat: 35.6702, lng: 139.7016 }
    ];

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Generate sample routes for the last 24 hours
    for (let i = 23; i >= 0; i--) {
      const timestamp = now - (i * oneHour);
      const hour = new Date(timestamp).getHours();
      
      const numRoutes = this.getHourlyRouteCount(hour);
      
      for (let j = 0; j < numRoutes; j++) {
        const origin = tokyoAreas[Math.floor(Math.random() * tokyoAreas.length)];
        let destination = tokyoAreas[Math.floor(Math.random() * tokyoAreas.length)];
        
        while (destination.name === origin.name) {
          destination = tokyoAreas[Math.floor(Math.random() * tokyoAreas.length)];
        }

        const distance = this.calculateDistance(origin, destination);
        const baseTime = distance * 3;
        const trafficMultiplier = this.getTrafficMultiplier(hour);
        const actualTime = baseTime * trafficMultiplier;
        
        const route = {
          id: `${timestamp}_${j}`,
          timestamp,
          origin: origin.name,
          destination: destination.name,
          distance: Math.round(distance * 10) / 10,
          estimatedTime: Math.round(baseTime),
          actualTime: Math.round(actualTime),
          trafficFactor: Math.round(trafficMultiplier * 100) / 100,
          earnings: Math.round(distance * 400 + 1000 + (actualTime * 50)),
          efficiency: Math.round(((baseTime / actualTime) * 100)),
          weatherCondition: this.getWeatherCondition(),
          routeQuality: this.calculateRouteQuality(distance, actualTime, trafficMultiplier)
        };

        this.routes.push(route);
      }
    }

    this.generateTrafficPatterns();
  }

  getHourlyRouteCount(hour) {
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return Math.floor(Math.random() * 3) + 2;
    } else if (hour >= 22 || hour <= 5) {
      return Math.random() > 0.7 ? 1 : 0;
    } else {
      return Math.floor(Math.random() * 2) + 1;
    }
  }

  calculateDistance(point1, point2) {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  getTrafficMultiplier(hour) {
    if (hour >= 7 && hour <= 9) return 1.8 + (Math.random() * 0.4);
    if (hour >= 17 && hour <= 19) return 1.6 + (Math.random() * 0.5);
    if (hour >= 11 && hour <= 14) return 1.2 + (Math.random() * 0.3);
    if (hour >= 22 || hour <= 5) return 0.8 + (Math.random() * 0.2);
    return 1.0 + (Math.random() * 0.3);
  }

  getWeatherCondition() {
    const conditions = ['clear', 'cloudy', 'light_rain', 'heavy_rain'];
    const weights = [0.6, 0.25, 0.1, 0.05];
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < conditions.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return conditions[i];
      }
    }
    
    return 'clear';
  }

  calculateRouteQuality(distance, actualTime, trafficFactor) {
    let score = 100;
    score -= (trafficFactor - 1) * 30;
    const timeEfficiency = distance / (actualTime / 60);
    if (timeEfficiency > 20) score += 10;
    if (timeEfficiency < 10) score -= 15;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  generateTrafficPatterns() {
    const hours = Array.from({length: 24}, (_, i) => i);
    
    this.trafficPatterns = hours.map(hour => {
      const routes = this.routes.filter(route => 
        new Date(route.timestamp).getHours() === hour
      );
      
      if (routes.length === 0) {
        return {
          hour,
          averageTraffic: 1.0,
          routeCount: 0,
          efficiency: 100
        };
      }
      
      const averageTraffic = routes.reduce((sum, route) => sum + route.trafficFactor, 0) / routes.length;
      const averageEfficiency = routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length;
      
      return {
        hour,
        averageTraffic: Math.round(averageTraffic * 100) / 100,
        routeCount: routes.length,
        efficiency: Math.round(averageEfficiency)
      };
    });
  }

  calculateOptimizations() {
    if (this.routes.length === 0) return;

    this.analytics.bestRoute = this.routes.reduce((best, route) => 
      route.routeQuality > best.routeQuality ? route : best
    );
    
    this.analytics.worstRoute = this.routes.reduce((worst, route) => 
      route.routeQuality < worst.routeQuality ? route : worst
    );

    const totalRoutes = this.routes.length;
    this.analytics.averageDistance = this.routes.reduce((sum, route) => sum + route.distance, 0) / totalRoutes;
    this.analytics.averageTime = this.routes.reduce((sum, route) => sum + route.actualTime, 0) / totalRoutes;
    this.analytics.averageEarnings = this.routes.reduce((sum, route) => sum + route.earnings, 0) / totalRoutes;
    this.analytics.averageEfficiency = this.routes.reduce((sum, route) => sum + route.efficiency, 0) / totalRoutes;
    
    this.analytics.recommendations = this.generateRecommendations();
  }

  generateRecommendations() {
    const recommendations = [];

    // Find best time slots
    const hourlyStats = {};
    this.routes.forEach(route => {
      const hour = new Date(route.timestamp).getHours();
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { earnings: [], efficiency: [], count: 0 };
      }
      hourlyStats[hour].earnings.push(route.earnings);
      hourlyStats[hour].efficiency.push(route.efficiency);
      hourlyStats[hour].count++;
    });

    const bestHour = Object.entries(hourlyStats)
      .filter(([hour, stats]) => stats.count >= 2)
      .map(([hour, stats]) => ({
        hour: parseInt(hour),
        avgEarnings: stats.earnings.reduce((sum, val) => sum + val, 0) / stats.earnings.length,
        avgEfficiency: stats.efficiency.reduce((sum, val) => sum + val, 0) / stats.efficiency.length
      }))
      .sort((a, b) => (b.avgEarnings + b.avgEfficiency) - (a.avgEarnings + a.avgEfficiency))[0];

    if (bestHour) {
      recommendations.push({
        type: 'timing',
        priority: 'high',
        title: 'Optimal Operating Hours',
        description: `Peak performance around ${bestHour.hour}:00. Consider extending working hours during this time.`,
        impact: 'earnings',
        value: `+${Math.round((bestHour.avgEarnings - this.analytics.averageEarnings) / this.analytics.averageEarnings * 100)}%`
      });
    }

    // Low efficiency routes
    const lowEfficiencyRoutes = this.routes.filter(route => route.efficiency < 70).length;
    if (lowEfficiencyRoutes > this.routes.length * 0.3) {
      recommendations.push({
        type: 'routing',
        priority: 'high',
        title: 'Route Optimization Needed',
        description: `${Math.round(lowEfficiencyRoutes / this.routes.length * 100)}% of routes have low efficiency. Use AI route suggestions.`,
        impact: 'time',
        value: 'Save 20-30 min/day'
      });
    }

    // Weather impact
    const rainRoutes = this.routes.filter(route => route.weatherCondition.includes('rain'));
    if (rainRoutes.length > 0) {
      recommendations.push({
        type: 'weather',
        priority: 'medium',
        title: 'Weather Impact Strategy',
        description: 'Rainy weather affects efficiency. Prepare alternative routes and allow extra time.',
        impact: 'reliability',
        value: 'Improve consistency'
      });
    }

    return recommendations.slice(0, 5);
  }

  async saveData() {
    try {
      const data = {
        routes: this.routes,
        trafficPatterns: this.trafficPatterns,
        optimizationSettings: this.optimizationSettings,
        analytics: this.analytics
      };
      await AsyncStorage.setItem('route_optimizer_data', JSON.stringify(data));
    } catch (error) {
      console.error('Route optimizer data save error:', error);
    }
  }
}

// Route Optimization Component
const IntelligentRouteOptimizationSystem = () => {
  const [routeOptimizer] = useState(() => new IntelligentRouteOptimizer());
  const [routes, setRoutes] = useState([]);
  const [trafficPatterns, setTrafficPatterns] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [optimizationSettings, setOptimizationSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [fadeAnim] = useState(new Animated.Value(0));

  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeRouteOptimizer();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeRouteOptimizer = async () => {
    setIsLoading(true);
    try {
      await routeOptimizer.initialize();
      setRoutes(routeOptimizer.routes);
      setTrafficPatterns(routeOptimizer.trafficPatterns);
      setAnalytics(routeOptimizer.analytics);
      setOptimizationSettings(routeOptimizer.optimizationSettings);
    } catch (error) {
      console.error('Route optimizer initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (setting, value) => {
    const newSettings = { ...optimizationSettings, [setting]: value };
    setOptimizationSettings(newSettings);
    routeOptimizer.optimizationSettings = newSettings;
    await routeOptimizer.saveData();
  };

  const getTrafficChartData = () => {
    return {
      labels: trafficPatterns.filter(pattern => pattern.routeCount > 0).map(pattern => `${pattern.hour}h`),
      datasets: [{
        data: trafficPatterns.filter(pattern => pattern.routeCount > 0).map(pattern => pattern.averageTraffic)
      }]
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#2196F3';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'earnings': return '💰';
      case 'efficiency': return '⚡';
      case 'time': return '⏱️';
      case 'reliability': return '🎯';
      default: return '📈';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? 'ルート最適化データ分析中...' : 'Analyzing route optimization data...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerIcon}>🗺️</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? 'インテリジェントルート最適化' : 'Intelligent Route Optimization'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {localeInfo.isJapanese 
              ? 'AI駆動の交通分析とルート提案システム'
              : 'AI-powered traffic analysis and route recommendation system'
            }
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.performanceOverview}>
        <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>
            📊 {localeInfo.isJapanese ? 'ルートパフォーマンス概要' : 'Route Performance Overview'}
          </Text>
          <View style={styles.performanceStats}>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>
                {analytics.averageEfficiency ? `${Math.round(analytics.averageEfficiency)}%` : 'N/A'}
              </Text>
              <Text style={styles.performanceLabel}>
                {localeInfo.isJapanese ? '平均効率' : 'Avg Efficiency'}
              </Text>
            </View>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>
                {analytics.averageDistance ? `${analytics.averageDistance.toFixed(1)}km` : 'N/A'}
              </Text>
              <Text style={styles.performanceLabel}>
                {localeInfo.isJapanese ? '平均距離' : 'Avg Distance'}
              </Text>
            </View>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>
                {analytics.averageTime ? `${Math.round(analytics.averageTime)}min` : 'N/A'}
              </Text>
              <Text style={styles.performanceLabel}>
                {localeInfo.isJapanese ? '平均時間' : 'Avg Time'}
              </Text>
            </View>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>
                {analytics.averageEarnings ? formatCurrency(Math.round(analytics.averageEarnings)) : 'N/A'}
              </Text>
              <Text style={styles.performanceLabel}>
                {localeInfo.isJapanese ? '平均収益' : 'Avg Earnings'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '概要' : 'Overview'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '提案' : 'Recommendations'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '設定' : 'Settings'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏆 {localeInfo.isJapanese ? 'ベスト・ワーストルート' : 'Best & Worst Routes'}
            </Text>
            
            {analytics.bestRoute && (
              <View style={styles.routeCard}>
                <Text style={styles.routeType}>
                  ✅ {localeInfo.isJapanese ? '最高効率ルート' : 'Best Route'}
                </Text>
                <Text style={styles.routeDescription}>
                  {analytics.bestRoute.origin} → {analytics.bestRoute.destination}
                </Text>
                <View style={styles.routeMetrics}>
                  <Text style={styles.routeMetric}>
                    {analytics.bestRoute.efficiency}% {localeInfo.isJapanese ? '効率' : 'efficiency'}
                  </Text>
                  <Text style={styles.routeMetric}>{analytics.bestRoute.distance}km</Text>
                  <Text style={styles.routeMetric}>{Math.round(analytics.bestRoute.actualTime)}min</Text>
                </View>
              </View>
            )}
            
            {analytics.worstRoute && (
              <View style={styles.routeCard}>
                <Text style={styles.routeType}>
                  ❌ {localeInfo.isJapanese ? '改善要ルート' : 'Route Needing Improvement'}
                </Text>
                <Text style={styles.routeDescription}>
                  {analytics.worstRoute.origin} → {analytics.worstRoute.destination}
                </Text>
                <View style={styles.routeMetrics}>
                  <Text style={styles.routeMetric}>
                    {analytics.worstRoute.efficiency}% {localeInfo.isJapanese ? '効率' : 'efficiency'}
                  </Text>
                  <Text style={styles.routeMetric}>{analytics.worstRoute.distance}km</Text>
                  <Text style={styles.routeMetric}>{Math.round(analytics.worstRoute.actualTime)}min</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📈 {localeInfo.isJapanese ? '交通パターン分析' : 'Traffic Pattern Analysis'}
            </Text>
            
            {trafficPatterns.filter(pattern => pattern.routeCount > 0).length > 0 && (
              <View style={styles.chartContainer}>
                <LineChart
                  data={getTrafficChartData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {activeTab === 'recommendations' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              💡 {localeInfo.isJapanese ? 'AI最適化提案' : 'AI Optimization Recommendations'}
            </Text>
            
            {analytics.recommendations?.length > 0 ? (
              analytics.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <Text style={styles.recommendationIcon}>{getImpactIcon(rec.impact)}</Text>
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>{rec.title}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(rec.priority) }]}>
                        <Text style={styles.priorityText}>
                          {rec.priority === 'high' ? (localeInfo.isJapanese ? '高' : 'HIGH') :
                           rec.priority === 'medium' ? (localeInfo.isJapanese ? '中' : 'MED') :
                           (localeInfo.isJapanese ? '低' : 'LOW')}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.recommendationValue}>{rec.value}</Text>
                  </View>
                  <Text style={styles.recommendationDescription}>{rec.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                {localeInfo.isJapanese ? '提案がありません' : 'No recommendations available'}
              </Text>
            )}
          </View>
        </Animated.View>
      )}

      {activeTab === 'settings' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ⚙️ {localeInfo.isJapanese ? '最適化設定' : 'Optimization Settings'}
            </Text>
            
            {Object.entries(optimizationSettings).map(([setting, value]) => (
              <View key={setting} style={styles.settingItem}>
                <Text style={styles.settingLabel}>
                  {setting === 'prioritizeTime' ? (localeInfo.isJapanese ? '時間を優先' : 'Prioritize Time') :
                   setting === 'avoidTolls' ? (localeInfo.isJapanese ? '有料道路回避' : 'Avoid Tolls') :
                   setting === 'preferHighways' ? (localeInfo.isJapanese ? '高速道路優先' : 'Prefer Highways') :
                   setting === 'minimizeFuelConsumption' ? (localeInfo.isJapanese ? '燃費最適化' : 'Minimize Fuel') :
                   setting === 'maximizeEarnings' ? (localeInfo.isJapanese ? '収益最大化' : 'Maximize Earnings') :
                   setting === 'considerWeather' ? (localeInfo.isJapanese ? '天候考慮' : 'Consider Weather') :
                   setting}
                </Text>
                <Switch
                  value={value}
                  onValueChange={(newValue) => handleSettingChange(setting, newValue)}
                  trackColor={{ false: '#E0E0E0', true: '#9C27B0' }}
                  thumbColor={value ? '#7B1FA2' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 30,
    paddingTop: 50,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  performanceOverview: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  performanceCard: {
    padding: 25,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  performanceStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceStat: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 5,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#9C27B0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  routeType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  routeDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  routeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeMetric: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recommendationCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendationValue: {
    fontSize: 12,
    color: '#9C27B0',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  settingItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default IntelligentRouteOptimizationSystem;