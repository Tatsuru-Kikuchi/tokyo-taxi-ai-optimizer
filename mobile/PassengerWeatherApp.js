import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const PassengerWeatherApp = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState({
    condition: 'Heavy Rain',
    intensity: 85,
    temperature: 18,
    expectedDuration: 120, // minutes
    stopTime: '15:30',
    description: 'Heavy rain with occasional thunderstorms'
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
      crowdLevel: 'Very High'
    },
    bus: {
      available: true,
      waitTime: 12,
      walkTime: 5,
      cost: 180,
      delayRisk: 'High'
    },
    wait: {
      estimatedWaitTime: 120,
      comfortLocation: 'Coffee shop nearby',
      costSavings: 1060
    }
  });

  const [recommendations, setRecommendations] = useState([
    {
      option: 'Take Taxi Now',
      score: 92,
      reasoning: 'High comfort, immediate availability, worth the premium during heavy rain',
      costBreakdown: 'Base fare ¥1,240 + weather premium ¥340 = ¥1,580',
      pros: ['Immediate departure', 'Dry and comfortable', 'Direct route'],
      cons: ['Higher cost due to weather', '1.8x surge pricing'],
      timeToDestination: '18 minutes',
      priority: 'High'
    },
    {
      option: 'Wait for Weather to Improve',
      score: 76,
      reasoning: 'Significant cost savings if you can wait 2 hours in comfort',
      costBreakdown: 'Save ¥1,060 + coffee/comfort cost ¥400 = Net savings ¥660',
      pros: ['Major cost savings', 'Coffee shop available', 'Rain will stop'],
      cons: ['2-hour delay', 'Meeting might be affected'],
      timeToDestination: '2h 20min (including wait)',
      priority: 'Medium'
    },
    {
      option: 'Use Train (with umbrella)',
      score: 45,
      reasoning: 'Cheapest option but very uncomfortable in current weather',
      costBreakdown: 'Train fare ¥210 + umbrella/discomfort cost',
      pros: ['Lowest cost', 'Reliable timing'],
      cons: ['8-minute walk in heavy rain', 'Very crowded', 'Will get wet'],
      timeToDestination: '35 minutes',
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
        Alert.alert('Permission needed', 'Location access required for weather-based recommendations');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not get your location');
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
    Alert.alert(
      'Confirm Choice',
      `You selected: ${option}\n\nWould you like to proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => executeDecision(option) }
      ]
    );
  };

  const executeDecision = (option) => {
    switch (option) {
      case 'Take Taxi Now':
        Alert.alert('Taxi Booked', 'A taxi has been requested. Driver will arrive in 4 minutes.');
        break;
      case 'Wait for Weather to Improve':
        Alert.alert('Waiting Mode', 'Weather monitoring activated. You\'ll be notified when conditions improve.');
        break;
      case 'Use Train (with umbrella)':
        Alert.alert('Train Route', 'Route to nearest station calculated. Stay dry and be safe!');
        break;
      default:
        Alert.alert('Option Selected', `Proceeding with: ${option}`);
    }
  };

  const adjustDecisionFactors = (factor, value) => {
    setDecisionFactors(prev => ({
      ...prev,
      [factor]: value
    }));
    // Recalculate recommendations based on new factors
    recalculateRecommendations();
  };

  const recalculateRecommendations = () => {
    // This would normally involve complex AI calculations
    // For demo, we'll just show the impact
    Alert.alert('Preferences Updated', 'Recommendations have been updated based on your preferences');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with current weather */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🌧️ Weather Travel Assistant</Text>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
            <Text style={styles.weatherDetails}>
              Intensity: {weatherData.intensity}% | {weatherData.temperature}°C
            </Text>
            <Text style={styles.weatherDuration}>
              Expected to stop: {weatherData.stopTime} ({weatherData.expectedDuration} min)
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick decision buttons */}
      <View style={styles.quickDecisionContainer}>
        <Text style={styles.sectionTitle}>🚀 Quick Decision</Text>
        <View style={styles.quickButtons}>
          <TouchableOpacity 
            style={[styles.quickButton, styles.taxiButton]}
            onPress={() => makeDecision('Take Taxi Now')}
          >
            <Text style={styles.quickButtonIcon}>🚕</Text>
            <Text style={styles.quickButtonText}>Take Taxi</Text>
            <Text style={styles.quickButtonSubtext}>¥{transportOptions.taxi.estimatedCost + transportOptions.taxi.weatherPremium}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickButton, styles.waitButton]}
            onPress={() => makeDecision('Wait for Weather to Improve')}
          >
            <Text style={styles.quickButtonIcon}>⏰</Text>
            <Text style={styles.quickButtonText}>Wait It Out</Text>
            <Text style={styles.quickButtonSubtext}>{weatherData.expectedDuration} min</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickButton, styles.trainButton]}
            onPress={() => makeDecision('Use Train (with umbrella)')}
          >
            <Text style={styles.quickButtonIcon}>🚊</Text>
            <Text style={styles.quickButtonText}>Use Train</Text>
            <Text style={styles.quickButtonSubtext}>¥{transportOptions.train.cost}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detailed recommendations */}
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>🤖 AI Recommendations</Text>
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
                <Text style={styles.scoreLabel}>Match</Text>
              </View>
            </View>
            
            <Text style={styles.recReasoning}>{rec.reasoning}</Text>
            <Text style={styles.recCost}>{rec.costBreakdown}</Text>
            
            <View style={styles.prosConsContainer}>
              <View style={styles.prosContainer}>
                <Text style={styles.prosConsTitle}>✅ Pros:</Text>
                {rec.pros.map((pro, i) => (
                  <Text key={i} style={styles.prosConsItem}>• {pro}</Text>
                ))}
              </View>
              
              <View style={styles.consContainer}>
                <Text style={styles.prosConsTitle}>❌ Cons:</Text>
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
                {rec.priority} Priority
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Live transport status */}
      <View style={styles.transportStatusContainer}>
        <Text style={styles.sectionTitle}>🚦 Live Transport Status</Text>
        
        <View style={styles.transportOption}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportIcon}>🚕</Text>
            <Text style={styles.transportName}>Taxi</Text>
            <Text style={styles.transportStatus}>Available</Text>
          </View>
          <View style={styles.transportDetails}>
            <Text style={styles.transportDetail}>Wait: {transportOptions.taxi.waitTime} min</Text>
            <Text style={styles.transportDetail}>Cost: ¥{transportOptions.taxi.estimatedCost + transportOptions.taxi.weatherPremium}</Text>
            <Text style={styles.transportSurge}>⚡ {transportOptions.taxi.surge}x surge pricing</Text>
          </View>
        </View>

        <View style={styles.transportOption}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportIcon}>🚊</Text>
            <Text style={styles.transportName}>Train</Text>
            <Text style={styles.transportStatus}>Running</Text>
          </View>
          <View style={styles.transportDetails}>
            <Text style={styles.transportDetail}>Walk: {transportOptions.train.walkTime} min in rain</Text>
            <Text style={styles.transportDetail}>Cost: ¥{transportOptions.train.cost}</Text>
            <Text style={styles.transportCrowd}>👥 {transportOptions.train.crowdLevel} crowds</Text>
          </View>
        </View>

        <View style={styles.transportOption}>
          <View style={styles.transportHeader}>
            <Text style={styles.transportIcon}>🚌</Text>
            <Text style={styles.transportName}>Bus</Text>
            <Text style={styles.transportStatus}>Delayed</Text>
          </View>
          <View style={styles.transportDetails}>
            <Text style={styles.transportDetail}>Wait: {transportOptions.bus.waitTime} min</Text>
            <Text style={styles.transportDetail}>Cost: ¥{transportOptions.bus.cost}</Text>
            <Text style={styles.transportDelay}>⚠️ {transportOptions.bus.delayRisk} delay risk</Text>
          </View>
        </View>
      </View>

      {/* Weather forecast */}
      <View style={styles.forecastContainer}>
        <Text style={styles.sectionTitle}>📊 Weather Forecast</Text>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>Next 3 Hours</Text>
          <View style={styles.forecastTimeline}>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>Now</Text>
              <Text style={styles.forecastIcon}>🌧️</Text>
              <Text style={styles.forecastIntensity}>Heavy</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>+1h</Text>
              <Text style={styles.forecastIcon}>🌦️</Text>
              <Text style={styles.forecastIntensity}>Moderate</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>+2h</Text>
              <Text style={styles.forecastIcon}>☁️</Text>
              <Text style={styles.forecastIntensity}>Light</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastTime}>+3h</Text>
              <Text style={styles.forecastIcon}>⛅</Text>
              <Text style={styles.forecastIntensity}>Clear</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Preference adjustments */}
      <View style={styles.preferencesContainer}>
        <Text style={styles.sectionTitle}>⚙️ Your Preferences</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Urgency Level</Text>
          <View style={styles.preferenceButtons}>
            {['Low', 'Medium', 'High'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.preferenceButton,
                  decisionFactors.urgency === level && styles.preferenceButtonActive
                ]}
                onPress={() => adjustDecisionFactors('urgency', level)}
              >
                <Text style={[
                  styles.preferenceButtonText,
                  decisionFactors.urgency === level && styles.preferenceButtonTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Budget Flexibility</Text>
          <View style={styles.preferenceButtons}>
            {['Tight', 'Moderate', 'Flexible'].map((budget) => (
              <TouchableOpacity
                key={budget}
                style={[
                  styles.preferenceButton,
                  decisionFactors.budget === budget && styles.preferenceButtonActive
                ]}
                onPress={() => adjustDecisionFactors('budget', budget)}
              >
                <Text style={[
                  styles.preferenceButtonText,
                  decisionFactors.budget === budget && styles.preferenceButtonTextActive
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
        <Text style={styles.sectionTitle}>💰 Cost Comparison</Text>
        <View style={styles.costGrid}>
          <View style={styles.costCard}>
            <Text style={styles.costOption}>🚕 Taxi</Text>
            <Text style={styles.costAmount}>¥{transportOptions.taxi.estimatedCost + transportOptions.taxi.weatherPremium}</Text>
            <Text style={styles.costNote}>+Weather premium</Text>
          </View>
          
          <View style={styles.costCard}>
            <Text style={styles.costOption}>🚊 Train</Text>
            <Text style={styles.costAmount}>¥{transportOptions.train.cost}</Text>
            <Text style={styles.costNote}>+Discomfort cost</Text>
          </View>
          
          <View style={styles.costCard}>
            <Text style={styles.costOption}>⏰ Wait</Text>
            <Text style={styles.costAmount}>¥400</Text>
            <Text style={styles.costNote}>Coffee + time</Text>
          </View>
        </View>
      </View>

      {/* Emergency contacts */}
      <View style={styles.emergencyContainer}>
        <Text style={styles.sectionTitle}>🆘 Emergency Options</Text>
        <TouchableOpacity style={styles.emergencyButton} onPress={() => Alert.alert('Emergency', 'Emergency taxi booking activated')}>
          <Text style={styles.emergencyButtonText}>🚨 Book Emergency Taxi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyButton} onPress={() => Alert.alert('Shelter', 'Finding nearest weather shelter')}>
          <Text style={styles.emergencyButtonText}>🏠 Find Nearest Shelter</Text>
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