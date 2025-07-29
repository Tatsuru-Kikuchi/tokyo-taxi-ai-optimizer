import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from './localization/LocalizationContext';

const { width, height } = Dimensions.get('window');

const PassengerWeatherApp = () => {
  const { t, formatCurrency, getCurrentLocaleInfo, formatTime } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState({
    condition: 'Heavy Rain',
    intensity: 85,
    temperature: 18,
    expectedDuration: 120, // minutes
    stopTime: '15:30',
    description: localeInfo.isJapanese ? '激しい雷雨を伴う大雨' : 'Heavy rain with occasional thunderstorms'
  });

  const [transportOptions, setTransportOptions] = useState({
    taxi: {
      available: true,
      waitTime: 4,
      estimatedCost: 1240,
      surge: 1.8,
      weatherPremium: 340
    },
    train: {
      available: true,
      walkTime: 8,
      wetWalkDistance: 600,
      cost: 210,
      crowdLevel: localeInfo.isJapanese ? '非常に混雑' : 'Very High'
    },
    bus: {
      available: true,
      waitTime: 12,
      walkTime: 5,
      cost: 180,
      delayRisk: localeInfo.isJapanese ? '高' : 'High'
    },
    wait: {
      estimatedWaitTime: 120,
      comfortLocation: localeInfo.isJapanese ? '近くのコーヒーショップ' : 'Coffee shop nearby',
      costSavings: 1060
    }
  });

  const [recommendations, setRecommendations] = useState([
    {
      option: localeInfo.isJapanese ? '今すぐタクシーを利用' : 'Take Taxi Now',
      score: 92,
      reasoning: localeInfo.isJapanese 
        ? '高い快適性、即座の利用可能性、大雨時のプレミアム料金に見合う価値'
        : 'High comfort, immediate availability, worth the premium during heavy rain',
      costBreakdown: localeInfo.isJapanese 
        ? `基本料金 ${formatCurrency(1240)} + 天気割増 ${formatCurrency(340)} = ${formatCurrency(1580)}`
        : `Base fare ${formatCurrency(1240)} + weather premium ${formatCurrency(340)} = ${formatCurrency(1580)}`,
      pros: localeInfo.isJapanese 
        ? ['即座の出発', '乾燥して快適', '直接ルート']
        : ['Immediate departure', 'Dry and comfortable', 'Direct route'],
      cons: localeInfo.isJapanese 
        ? ['天候による高額料金', '1.8倍のサージ料金']
        : ['Higher cost due to weather', '1.8x surge pricing'],
      timeToDestination: localeInfo.isJapanese ? '18分' : '18 minutes',
      priority: 'High'
    },
    {
      option: localeInfo.isJapanese ? '天候改善を待つ' : 'Wait for Weather to Improve',
      score: 76,
      reasoning: localeInfo.isJapanese 
        ? '快適に2時間待てれば大幅な節約が可能'
        : 'Significant cost savings if you can wait 2 hours in comfort',
      costBreakdown: localeInfo.isJapanese 
        ? `節約 ${formatCurrency(1060)} + コーヒー代 ${formatCurrency(400)} = 純節約 ${formatCurrency(660)}`
        : `Save ${formatCurrency(1060)} + coffee/comfort cost ${formatCurrency(400)} = Net savings ${formatCurrency(660)}`,
      pros: localeInfo.isJapanese 
        ? ['大幅な節約', 'コーヒーショップ利用可能', '雨は止む予定']
        : ['Major cost savings', 'Coffee shop available', 'Rain will stop'],
      cons: localeInfo.isJapanese 
        ? ['2時間の遅れ', '会議に影響の可能性']
        : ['2-hour delay', 'Meeting might be affected'],
      timeToDestination: localeInfo.isJapanese ? '2時間20分（待機時間込み）' : '2h 20min (including wait)',
      priority: 'Medium'
    },
    {
      option: localeInfo.isJapanese ? '電車を利用（傘持参）' : 'Use Train (with umbrella)',
      score: 45,
      reasoning: localeInfo.isJapanese 
        ? '最も安価だが現在の天候では非常に不快'
        : 'Cheapest option but very uncomfortable in current weather',
      costBreakdown: localeInfo.isJapanese 
        ? `電車料金 ${formatCurrency(210)} + 傘・不快感コスト`
        : `Train fare ${formatCurrency(210)} + umbrella/discomfort cost`,
      pros: localeInfo.isJapanese 
        ? ['最低料金', '信頼できる時間']
        : ['Lowest cost', 'Reliable timing'],
      cons: localeInfo.isJapanese 
        ? ['大雨中8分の徒歩', '非常に混雑', '濡れる可能性']
        : ['8-minute walk in heavy rain', 'Very crowded', 'Will get wet'],
      timeToDestination: localeInfo.isJapanese ? '35分' : '35 minutes',
      priority: 'Low'
    }
  ]);

  const [decisionFactors, setDecisionFactors] = useState({
    urgency: 'Medium', // High, Medium, Low
    budget: 'Flexible', // Tight, Moderate, Flexible
    weatherTolerance: 'Low', // High, Medium, Low
    comfortPriority: 'High' // High, Medium, Low
  });

  useEffect(() => {
    getCurrentLocation();
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('alerts.permissionDenied'), t('alerts.locationRequired'));
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert(t('common.error'), 'Could not get your location');
    }
  };

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setTransportOptions(prev => ({
      ...prev,
      taxi: {
        ...prev.taxi,
        waitTime: Math.max(2, prev.taxi.waitTime + (Math.random() - 0.5) * 2),
        surge: Math.max(1.2, prev.taxi.surge + (Math.random() - 0.5) * 0.2)
      }
    }));

    setWeatherData(prev => ({
      ...prev,
      expectedDuration: Math.max(30, prev.expectedDuration - 1),
      intensity: Math.max(20, prev.intensity + (Math.random() - 0.5) * 5)
    }));
  };

  const makeDecision = (option) => {
    const title = localeInfo.isJapanese ? '選択の確認' : 'Confirm Choice';
    const message = localeInfo.isJapanese 
      ? `選択されました: ${option}\n\n続行しますか？`
      : `You selected: ${option}\n\nWould you like to proceed?`;
    
    Alert.alert(
      title,
      message,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.proceed'), onPress: () => executeDecision(option) }
      ]
    );
  };

  const executeDecision = (option) => {
    let message = '';
    if (option.includes('Taxi') || option.includes('タクシー')) {
      message = t('alerts.taxiBooked');
    } else if (option.includes('Wait') || option.includes('待つ')) {
      message = t('alerts.waitingMode');
    } else if (option.includes('Train') || option.includes('電車')) {
      message = t('alerts.trainRoute');
    }
    Alert.alert(t('common.success'), message);
  };

  const adjustDecisionFactors = (factor, value) => {
    setDecisionFactors(prev => ({
      ...prev,
      [factor]: value
    }));
    
    const message = localeInfo.isJapanese 
      ? '設定が更新されました。推奨内容が新しい設定に基づいて更新されました。'
      : 'Preferences updated. Recommendations have been updated based on your preferences.';
    Alert.alert(t('common.success'), message);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with current weather */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('passengerApp.header.title')}</Text>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherCondition}>
              {localeInfo.isJapanese ? '大雨' : weatherData.condition}
            </Text>
            <Text style={styles.weatherDetails}>
              {t('passengerApp.header.intensity')}: {weatherData.intensity}% | {weatherData.temperature}°C
            </Text>
            <Text style={styles.weatherDuration}>
              {t('passengerApp.header.expectedToStop')}: {weatherData.stopTime} ({weatherData.expectedDuration} {t('common.minutes')})
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick decision buttons */}
      <View style={styles.quickDecisionContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.quickDecision.title')}</Text>
        <View style={styles.quickButtons}>
          <TouchableOpacity 
            style={[styles.quickButton, styles.taxiButton]}
            onPress={() => makeDecision(recommendations[0].option)}
          >
            <Text style={styles.quickButtonIcon}>🚕</Text>
            <Text style={styles.quickButtonText}>{t('passengerApp.quickDecision.takeTaxi')}</Text>
            <Text style={styles.quickButtonSubtext}>{formatCurrency(transportOptions.taxi.estimatedCost + transportOptions.taxi.weatherPremium)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickButton, styles.waitButton]}
            onPress={() => makeDecision(recommendations[1].option)}
          >
            <Text style={styles.quickButtonIcon}>⏰</Text>
            <Text style={styles.quickButtonText}>{t('passengerApp.quickDecision.waitOut')}</Text>
            <Text style={styles.quickButtonSubtext}>{weatherData.expectedDuration} {t('common.minutes')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickButton, styles.trainButton]}
            onPress={() => makeDecision(recommendations[2].option)}
          >
            <Text style={styles.quickButtonIcon}>🚊</Text>
            <Text style={styles.quickButtonText}>{t('passengerApp.quickDecision.useTrain')}</Text>
            <Text style={styles.quickButtonSubtext}>{formatCurrency(transportOptions.train.cost)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detailed recommendations */}
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.recommendations.title')}</Text>
        {recommendations.map((rec, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.recommendationCard}
            onPress={() => makeDecision(rec.option)}
          >
            <View style={styles.recHeader}>
              <Text style={styles.recOption}>{rec.option}</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{rec.score}%</Text>
                <Text style={styles.scoreLabel}>{t('passengerApp.recommendations.match')}</Text>
              </View>
            </View>
            
            <Text style={styles.recReasoning}>{rec.reasoning}</Text>
            <Text style={styles.recCost}>{rec.costBreakdown}</Text>
            
            <View style={styles.prosConsContainer}>
              <View style={styles.prosContainer}>
                <Text style={styles.prosConsTitle}>{t('passengerApp.recommendations.pros')}</Text>
                {rec.pros.map((pro, i) => (
                  <Text key={i} style={styles.prosConsItem}>• {pro}</Text>
                ))}
              </View>
              
              <View style={styles.consContainer}>
                <Text style={styles.prosConsTitle}>{t('passengerApp.recommendations.cons')}</Text>
                {rec.cons.map((con, i) => (
                  <Text key={i} style={styles.prosConsItem}>• {con}</Text>
                ))}
              </View>
            </View>
            
            <View style={styles.recFooter}>
              <Text style={styles.recTime}>⏱️ {rec.timeToDestination}</Text>
              <Text style={[styles.recPriority, { 
                color: rec.priority === 'High' ? '#4CAF50' : rec.priority === 'Medium' ? '#FF9800' : '#757575' 
              }]}>
                {rec.priority === 'High' ? (localeInfo.isJapanese ? '高優先度' : 'High Priority') : 
                 rec.priority === 'Medium' ? (localeInfo.isJapanese ? '中優先度' : 'Medium Priority') :
                 (localeInfo.isJapanese ? '低優先度' : 'Low Priority')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Live transport status */}
      <View style={styles.transportStatusContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.transportStatus.title')}</Text>
        
        <View style={styles.transportOption}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportIcon}>🚕</Text>
            <Text style={styles.transportName}>{t('passengerApp.transportStatus.taxi')}</Text>
            <Text style={styles.transportStatus}>{t('passengerApp.transportStatus.available')}</Text>
          </View>
          <View style={styles.transportDetails}>
            <Text style={styles.transportDetail}>{t('passengerApp.transportStatus.wait')}: {transportOptions.taxi.waitTime} {t('common.minutes')}</Text>
            <Text style={styles.transportDetail}>{t('passengerApp.transportStatus.cost')}: {formatCurrency(transportOptions.taxi.estimatedCost + transportOptions.taxi.weatherPremium)}</Text>
            <Text style={styles.transportSurge}>⚡ {transportOptions.taxi.surge}x {localeInfo.isJapanese ? 'サージ料金' : 'surge pricing'}</Text>
          </View>
        </View>

        <View style={styles.transportOption}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportIcon}>🚊</Text>
            <Text style={styles.transportName}>{t('passengerApp.transportStatus.train')}</Text>
            <Text style={styles.transportStatus}>{t('passengerApp.transportStatus.running')}</Text>
          </View>
          <View style={styles.transportDetails}>
            <Text style={styles.transportDetail}>{t('passengerApp.transportStatus.walk')}: {transportOptions.train.walkTime} {t('common.minutes')} {localeInfo.isJapanese ? '雨中' : 'in rain'}</Text>
            <Text style={styles.transportDetail}>{t('passengerApp.transportStatus.cost')}: {formatCurrency(transportOptions.train.cost)}</Text>
            <Text style={styles.transportCrowd}>👥 {transportOptions.train.crowdLevel} {localeInfo.isJapanese ? '' : 'crowds'}</Text>
          </View>
        </View>

        <View style={styles.transportOption}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportIcon}>🚌</Text>
            <Text style={styles.transportName}>{t('passengerApp.transportStatus.bus')}</Text>
            <Text style={styles.transportStatus}>{t('passengerApp.transportStatus.delayed')}</Text>
          </View>
          <View style={styles.transportDetails}>
            <Text style={styles.transportDetail}>{t('passengerApp.transportStatus.wait')}: {transportOptions.bus.waitTime} {t('common.minutes')}</Text>
            <Text style={styles.transportDetail}>{t('passengerApp.transportStatus.cost')}: {formatCurrency(transportOptions.bus.cost)}</Text>
            <Text style={styles.transportDelay}>⚠️ {transportOptions.bus.delayRisk} {localeInfo.isJapanese ? '遅延リスク' : 'delay risk'}</Text>
          </View>
        </View>
      </View>

      {/* Weather forecast */}
      <View style={styles.forecastContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.forecast.title')}</Text>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>{t('passengerApp.forecast.next3Hours')}</Text>
          <View style={styles.forecastTimeline}>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>{t('passengerApp.forecast.now')}</Text>
              <Text style={styles.forecastIcon}>🌧️</Text>
              <Text style={styles.forecastIntensity}>{t('passengerApp.forecast.heavy')}</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>+1h</Text>
              <Text style={styles.forecastIcon}>🌦️</Text>
              <Text style={styles.forecastIntensity}>{t('passengerApp.forecast.moderate')}</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>+2h</Text>
              <Text style={styles.forecastIcon}>☁️</Text>
              <Text style={styles.forecastIntensity}>{t('passengerApp.forecast.light')}</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>+3h</Text>
              <Text style={styles.forecastIcon}>⛅</Text>
              <Text style={styles.forecastIntensity}>{t('passengerApp.forecast.clear')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Preference adjustments */}
      <View style={styles.preferencesContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.preferences.title')}</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>{t('passengerApp.preferences.urgencyLevel')}</Text>
          <View style={styles.preferenceButtons}>
            {[t('passengerApp.preferences.low'), t('passengerApp.preferences.medium'), t('passengerApp.preferences.high')].map((level, index) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.preferenceButton,
                  decisionFactors.urgency === ['Low', 'Medium', 'High'][index] && styles.preferenceButtonActive
                ]}
                onPress={() => adjustDecisionFactors('urgency', ['Low', 'Medium', 'High'][index])}
              >
                <Text style={[
                  styles.preferenceButtonText,
                  decisionFactors.urgency === ['Low', 'Medium', 'High'][index] && styles.preferenceButtonTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>{t('passengerApp.preferences.budgetFlexibility')}</Text>
          <View style={styles.preferenceButtons}>
            {[t('passengerApp.preferences.tight'), t('passengerApp.preferences.moderate'), t('passengerApp.preferences.flexible')].map((budget, index) => (
              <TouchableOpacity
                key={budget}
                style={[
                  styles.preferenceButton,
                  decisionFactors.budget === ['Tight', 'Moderate', 'Flexible'][index] && styles.preferenceButtonActive
                ]}
                onPress={() => adjustDecisionFactors('budget', ['Tight', 'Moderate', 'Flexible'][index])}
              >
                <Text style={[
                  styles.preferenceButtonText,
                  decisionFactors.budget === ['Tight', 'Moderate', 'Flexible'][index] && styles.preferenceButtonTextActive
                ]}>
                  {budget}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Cost comparison */}
      <View style={styles.costComparisonContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.costComparison.title')}</Text>
        <View style={styles.costGrid}>
          <View style={styles.costCard}>
            <Text style={styles.costOption}>🚕 {t('passengerApp.transportStatus.taxi')}</Text>
            <Text style={styles.costAmount}>{formatCurrency(transportOptions.taxi.estimatedCost + transportOptions.taxi.weatherPremium)}</Text>
            <Text style={styles.costNote}>{t('passengerApp.costComparison.weatherPremium')}</Text>
          </View>
          
          <View style={styles.costCard}>
            <Text style={styles.costOption}>🚊 {t('passengerApp.transportStatus.train')}</Text>
            <Text style={styles.costAmount}>{formatCurrency(transportOptions.train.cost)}</Text>
            <Text style={styles.costNote}>{t('passengerApp.costComparison.discomfortCost')}</Text>
          </View>
          
          <View style={styles.costCard}>
            <Text style={styles.costOption}>⏰ {t('passengerApp.quickDecision.waitOut')}</Text>
            <Text style={styles.costAmount}>{formatCurrency(400)}</Text>
            <Text style={styles.costNote}>{t('passengerApp.costComparison.coffeeTime')}</Text>
          </View>
        </View>
      </View>

      {/* Emergency contacts */}
      <View style={styles.emergencyContainer}>
        <Text style={styles.sectionTitle}>{t('passengerApp.emergency.title')}</Text>
        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={() => Alert.alert(t('common.success'), t('alerts.emergencyTaxi'))}
        >
          <Text style={styles.emergencyButtonText}>{t('passengerApp.emergency.bookTaxi')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={() => Alert.alert(t('common.success'), t('alerts.shelterFound'))}
        >
          <Text style={styles.emergencyButtonText}>{t('passengerApp.emergency.findShelter')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  weatherCondition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  weatherDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  weatherDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  quickDecisionContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
  },
  taxiButton: {
    backgroundColor: '#2196F3',
  },
  waitButton: {
    backgroundColor: '#FF9800',
  },
  trainButton: {
    backgroundColor: '#4CAF50',
  },
  quickButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  quickButtonSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    marginTop: 2,
  },
  recommendationsContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recOption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  recReasoning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  recCost: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 12,
  },
  prosConsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  prosContainer: {
    flex: 1,
    marginRight: 10,
  },
  consContainer: {
    flex: 1,
  },
  prosConsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  prosConsItem: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recTime: {
    fontSize: 12,
    color: '#666',
  },
  recPriority: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  transportStatusContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transportOption: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  transportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transportIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  transportName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  transportStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  transportDetails: {
    paddingLeft: 30,
  },
  transportDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  transportSurge: {
    fontSize: 11,
    color: '#FF5722',
    fontWeight: 'bold',
  },
  transportCrowd: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  transportDelay: {
    fontSize: 11,
    color: '#FF5722',
    fontWeight: 'bold',
  },
  forecastContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  forecastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  forecastTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
  },
  forecastTime: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  forecastIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  forecastIntensity: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  preferencesContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceItem: {
    marginBottom: 15,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  preferenceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  preferenceButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  preferenceButtonActive: {
    backgroundColor: '#2196F3',
  },
  preferenceButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  preferenceButtonTextActive: {
    color: 'white',
  },
  costComparisonContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  costGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  costOption: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  costAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 3,
  },
  costNote: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
  },
  emergencyContainer: {
    margin: 15,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PassengerWeatherApp;