import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useLocalization } from '../localization/LocalizationContext';

const { width } = Dimensions.get('window');

// Advanced Driver Performance Analytics System
class DriverPerformanceAnalyzer {
  constructor() {
    this.performanceData = [];
    this.goals = {};
    this.achievements = [];
    this.personalBests = {};
    this.weeklyStats = [];
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('driver_performance_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.performanceData = data.performanceData || [];
        this.goals = data.goals || {};
        this.achievements = data.achievements || [];
        this.personalBests = data.personalBests || {};
        this.weeklyStats = data.weeklyStats || [];
      }
      
      if (this.performanceData.length === 0) {
        this.generateSampleData();
      }
      
      this.calculateAnalytics();
    } catch (error) {
      console.error('Driver performance initialization error:', error);
    }
  }

  generateSampleData() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - (i * oneDay));
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const baseEarnings = isWeekend ? 18000 : 15000;
      const variation = (Math.random() - 0.5) * 6000;
      const earnings = Math.max(8000, baseEarnings + variation);
      
      const hoursWorked = 8 + (Math.random() * 4);
      const ridesCompleted = Math.floor(hoursWorked * (1.5 + Math.random()));
      const customerRating = 4.2 + (Math.random() * 0.8);
      
      this.performanceData.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        earnings: Math.round(earnings),
        hoursWorked: Math.round(hoursWorked * 10) / 10,
        ridesCompleted,
        customerRating: Math.round(customerRating * 10) / 10,
        earningsPerHour: Math.round(earnings / hoursWorked),
        earningsPerRide: Math.round(earnings / ridesCompleted)
      });
    }
    
    this.goals = {
      dailyEarnings: 20000,
      dailyHours: 10,
      weeklyEarnings: 140000,
      customerRating: 4.8,
      ridesPerDay: 15
    };
  }

  calculateAnalytics() {
    if (this.performanceData.length === 0) return;

    this.personalBests = {
      bestDailyEarnings: Math.max(...this.performanceData.map(d => d.earnings)),
      bestHourlyRate: Math.max(...this.performanceData.map(d => d.earningsPerHour)),
      bestCustomerRating: Math.max(...this.performanceData.map(d => d.customerRating)),
      mostRidesInDay: Math.max(...this.performanceData.map(d => d.ridesCompleted))
    };

    this.checkAchievements();
    this.calculatePerformanceTrends();
  }

  checkAchievements() {
    const newAchievements = [];
    const last7Days = this.performanceData.slice(-7);
    
    const achievements = [
      {
        id: 'efficiency_master',
        title: 'Efficiency Master',
        description: 'Maintain 4.5+ rating for 7 days',
        icon: '⭐',
        check: () => last7Days.every(day => day.customerRating >= 4.5)
      },
      {
        id: 'earnings_streak',
        title: 'Earnings Streak',
        description: '7 days exceeding daily goal',
        icon: '💰',
        check: () => last7Days.every(day => day.earnings >= this.goals.dailyEarnings)
      },
      {
        id: 'consistency_champion',
        title: 'Consistency Champion',
        description: 'Complete 15+ rides for 5 days',
        icon: '🏆',
        check: () => last7Days.filter(day => day.ridesCompleted >= 15).length >= 5
      }
    ];

    achievements.forEach(achievement => {
      if (achievement.check() && !this.achievements.some(a => a.id === achievement.id)) {
        newAchievements.push({
          ...achievement,
          earnedDate: Date.now()
        });
      }
    });

    this.achievements = [...this.achievements, ...newAchievements];
    return newAchievements;
  }

  calculatePerformanceTrends() {
    const recent = this.performanceData.slice(-14);
    const firstHalf = recent.slice(0, 7);
    const secondHalf = recent.slice(7);

    const trends = {};
    const metrics = ['earnings', 'customerRating', 'earningsPerHour'];
    
    metrics.forEach(metric => {
      const firstAvg = firstHalf.reduce((sum, day) => sum + day[metric], 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, day) => sum + day[metric], 0) / secondHalf.length;
      
      const change = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      trends[metric] = {
        change: change,
        trend: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable'
      };
    });

    this.performanceTrends = trends;
  }

  getGoalProgress() {
    const today = this.performanceData[this.performanceData.length - 1];
    if (!today) return {};

    return {
      dailyEarnings: {
        current: today.earnings,
        target: this.goals.dailyEarnings,
        progress: (today.earnings / this.goals.dailyEarnings) * 100
      },
      customerRating: {
        current: today.customerRating,
        target: this.goals.customerRating,
        progress: (today.customerRating / this.goals.customerRating) * 100
      },
      ridesCompleted: {
        current: today.ridesCompleted,
        target: this.goals.ridesPerDay,
        progress: (today.ridesCompleted / this.goals.ridesPerDay) * 100
      }
    };
  }

  async saveData() {
    try {
      const data = {
        performanceData: this.performanceData,
        goals: this.goals,
        achievements: this.achievements,
        personalBests: this.personalBests,
        weeklyStats: this.weeklyStats
      };
      await AsyncStorage.setItem('driver_performance_data', JSON.stringify(data));
    } catch (error) {
      console.error('Driver performance data save error:', error);
    }
  }
}

// Driver Performance Analytics Component
const DriverPerformanceAnalytics = () => {
  const [performanceAnalyzer] = useState(() => new DriverPerformanceAnalyzer());
  const [performanceData, setPerformanceData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [personalBests, setPersonalBests] = useState({});
  const [goalProgress, setGoalProgress] = useState({});
  const [performanceTrends, setPerformanceTrends] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [fadeAnim] = useState(new Animated.Value(0));

  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializePerformanceAnalyzer();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializePerformanceAnalyzer = async () => {
    setIsLoading(true);
    try {
      await performanceAnalyzer.initialize();
      setPerformanceData(performanceAnalyzer.performanceData);
      setAchievements(performanceAnalyzer.achievements);
      setPersonalBests(performanceAnalyzer.personalBests);
      setGoalProgress(performanceAnalyzer.getGoalProgress());
      setPerformanceTrends(performanceAnalyzer.performanceTrends || {});
    } catch (error) {
      console.error('Performance analyzer initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEarningsChartData = () => {
    const last14Days = performanceData.slice(-14);
    return {
      labels: last14Days.map(day => {
        const date = new Date(day.timestamp);
        return date.getDate().toString();
      }),
      datasets: [{
        data: last14Days.map(day => day.earnings)
      }]
    };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#4CAF50';
      case 'declining': return '#F44336';
      case 'stable': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return '#4CAF50';
    if (progress >= 80) return '#8BC34A';
    if (progress >= 60) return '#FFC107';
    if (progress >= 40) return '#FF9800';
    return '#F44336';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? 'パフォーマンスデータ分析中...' : 'Analyzing performance data...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? 'ドライバーパフォーマンス分析' : 'Driver Performance Analytics'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {localeInfo.isJapanese 
              ? '詳細な運転成績分析と改善提案'
              : 'Detailed driving performance analysis and improvement insights'
            }
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Tab Navigation */}
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
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[styles.tabText, activeTab === 'goals' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '目標' : 'Goals'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '達成' : 'Achievements'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Personal Bests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏆 {localeInfo.isJapanese ? '自己ベスト記録' : 'Personal Best Records'}
            </Text>
            
            <View style={styles.bestsGrid}>
              <View style={styles.bestCard}>
                <Text style={styles.bestValue}>
                  {formatCurrency(personalBests.bestDailyEarnings || 0)}
                </Text>
                <Text style={styles.bestLabel}>
                  {localeInfo.isJapanese ? '最高日収' : 'Best Daily Earnings'}
                </Text>
              </View>
              
              <View style={styles.bestCard}>
                <Text style={styles.bestValue}>
                  {formatCurrency(personalBests.bestHourlyRate || 0)}
                </Text>
                <Text style={styles.bestLabel}>
                  {localeInfo.isJapanese ? '最高時給' : 'Best Hourly Rate'}
                </Text>
              </View>
              
              <View style={styles.bestCard}>
                <Text style={styles.bestValue}>
                  {(personalBests.bestCustomerRating || 0).toFixed(1)}⭐
                </Text>
                <Text style={styles.bestLabel}>
                  {localeInfo.isJapanese ? '最高評価' : 'Best Rating'}
                </Text>
              </View>
              
              <View style={styles.bestCard}>
                <Text style={styles.bestValue}>
                  {personalBests.mostRidesInDay || 0}
                </Text>
                <Text style={styles.bestLabel}>
                  {localeInfo.isJapanese ? '最多乗車回数' : 'Most Rides/Day'}
                </Text>
              </View>
            </View>
          </View>

          {/* Earnings Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              💰 {localeInfo.isJapanese ? '収益トレンド (過去14日)' : 'Earnings Trend (Last 14 Days)'}
            </Text>
            
            {performanceData.length > 0 && (
              <View style={styles.chartContainer}>
                <LineChart
                  data={getEarningsChartData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}
          </View>

          {/* Performance Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📈 {localeInfo.isJapanese ? 'パフォーマンストレンド' : 'Performance Trends'}
            </Text>
            
            {Object.entries(performanceTrends).map(([metric, trend]) => (
              <View key={metric} style={styles.trendCard}>
                <View style={styles.trendHeader}>
                  <Text style={styles.trendMetric}>
                    {metric === 'earnings' 
                      ? (localeInfo.isJapanese ? '収益' : 'Earnings')
                      : metric === 'customerRating'
                      ? (localeInfo.isJapanese ? '顧客評価' : 'Customer Rating')
                      : (localeInfo.isJapanese ? '時給' : 'Hourly Rate')
                    }
                  </Text>
                  <Text style={styles.trendIcon}>{getTrendIcon(trend.trend)}</Text>
                </View>
                <Text style={[styles.trendValue, { color: getTrendColor(trend.trend) }]}>
                  {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🎯 {localeInfo.isJapanese ? '今日の目標進捗' : "Today's Goal Progress"}
            </Text>
            
            {Object.entries(goalProgress).map(([goal, data]) => (
              <View key={goal} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>
                    {goal === 'dailyEarnings' 
                      ? (localeInfo.isJapanese ? '日収目標' : 'Daily Earnings')
                      : goal === 'customerRating'
                      ? (localeInfo.isJapanese ? '顧客評価' : 'Customer Rating')
                      : (localeInfo.isJapanese ? '乗車回数' : 'Rides Completed')
                    }
                  </Text>
                  <Text style={styles.goalProgress}>
                    {Math.round(data.progress)}%
                  </Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${Math.min(100, data.progress)}%`,
                        backgroundColor: getProgressColor(data.progress)
                      }
                    ]} 
                  />
                </View>
                
                <View style={styles.goalValues}>
                  <Text style={styles.goalCurrent}>
                    {goal === 'dailyEarnings' 
                      ? formatCurrency(data.current)
                      : data.current.toFixed(goal === 'customerRating' ? 1 : 0)
                    }
                  </Text>
                  <Text style={styles.goalTarget}>
                    / {goal === 'dailyEarnings' 
                      ? formatCurrency(data.target)
                      : data.target.toFixed(goal === 'customerRating' ? 1 : 0)
                    }
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏅 {localeInfo.isJapanese ? '獲得した実績' : 'Earned Achievements'}
            </Text>
            
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={styles.achievementDate}>
                      {localeInfo.isJapanese ? '獲得日' : 'Earned'}: {new Date(achievement.earnedDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                {localeInfo.isJapanese ? 'まだ実績を獲得していません' : 'No achievements earned yet'}
              </Text>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
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
    backgroundColor: '#2196F3',
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
  bestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bestCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bestValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  bestLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  trendCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  trendMetric: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  trendIcon: {
    fontSize: 20,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  goalValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCurrent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  goalTarget: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  achievementCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default DriverPerformanceAnalytics;