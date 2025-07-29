import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const TaxiDriverApp = () => {
  const [weatherData, setWeatherData] = useState({
    condition: 'Heavy Rain',
    temperature: 18,
    humidity: 85,
    rainIntensity: 'High',
    windSpeed: 12,
    visibility: 'Poor'
  });

  const [locationRecommendations, setLocationRecommendations] = useState([
    {
      area: 'Shibuya Station',
      demandIncrease: '+65%',
      distance: '2.3km',
      travelTime: '8 min',
      reasoning: 'Heavy rain increases indoor shopping demand',
      priority: 'High',
      estimatedWait: '3 min',
      estimatedEarnings: '¥2,400/hour'
    },
    {
      area: 'Tokyo Station',
      demandIncrease: '+45%',
      distance: '1.8km',
      travelTime: '6 min',
      reasoning: 'Business district, commuters avoiding trains',
      priority: 'High',
      estimatedWait: '5 min',
      estimatedEarnings: '¥2,100/hour'
    },
    {
      area: 'Ginza District',
      demandIncrease: '+35%',
      distance: '3.1km',
      travelTime: '12 min',
      reasoning: 'Shopping area, tourists seeking covered transport',
      priority: 'Medium',
      estimatedWait: '7 min',
      estimatedEarnings: '¥1,800/hour'
    },
    {
      area: 'Roppongi Hills',
      demandIncrease: '+55%',
      distance: '4.2km',
      travelTime: '15 min',
      reasoning: 'Entertainment district, nightlife continues despite rain',
      priority: 'Medium',
      estimatedWait: '4 min',
      estimatedEarnings: '¥2,000/hour'
    }
  ]);

  const [currentEarnings, setCurrentEarnings] = useState({
    today: 12450,
    thisWeek: 89200,
    weatherBonus: 3850,
    efficiency: '+28%'
  });

  const [realTimeAlerts, setRealTimeAlerts] = useState([
    {
      type: 'opportunity',
      message: 'Rain intensifying in Shinjuku - demand surge expected',
      time: '2 min ago',
      action: 'Navigate'
    },
    {
      type: 'traffic',
      message: 'Yamanote Line delays causing taxi demand spike',
      time: '5 min ago',
      action: 'View Areas'
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentEarnings(prev => ({
        ...prev,
        today: prev.today + Math.floor(Math.random() * 500),
        weatherBonus: prev.weatherBonus + Math.floor(Math.random() * 200)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const navigateToLocation = (area) => {
    Alert.alert(
      'Navigate to Location',
      `Start navigation to ${area}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => console.log(`Navigating to ${area}`) }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF4757';
      case 'Medium': return '#FFA502';
      case 'Low': return '#2ED573';
      default: return '#747d8c';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚕 Taxi AI Optimizer</Text>
        <Text style={styles.headerSubtitle}>Weather-Smart Positioning</Text>
      </View>

      {/* Weather Status Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherTitle}>🌧️ Current Weather Impact</Text>
          <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
        </View>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Temperature</Text>
            <Text style={styles.weatherValue}>{weatherData.temperature}°C</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Rain Intensity</Text>
            <Text style={styles.weatherValue}>{weatherData.rainIntensity}</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherLabel}>Demand Boost</Text>
            <Text style={[styles.weatherValue, {color: '#2ED573'}]}>+42%</Text>
          </View>
        </View>
      </View>

      {/* Current Earnings Card */}
      <View style={styles.earningsCard}>
        <Text style={styles.cardTitle}>💰 Today's Performance</Text>
        <View style={styles.earningsGrid}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsValue}>¥{currentEarnings.today.toLocaleString()}</Text>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={[styles.earningsValue, {color: '#2ED573'}]}>¥{currentEarnings.weatherBonus.toLocaleString()}</Text>
            <Text style={styles.earningsLabel}>Weather Bonus</Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={[styles.earningsValue, {color: '#5352ED'}]}>{currentEarnings.efficiency}</Text>
            <Text style={styles.earningsLabel}>Efficiency Boost</Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsValue}>¥{currentEarnings.thisWeek.toLocaleString()}</Text>
            <Text style={styles.earningsLabel}>This Week</Text>
          </View>
        </View>
      </View>

      {/* Real-time Alerts */}
      <View style={styles.alertsCard}>
        <Text style={styles.cardTitle}>🚨 Real-time Alerts</Text>
        {realTimeAlerts.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
            <TouchableOpacity style={styles.alertButton}>
              <Text style={styles.alertButtonText}>{alert.action}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Location Recommendations */}
      <View style={styles.recommendationsCard}>
        <Text style={styles.cardTitle}>📍 Smart Location Recommendations</Text>
        <Text style={styles.cardSubtitle}>AI-powered positioning for maximum earnings</Text>
        
        {locationRecommendations.map((location, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.locationCard}
            onPress={() => navigateToLocation(location.area)}
          >
            <View style={styles.locationHeader}>
              <View>
                <Text style={styles.locationName}>{location.area}</Text>
                <Text style={styles.locationReasoning}>{location.reasoning}</Text>
              </View>
              <View style={[styles.priorityBadge, {backgroundColor: getPriorityColor(location.priority)}]}>
                <Text style={styles.priorityText}>{location.priority}</Text>
              </View>
            </View>
            
            <View style={styles.locationMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{location.demandIncrease}</Text>
                <Text style={styles.metricLabel}>Demand ↗</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{location.distance}</Text>
                <Text style={styles.metricLabel}>Distance</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{location.travelTime}</Text>
                <Text style={styles.metricLabel}>Travel Time</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{location.estimatedWait}</Text>
                <Text style={styles.metricLabel}>Est. Wait</Text>
              </View>
            </View>
            
            <View style={styles.earningsEstimate}>
              <Text style={styles.earningsEstimateLabel}>Estimated Earnings:</Text>
              <Text style={styles.earningsEstimateValue}>{location.estimatedEarnings}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Insights */}
      <View style={styles.insightsCard}>
        <Text style={styles.cardTitle}>🧠 AI Weather Insights</Text>
        <View style={styles.insightItem}>
          <Text style={styles.insightTitle}>Rain Pattern Analysis</Text>
          <Text style={styles.insightText}>
            Current rainfall expected to continue for 45 minutes. Shibuya and Tokyo Station 
            showing highest demand correlation with weather intensity.
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightTitle}>Optimal Strategy</Text>
          <Text style={styles.insightText}>
            Position near major shopping areas. Avoid residential zones. Focus on covered 
            pickup points for passenger comfort.
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Text style={styles.insightTitle}>Competition Analysis</Text>
          <Text style={styles.insightText}>
            Lower taxi density in Shibuya area currently. Move quickly to capitalize on 
            demand-supply gap.
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#5352ED'}]}>
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionText}>Navigate to Best Zone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#FF4757'}]}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View Earnings Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#2ED573'}]}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Set Weather Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#FFA502'}]}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by University of Tokyo AI Research</Text>
        <Text style={styles.footerSubtext}>30.2% Proven Revenue Improvement</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    backgroundColor: '#5352ED',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  weatherCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3542',
  },
  weatherCondition: {
    fontSize: 16,
    color: '#5352ED',
    fontWeight: '600',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 12,
    color: '#747d8c',
    marginBottom: 5,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3542',
  },
  earningsCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 15,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#747d8c',
    marginBottom: 15,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningsItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 5,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#747d8c',
    textAlign: 'center',
  },
  alertsCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#2f3542',
    marginBottom: 3,
  },
  alertTime: {
    fontSize: 12,
    color: '#747d8c',
  },
  alertButton: {
    backgroundColor: '#5352ED',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationsCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationCard: {
    backgroundColor: '#f8f9fb',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 3,
  },
  locationReasoning: {
    fontSize: 12,
    color: '#747d8c',
    width: '80%',
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
  locationMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#747d8c',
  },
  earningsEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  earningsEstimateLabel: {
    fontSize: 14,
    color: '#747d8c',
  },
  earningsEstimateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ED573',
  },
  insightsCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightItem: {
    marginBottom: 15,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5352ED',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 13,
    color: '#2f3542',
    lineHeight: 18,
  },
  actionsCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#747d8c',
    marginBottom: 3,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#2ED573',
    fontWeight: '600',
  },
});

export default TaxiDriverApp;