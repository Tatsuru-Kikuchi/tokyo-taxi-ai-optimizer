import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '../localization/LocalizationContext';

const { width: screenWidth } = Dimensions.get('window');

// Advanced analytics and earnings optimization system
class EarningsAnalytics {
  constructor() {
    this.earningsHistory = [];
    this.performanceMetrics = {};
    this.predictions = {};
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('earnings_analytics');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.earningsHistory = data.earningsHistory || [];
        this.performanceMetrics = data.performanceMetrics || {};
      }
      
      this.generatePredictions();
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }

  // Add new earnings data
  async addEarningsData(earningsData) {
    const dataPoint = {
      ...earningsData,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      hour: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };

    this.earningsHistory.push(dataPoint);
    
    // Keep only last 90 days
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    this.earningsHistory = this.earningsHistory.filter(
      data => data.timestamp > ninetyDaysAgo
    );

    await this.saveData();
    this.updateMetrics();
    this.generatePredictions();
  }

  // Calculate comprehensive performance metrics
  updateMetrics() {
    if (this.earningsHistory.length === 0) return;

    const totalEarnings = this.earningsHistory.reduce((sum, data) => sum + data.amount, 0);
    const totalRides = this.earningsHistory.length;
    const avgPerRide = totalEarnings / totalRides;

    // Daily metrics
    const dailyData = this.groupByDay();
    const avgDailyEarnings = Object.values(dailyData).reduce((sum, day) => sum + day.total, 0) / Object.keys(dailyData).length;

    // Hourly performance
    const hourlyData = this.groupByHour();
    const bestHour = Object.entries(hourlyData).reduce((best, [hour, data]) => 
      data.avgEarnings > (best.avgEarnings || 0) ? { hour: parseInt(hour), ...data } : best
    , {});

    // Weather impact analysis
    const weatherImpact = this.analyzeWeatherImpact();

    // Location performance
    const locationPerformance = this.analyzeLocationPerformance();

    this.performanceMetrics = {
      totalEarnings,
      totalRides,
      avgPerRide,
      avgDailyEarnings,
      bestHour,
      weatherImpact,
      locationPerformance,
      recentTrend: this.calculateTrend(),
      efficiency: this.calculateEfficiency()
    };
  }

  groupByDay() {
    const grouped = {};
    this.earningsHistory.forEach(data => {
      if (!grouped[data.date]) {
        grouped[data.date] = { total: 0, rides: 0, hours: new Set() };
      }
      grouped[data.date].total += data.amount;
      grouped[data.date].rides++;
      grouped[data.date].hours.add(data.hour);
    });

    Object.keys(grouped).forEach(date => {
      grouped[date].avgPerRide = grouped[date].total / grouped[date].rides;
      grouped[date].hoursWorked = grouped[date].hours.size;
      grouped[date].earningsPerHour = grouped[date].total / grouped[date].hoursWorked;
    });

    return grouped;
  }

  groupByHour() {
    const grouped = {};
    this.earningsHistory.forEach(data => {
      if (!grouped[data.hour]) {
        grouped[data.hour] = { total: 0, rides: 0 };
      }
      grouped[data.hour].total += data.amount;
      grouped[data.hour].rides++;
    });

    Object.keys(grouped).forEach(hour => {
      grouped[hour].avgEarnings = grouped[hour].total / grouped[hour].rides;
    });

    return grouped;
  }

  analyzeWeatherImpact() {
    const weatherGroups = {};
    this.earningsHistory.forEach(data => {
      const weather = data.weather || 'unknown';
      if (!weatherGroups[weather]) {
        weatherGroups[weather] = { total: 0, rides: 0 };
      }
      weatherGroups[weather].total += data.amount;
      weatherGroups[weather].rides++;
    });

    Object.keys(weatherGroups).forEach(weather => {
      weatherGroups[weather].avgEarnings = weatherGroups[weather].total / weatherGroups[weather].rides;
    });

    return weatherGroups;
  }

  analyzeLocationPerformance() {
    const locationGroups = {};
    this.earningsHistory.forEach(data => {
      const location = data.area || 'unknown';
      if (!locationGroups[location]) {
        locationGroups[location] = { total: 0, rides: 0, waitTimes: [] };
      }
      locationGroups[location].total += data.amount;
      locationGroups[location].rides++;
      if (data.waitTime) {
        locationGroups[location].waitTimes.push(data.waitTime);
      }
    });

    Object.keys(locationGroups).forEach(location => {
      const group = locationGroups[location];
      group.avgEarnings = group.total / group.rides;
      group.avgWaitTime = group.waitTimes.length > 0 
        ? group.waitTimes.reduce((sum, time) => sum + time, 0) / group.waitTimes.length
        : 0;
      group.efficiency = group.avgEarnings / Math.max(group.avgWaitTime, 1);
    });

    return locationGroups;
  }

  calculateTrend() {
    if (this.earningsHistory.length < 7) return 'insufficient_data';

    const recent = this.earningsHistory.slice(-7);
    const previous = this.earningsHistory.slice(-14, -7);

    if (previous.length === 0) return 'insufficient_data';

    const recentAvg = recent.reduce((sum, data) => sum + data.amount, 0) / recent.length;
    const previousAvg = previous.reduce((sum, data) => sum + data.amount, 0) / previous.length;

    const change = ((recentAvg - previousAvg) / previousAvg) * 100;

    if (change > 10) return 'strongly_improving';
    if (change > 5) return 'improving';
    if (change > -5) return 'stable';
    if (change > -10) return 'declining';
    return 'strongly_declining';
  }

  calculateEfficiency() {
    if (this.earningsHistory.length === 0) return 0;

    const last30Days = this.earningsHistory.filter(
      data => data.timestamp > (Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    if (last30Days.length === 0) return 0;

    const totalEarnings = last30Days.reduce((sum, data) => sum + data.amount, 0);
    const totalWaitTime = last30Days.reduce((sum, data) => sum + (data.waitTime || 5), 0);
    const totalTime = last30Days.length * 30; // Assume 30 min per ride on average

    return (totalEarnings / (totalTime + totalWaitTime)) * 60; // Earnings per hour
  }

  // Generate future earnings predictions
  generatePredictions() {
    if (this.earningsHistory.length < 14) {
      this.predictions = {
        nextHour: 'insufficient_data',
        today: 'insufficient_data',
        thisWeek: 'insufficient_data'
      };
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Next hour prediction
    const hourlyData = this.groupByHour();
    const nextHourPrediction = hourlyData[currentHour]?.avgEarnings || 0;

    // Today prediction
    const dailyData = this.groupByDay();
    const todayPrediction = Object.values(dailyData).reduce((sum, day) => sum + day.total, 0) / Object.keys(dailyData).length;

    // Week prediction
    const weekPrediction = todayPrediction * 7;

    this.predictions = {
      nextHour: Math.round(nextHourPrediction),
      today: Math.round(todayPrediction),
      thisWeek: Math.round(weekPrediction)
    };
  }

  // Get optimization recommendations
  getOptimizationRecommendations() {
    const recommendations = [];

    // Best hour recommendation
    if (this.performanceMetrics.bestHour?.hour !== undefined) {
      recommendations.push({
        type: 'time',
        priority: 'high',
        title: 'Peak Hour Optimization',
        description: `Hour ${this.performanceMetrics.bestHour.hour}:00 shows highest earnings (¥${Math.round(this.performanceMetrics.bestHour.avgEarnings)}/ride)`,
        action: 'Focus driving during this time period'
      });
    }

    // Weather optimization
    const weatherData = this.performanceMetrics.weatherImpact;
    if (weatherData.rain && weatherData.clear) {
      const rainBonus = ((weatherData.rain.avgEarnings - weatherData.clear.avgEarnings) / weatherData.clear.avgEarnings) * 100;
      if (rainBonus > 20) {
        recommendations.push({
          type: 'weather',
          priority: 'medium',
          title: 'Rainy Day Opportunity',
          description: `Rain increases earnings by ${Math.round(rainBonus)}% on average`,
          action: 'Stay active during rainy weather'
        });
      }
    }

    // Location optimization
    const locationData = this.performanceMetrics.locationPerformance;
    const bestLocation = Object.entries(locationData).reduce((best, [location, data]) => 
      data.efficiency > (best.efficiency || 0) ? { location, ...data } : best
    , {});

    if (bestLocation.location) {
      recommendations.push({
        type: 'location',
        priority: 'high',
        title: 'Optimal Area Focus',
        description: `${bestLocation.location} shows best efficiency (¥${Math.round(bestLocation.efficiency)}/min)`,
        action: 'Prioritize this area for better earnings'
      });
    }

    // Trend-based recommendations
    const trend = this.performanceMetrics.recentTrend;
    if (trend === 'declining' || trend === 'strongly_declining') {
      recommendations.push({
        type: 'strategy',
        priority: 'high',
        title: 'Performance Improvement Needed',
        description: 'Recent earnings trend is declining',
        action: 'Review and adjust driving strategy'
      });
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  async saveData() {
    try {
      const data = {
        earningsHistory: this.earningsHistory,
        performanceMetrics: this.performanceMetrics
      };
      await AsyncStorage.setItem('earnings_analytics', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  }

  // Get chart data for visualization
  getChartData() {
    const dailyData = this.groupByDay();
    const last7Days = Object.entries(dailyData)
      .slice(-7)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
        earnings: data.total,
        rides: data.rides
      }));

    const hourlyData = this.groupByHour();
    const hourlyChart = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      earnings: hourlyData[hour]?.avgEarnings || 0
    }));

    const weatherData = this.performanceMetrics.weatherImpact;
    const weatherChart = Object.entries(weatherData).map(([weather, data]) => ({
      name: weather,
      earnings: data.avgEarnings,
      population: data.rides,
      color: this.getWeatherColor(weather),
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));

    return {
      daily: last7Days,
      hourly: hourlyChart,
      weather: weatherChart
    };
  }

  getWeatherColor(weather) {
    const colors = {
      clear: '#FFD700',
      cloudy: '#87CEEB',
      rain: '#4682B4',
      heavy_rain: '#191970',
      snow: '#F0F8FF',
      unknown: '#808080'
    };
    return colors[weather] || '#808080';
  }
}

// Advanced Earnings Analytics Component
const AdvancedEarningsAnalytics = () => {
  const [analytics] = useState(() => new EarningsAnalytics());
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({});
  const [predictions, setPredictions] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [chartData, setChartData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeAnalytics();
  }, []);

  const initializeAnalytics = async () => {
    setIsLoading(true);
    try {
      await analytics.initialize();
      
      // Add some sample data if no data exists
      if (analytics.earningsHistory.length === 0) {
        await generateSampleData();
      }
      
      updateDisplayData();
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleData = async () => {
    const sampleData = [
      { amount: 3200, area: 'Shibuya', weather: 'rain', waitTime: 3 },
      { amount: 2800, area: 'Shinjuku', weather: 'clear', waitTime: 7 },
      { amount: 4100, area: 'Ginza', weather: 'rain', waitTime: 2 },
      { amount: 2500, area: 'Tokyo Station', weather: 'cloudy', waitTime: 5 },
      { amount: 3600, area: 'Shibuya', weather: 'clear', waitTime: 4 },
      { amount: 4500, area: 'Roppongi', weather: 'rain', waitTime: 1 },
      { amount: 2900, area: 'Ueno', weather: 'clear', waitTime: 6 }
    ];

    for (const data of sampleData) {
      await analytics.addEarningsData(data);
    }
  };

  const updateDisplayData = () => {
    setMetrics(analytics.performanceMetrics);
    setPredictions(analytics.predictions);
    setRecommendations(analytics.getOptimizationRecommendations());
    setChartData(analytics.getChartData());
  };

  const handleAddEarningsData = async () => {
    const newData = {
      amount: Math.floor(Math.random() * 2000) + 2000, // 2000-4000 yen
      area: ['Shibuya', 'Shinjuku', 'Ginza', 'Tokyo Station'][Math.floor(Math.random() * 4)],
      weather: ['clear', 'cloudy', 'rain'][Math.floor(Math.random() * 3)],
      waitTime: Math.floor(Math.random() * 8) + 1
    };

    await analytics.addEarningsData(newData);
    updateDisplayData();

    Alert.alert(
      localeInfo.isJapanese ? '売上追加' : 'Earnings Added',
      localeInfo.isJapanese 
        ? `${formatCurrency(newData.amount)}の売上を記録しました`
        : `Recorded ${formatCurrency(newData.amount)} in earnings`
    );
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2196F3'
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? '分析データ読み込み中...' : 'Loading Analytics...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={styles.tabText}>
            {localeInfo.isJapanese ? '概要' : 'Overview'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'charts' && styles.activeTab]}
          onPress={() => setActiveTab('charts')}
        >
          <Text style={styles.tabText}>
            {localeInfo.isJapanese ? 'グラフ' : 'Charts'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={styles.tabText}>
            {localeInfo.isJapanese ? '提案' : 'Tips'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <View>
          {/* Key Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                {localeInfo.isJapanese ? '総売上' : 'Total Earnings'}
              </Text>
              <Text style={styles.metricValue}>
                {formatCurrency(metrics.totalEarnings || 0)}
              </Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                {localeInfo.isJapanese ? '平均/回' : 'Avg/Ride'}
              </Text>
              <Text style={styles.metricValue}>
                {formatCurrency(metrics.avgPerRide || 0)}
              </Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                {localeInfo.isJapanese ? '効率性' : 'Efficiency'}
              </Text>
              <Text style={styles.metricValue}>
                {formatCurrency(metrics.efficiency || 0)}/h
              </Text>
            </View>
          </View>

          {/* Predictions */}
          <View style={styles.predictionsCard}>
            <Text style={styles.sectionTitle}>
              📈 {localeInfo.isJapanese ? '売上予測' : 'Earnings Predictions'}
            </Text>
            
            <View style={styles.predictionRow}>
              <Text style={styles.predictionLabel}>
                {localeInfo.isJapanese ? '次の1時間' : 'Next Hour'}
              </Text>
              <Text style={styles.predictionValue}>
                {predictions.nextHour !== 'insufficient_data' 
                  ? formatCurrency(predictions.nextHour)
                  : (localeInfo.isJapanese ? 'データ不足' : 'Insufficient data')
                }
              </Text>
            </View>
            
            <View style={styles.predictionRow}>
              <Text style={styles.predictionLabel}>
                {localeInfo.isJapanese ? '今日' : 'Today'}
              </Text>
              <Text style={styles.predictionValue}>
                {predictions.today !== 'insufficient_data' 
                  ? formatCurrency(predictions.today)
                  : (localeInfo.isJapanese ? 'データ不足' : 'Insufficient data')
                }
              </Text>
            </View>
            
            <View style={styles.predictionRow}>
              <Text style={styles.predictionLabel}>
                {localeInfo.isJapanese ? '今週' : 'This Week'}
              </Text>
              <Text style={styles.predictionValue}>
                {predictions.thisWeek !== 'insufficient_data' 
                  ? formatCurrency(predictions.thisWeek)
                  : (localeInfo.isJapanese ? 'データ不足' : 'Insufficient data')
                }
              </Text>
            </View>
          </View>

          {/* Best Performance */}
          {metrics.bestHour && (
            <View style={styles.bestPerformanceCard}>
              <Text style={styles.sectionTitle}>
                🏆 {localeInfo.isJapanese ? '最高パフォーマンス' : 'Best Performance'}
              </Text>
              <Text style={styles.bestPerformanceText}>
                {localeInfo.isJapanese ? '最適な時間帯' : 'Best Hour'}: {metrics.bestHour.hour}:00
              </Text>
              <Text style={styles.bestPerformanceText}>
                {localeInfo.isJapanese ? '平均売上' : 'Average Earnings'}: {formatCurrency(metrics.bestHour.avgEarnings)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && chartData.daily && (
        <View>
          {/* Daily Earnings Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {localeInfo.isJapanese ? '日別売上（過去7日）' : 'Daily Earnings (Last 7 Days)'}
            </Text>
            <LineChart
              data={{
                labels: chartData.daily.map(d => d.date),
                datasets: [{
                  data: chartData.daily.map(d => d.earnings)
                }]
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Hourly Performance Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {localeInfo.isJapanese ? '時間別平均売上' : 'Hourly Average Earnings'}
            </Text>
            <BarChart
              data={{
                labels: ['6', '9', '12', '15', '18', '21'],
                datasets: [{
                  data: [6, 9, 12, 15, 18, 21].map(hour => 
                    chartData.hourly[hour]?.earnings || 0
                  )
                }]
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>

          {/* Weather Impact Chart */}
          {chartData.weather.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>
                {localeInfo.isJapanese ? '天気別売上' : 'Weather Impact on Earnings'}
              </Text>
              <PieChart
                data={chartData.weather}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor={'earnings'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                style={styles.chart}
              />
            </View>
          )}
        </View>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <View>
          <Text style={styles.sectionTitle}>
            💡 {localeInfo.isJapanese ? '売上向上の提案' : 'Optimization Recommendations'}
          </Text>
          
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <View style={[styles.priorityBadge, { 
                  backgroundColor: rec.priority === 'high' ? '#FF5722' : '#FF9800' 
                }]}>
                  <Text style={styles.priorityText}>
                    {rec.priority === 'high' 
                      ? (localeInfo.isJapanese ? '高' : 'HIGH')
                      : (localeInfo.isJapanese ? '中' : 'MED')
                    }
                  </Text>
                </View>
              </View>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
              <Text style={styles.recommendationAction}>
                💡 {rec.action}
              </Text>
            </View>
          ))}

          {recommendations.length === 0 && (
            <View style={styles.noRecommendationsCard}>
              <Text style={styles.noRecommendationsText}>
                {localeInfo.isJapanese 
                  ? 'より多くのデータが蓄積されると、個人化された提案を表示します'
                  : 'More personalized recommendations will appear as you use the app'
                }
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Add Sample Data Button */}
      <TouchableOpacity style={styles.addDataButton} onPress={handleAddEarningsData}>
        <Text style={styles.addDataButtonText}>
          📊 {localeInfo.isJapanese ? 'サンプルデータ追加' : 'Add Sample Data'}
        </Text>
      </TouchableOpacity>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  predictionsCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  predictionLabel: {
    fontSize: 14,
    color: '#666',
  },
  predictionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  bestPerformanceCard: {
    backgroundColor: '#E3F2FD',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
  },
  bestPerformanceText: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 5,
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recommendationCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recommendationAction: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
  },
  noRecommendationsCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  noRecommendationsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addDataButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addDataButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedEarningsAnalytics;