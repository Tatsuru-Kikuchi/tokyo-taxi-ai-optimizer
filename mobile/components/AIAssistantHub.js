import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '../localization/LocalizationContext';

const { width } = Dimensions.get('window');

// Advanced AI assistant for taxi optimization
class TaxiAIAssistant {
  constructor() {
    this.learningData = [];
    this.preferences = {};
    this.contextHistory = [];
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('ai_assistant_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.learningData = data.learningData || [];
        this.preferences = data.preferences || {};
        this.contextHistory = data.contextHistory || [];
      }
    } catch (error) {
      console.error('AI Assistant initialization error:', error);
    }
  }

  // Generate intelligent recommendations based on context
  generateRecommendations(context) {
    const recommendations = [];
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    const weather = context.weather || 'clear';
    const location = context.location || 'tokyo';

    // Time-based recommendations
    if (currentHour >= 7 && currentHour <= 9) {
      recommendations.push({
        type: 'timing',
        priority: 'high',
        title: 'Morning Rush Hour Strategy',
        message: 'Position near train stations and business districts for commuter pickups',
        action: 'Navigate to Shibuya or Shinjuku stations',
        icon: '🌅',
        confidence: 0.92
      });
    }

    if (currentHour >= 17 && currentHour <= 19) {
      recommendations.push({
        type: 'timing',
        priority: 'high',
        title: 'Evening Rush Hour Opportunity',
        message: 'High demand from business districts to residential areas',
        action: 'Focus on office building areas and major intersections',
        icon: '🌆',
        confidence: 0.89
      });
    }

    // Weather-based recommendations
    if (weather === 'rain' || weather === 'heavy_rain') {
      recommendations.push({
        type: 'weather',
        priority: 'high',
        title: 'Rain Surge Opportunity',
        message: 'Demand increases 40-60% during rainfall. Premium fares available.',
        action: 'Position near shopping areas and covered walkways',
        icon: '🌧️',
        confidence: 0.94
      });
    }

    // Weekend specific recommendations
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (currentHour >= 22) {
        recommendations.push({
          type: 'weekend',
          priority: 'medium',
          title: 'Weekend Nightlife Peak',
          message: 'Entertainment districts show high demand after 10 PM',
          action: 'Consider Roppongi, Shibuya, or Shinjuku entertainment areas',
          icon: '🌃',
          confidence: 0.87
        });
      }
    }

    // Learning-based recommendations
    const personalizedRecs = this.generatePersonalizedRecommendations();
    recommendations.push(...personalizedRecs);

    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  generatePersonalizedRecommendations() {
    const recommendations = [];
    
    // Analyze historical performance
    if (this.learningData.length > 10) {
      const bestPerformingHours = this.analyzeBestHours();
      const bestPerformingAreas = this.analyzeBestAreas();
      
      if (bestPerformingHours.length > 0) {
        recommendations.push({
          type: 'personalized',
          priority: 'medium',
          title: 'Your Peak Performance Time',
          message: `Your earnings are typically ${bestPerformingHours[0].improvement}% higher during ${bestPerformingHours[0].hour}:00`,
          action: 'Plan your schedule to maximize this time slot',
          icon: '⭐',
          confidence: 0.85
        });
      }

      if (bestPerformingAreas.length > 0) {
        recommendations.push({
          type: 'personalized',
          priority: 'medium',
          title: 'Your Best Performing Area',
          message: `${bestPerformingAreas[0].area} consistently shows your highest earnings`,
          action: `Consider focusing more time in ${bestPerformingAreas[0].area}`,
          icon: '📍',
          confidence: 0.83
        });
      }
    }

    return recommendations;
  }

  analyzeBestHours() {
    const hourlyData = {};
    
    this.learningData.forEach(data => {
      const hour = new Date(data.timestamp).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { total: 0, count: 0 };
      }
      hourlyData[hour].total += data.earnings || 0;
      hourlyData[hour].count++;
    });

    const hourlyAverages = Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      average: data.total / data.count,
      count: data.count
    })).filter(item => item.count >= 3); // Minimum 3 data points

    const overallAverage = hourlyAverages.reduce((sum, item) => sum + item.average, 0) / hourlyAverages.length;
    
    return hourlyAverages
      .filter(item => item.average > overallAverage)
      .map(item => ({
        hour: item.hour,
        improvement: Math.round(((item.average - overallAverage) / overallAverage) * 100)
      }))
      .sort((a, b) => b.improvement - a.improvement);
  }

  analyzeBestAreas() {
    const areaData = {};
    
    this.learningData.forEach(data => {
      const area = data.area || 'unknown';
      if (!areaData[area]) {
        areaData[area] = { total: 0, count: 0 };
      }
      areaData[area].total += data.earnings || 0;
      areaData[area].count++;
    });

    return Object.entries(areaData)
      .filter(([area, data]) => data.count >= 5) // Minimum 5 rides in area
      .map(([area, data]) => ({
        area,
        average: data.total / data.count,
        count: data.count
      }))
      .sort((a, b) => b.average - a.average);
  }

  // Smart tips based on current context and learning
  generateSmartTips(context) {
    const tips = [];
    const currentHour = new Date().getHours();
    
    // Dynamic tips based on context
    if (context.weather === 'clear' && currentHour >= 11 && currentHour <= 14) {
      tips.push({
        category: 'efficiency',
        tip: 'Lunch hours in business districts often have quick, short-distance rides',
        impact: 'Medium',
        timeRelevant: true
      });
    }

    if (context.weather === 'rain') {
      tips.push({
        category: 'strategy',
        tip: 'Position near covered areas like shopping malls and hotels during rain',
        impact: 'High',
        timeRelevant: true
      });
    }

    // General optimization tips
    const generalTips = [
      {
        category: 'fuel_efficiency',
        tip: 'Maintain steady speeds between 40-60 km/h for optimal fuel consumption',
        impact: 'Medium',
        timeRelevant: false
      },
      {
        category: 'customer_service',
        tip: 'Keep vehicle clean and offer phone chargers for higher ratings',
        impact: 'High',
        timeRelevant: false
      },
      {
        category: 'technology',
        tip: 'Use multiple ride-hailing apps simultaneously to maximize ride opportunities',
        impact: 'High',
        timeRelevant: false
      },
      {
        category: 'safety',
        tip: 'Take regular breaks every 2 hours to maintain alertness and safety',
        impact: 'Critical',
        timeRelevant: false
      }
    ];

    // Add random general tips
    const randomTips = generalTips.sort(() => 0.5 - Math.random()).slice(0, 2);
    tips.push(...randomTips);

    return tips;
  }

  // Learn from user interactions and outcomes
  async recordLearningData(data) {
    try {
      this.learningData.push({
        ...data,
        timestamp: Date.now()
      });

      // Keep only recent data (last 90 days)
      const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
      this.learningData = this.learningData.filter(item => item.timestamp > ninetyDaysAgo);

      await this.saveData();
    } catch (error) {
      console.error('Learning data recording error:', error);
    }
  }

  async saveData() {
    try {
      const data = {
        learningData: this.learningData,
        preferences: this.preferences,
        contextHistory: this.contextHistory
      };
      await AsyncStorage.setItem('ai_assistant_data', JSON.stringify(data));
    } catch (error) {
      console.error('AI Assistant data save error:', error);
    }
  }
}

// AI Assistant Component
const AIAssistantHub = () => {
  const [aiAssistant] = useState(() => new TaxiAIAssistant());
  const [recommendations, setRecommendations] = useState([]);
  const [smartTips, setSmartTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('recommendations');

  const { t, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeAI = async () => {
    setIsLoading(true);
    try {
      await aiAssistant.initialize();
      
      // Mock context for demonstration
      const context = {
        weather: 'clear',
        location: 'tokyo',
        currentEarnings: 15000,
        hoursWorked: 6
      };

      const recs = aiAssistant.generateRecommendations(context);
      setRecommendations(recs);

      const tips = aiAssistant.generateSmartTips(context);
      setSmartTips(tips);
    } catch (error) {
      console.error('AI initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationAction = async (recommendation) => {
    Alert.alert(
      recommendation.title,
      localeInfo.isJapanese 
        ? `この推奨事項を実行しますか？\n\n${recommendation.action}`
        : `Execute this recommendation?\n\n${recommendation.action}`,
      [
        { text: localeInfo.isJapanese ? 'キャンセル' : 'Cancel', style: 'cancel' },
        {
          text: localeInfo.isJapanese ? '実行' : 'Execute',
          onPress: () => {
            // Record user interaction for learning
            aiAssistant.recordLearningData({
              type: 'recommendation_accepted',
              recommendation: recommendation.type,
              confidence: recommendation.confidence
            });
            
            Alert.alert(
              localeInfo.isJapanese ? '実行中' : 'Executing',
              localeInfo.isJapanese 
                ? '推奨事項を実行しています...'
                : 'Executing recommendation...'
            );
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#2196F3';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Critical': return '#D32F2F';
      case 'High': return '#F57C00';
      case 'Medium': return '#388E3C';
      default: return '#1976D2';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? 'AI アシスタント初期化中...' : 'Initializing AI Assistant...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerIcon}>🤖</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? 'AI タクシーアシスタント' : 'AI Taxi Assistant'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {localeInfo.isJapanese 
              ? 'インテリジェントな最適化とパーソナライズされた推奨事項'
              : 'Intelligent optimization and personalized recommendations'
            }
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '推奨事項' : 'Recommendations'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            {localeInfo.isJapanese ? 'スマートヒント' : 'Smart Tips'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>
            💡 {localeInfo.isJapanese ? 'AI 推奨事項' : 'AI Recommendations'}
          </Text>
          
          {recommendations.map((rec, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendationCard}
              onPress={() => handleRecommendationAction(rec)}
            >
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.cardGradient}
              >
                <View style={styles.recommendationHeader}>
                  <Text style={styles.recommendationIcon}>{rec.icon}</Text>
                  <View style={styles.recommendationTitleSection}>
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(rec.priority) }]}>
                      <Text style={styles.priorityText}>
                        {rec.priority === 'high' 
                          ? (localeInfo.isJapanese ? '高' : 'HIGH')
                          : rec.priority === 'medium'
                          ? (localeInfo.isJapanese ? '中' : 'MED')
                          : (localeInfo.isJapanese ? '低' : 'LOW')
                        }
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.confidenceText}>
                    {(rec.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
                
                <Text style={styles.recommendationMessage}>{rec.message}</Text>
                <Text style={styles.recommendationAction}>
                  💡 {rec.action}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Smart Tips Tab */}
      {activeTab === 'tips' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>
            🧠 {localeInfo.isJapanese ? 'スマートヒント' : 'Smart Tips'}
          </Text>
          
          {smartTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipCategory}>
                  {tip.category.replace('_', ' ').toUpperCase()}
                </Text>
                <View style={[styles.impactBadge, { backgroundColor: getImpactColor(tip.impact) }]}>
                  <Text style={styles.impactText}>{tip.impact}</Text>
                </View>
              </View>
              <Text style={styles.tipText}>{tip.tip}</Text>
              {tip.timeRelevant && (
                <View style={styles.timeRelevantBadge}>
                  <Ionicons name="time" size={12} color="#FF9800" />
                  <Text style={styles.timeRelevantText}>
                    {localeInfo.isJapanese ? '時間関連' : 'Time Relevant'}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </Animated.View>
      )}

      {/* AI Learning Status */}
      <View style={styles.learningStatus}>
        <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.learningGradient}>
          <Text style={styles.learningTitle}>
            📚 {localeInfo.isJapanese ? 'AI 学習ステータス' : 'AI Learning Status'}
          </Text>
          <Text style={styles.learningText}>
            {localeInfo.isJapanese ? 'データポイント' : 'Data Points'}: {aiAssistant.learningData.length}
          </Text>
          <Text style={styles.learningText}>
            {localeInfo.isJapanese ? 
              'AIはあなたの運転パターンから継続的に学習し、パーソナライズされた推奨事項を提供します。' :
              'AI continuously learns from your driving patterns to provide personalized recommendations.'
            }
          </Text>
        </LinearGradient>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={initializeAI}>
        <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.refreshGradient}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.refreshText}>
            {localeInfo.isJapanese ? '推奨事項を更新' : 'Refresh Recommendations'}
          </Text>
        </LinearGradient>
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
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
    marginBottom: 15,
  },
  recommendationCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recommendationTitleSection: {
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
  confidenceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recommendationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  recommendationAction: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
  },
  tipCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  impactText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  timeRelevantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  timeRelevantText: {
    fontSize: 10,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  learningStatus: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  learningGradient: {
    padding: 20,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  learningText: {
    fontSize: 12,
    color: 'white',
    marginBottom: 5,
    lineHeight: 16,
  },
  refreshButton: {
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  refreshGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AIAssistantHub;