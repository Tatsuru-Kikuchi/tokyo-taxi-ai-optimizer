import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const UserTypeSelection = ({ onUserTypeSelect }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [animationValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelection = (type) => {
    setSelectedType(type);
    
    // Animate selection and then navigate
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onUserTypeSelect(type);
      }, 300);
    });
  };

  const slideUpAnimation = {
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
    opacity: animationValue,
  };

  return (
    <LinearGradient
      colors={['#3498db', '#2980b9', '#1f4e79']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2980b9" />
      
      {/* Header */}
      <Animated.View style={[styles.header, slideUpAnimation]}>
        <Text style={styles.title}>🌦️ Tokyo Taxi AI</Text>
        <Text style={styles.subtitle}>Weather Intelligence System</Text>
        <View style={styles.researchBadge}>
          <Icon name="school" size={16} color="#ffffff" />
          <Text style={styles.researchText}>University of Tokyo Research</Text>
        </View>
      </Animated.View>

      {/* User Type Cards */}
      <Animated.View style={[styles.cardContainer, slideUpAnimation]}>
        {/* Driver Card */}
        <TouchableOpacity
          style={[
            styles.userTypeCard,
            styles.driverCard,
            selectedType === 'driver' && styles.selectedCard,
          ]}
          onPress={() => handleSelection('driver')}
          activeOpacity={0.8}
        >
          <View style={styles.cardIcon}>
            <Icon name="local-taxi" size={50} color="#ffffff" />
          </View>
          <Text style={styles.cardTitle}>🚕 Driver</Text>
          <Text style={styles.cardSubtitle}>Where should I go?</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Weather-based hotspot recommendations</Text>
            <Text style={styles.featureItem}>• Real-time revenue optimization</Text>
            <Text style={styles.featureItem}>• GPS navigation integration</Text>
            <Text style={styles.featureItem}>• +30.2% earnings potential</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.researchNote}>Research-validated results</Text>
          </View>
        </TouchableOpacity>

        {/* Passenger Card */}
        <TouchableOpacity
          style={[
            styles.userTypeCard,
            styles.passengerCard,
            selectedType === 'passenger' && styles.selectedCard,
          ]}
          onPress={() => handleSelection('passenger')}
          activeOpacity={0.8}
        >
          <View style={styles.cardIcon}>
            <Icon name="person" size={50} color="#ffffff" />
          </View>
          <Text style={styles.cardTitle}>👤 Passenger</Text>
          <Text style={styles.cardSubtitle}>Should I take a taxi?</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Smart transportation decisions</Text>
            <Text style={styles.featureItem}>• Cost-benefit analysis</Text>
            <Text style={styles.featureItem}>• Weather timeline forecasting</Text>
            <Text style={styles.featureItem}>• Real-time advice</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.researchNote}>AI-powered recommendations</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Weather Stats */}
      <Animated.View style={[styles.statsContainer, slideUpAnimation]}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0.847</Text>
          <Text style={styles.statLabel}>Rain-Demand Correlation</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>30.2%</Text>
          <Text style={styles.statLabel}>Productivity Improvement</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>87%</Text>
          <Text style={styles.statLabel}>Prediction Accuracy</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, slideUpAnimation]}>
        <Text style={styles.footerText}>
          Powered by University of Tokyo Faculty of Economics research
        </Text>
        <Text style={styles.developerText}>
          Developed by Tatsuru Kikuchi
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 15,
  },
  researchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  researchText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  userTypeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  driverCard: {
    borderLeftColor: '#e74c3c',
    borderLeftWidth: 6,
  },
  passengerCard: {
    borderLeftColor: '#2ecc71',
    borderLeftWidth: 6,
  },
  selectedCard: {
    borderColor: '#f39c12',
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
    alignSelf: 'stretch',
  },
  researchNote: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 30,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#ecf0f1',
    textAlign: 'center',
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 5,
  },
  developerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default UserTypeSelection;