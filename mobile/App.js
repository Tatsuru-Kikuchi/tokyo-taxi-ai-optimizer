import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TaxiDriverApp from './TaxiDriverApp';
import PassengerWeatherApp from './PassengerWeatherApp';

export default function App() {
  const [userType, setUserType] = useState(null); // 'driver' or 'passenger'

  if (userType === 'driver') {
    return <TaxiDriverApp />;
  }

  if (userType === 'passenger') {
    return <PassengerWeatherApp />;
  }

  // User selection screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🌧️🚕</Text>
            <Text style={styles.title}>Weather Taxi Optimizer</Text>
            <Text style={styles.subtitle}>
              AI-powered transportation decisions during weather conditions
            </Text>
            <Text style={styles.researchBadge}>
              🎓 University of Tokyo Research Validated
            </Text>
          </View>

          {/* Features showcase */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Powered by Advanced AI</Text>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>96.3% AI prediction accuracy</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureText}>30.2% proven revenue improvement</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌦️</Text>
              <Text style={styles.featureText}>Real-time weather intelligence</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Instant decision recommendations</Text>
            </View>
          </View>

          {/* User type selection */}
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Choose Your Experience</Text>
            
            <TouchableOpacity 
              style={styles.userTypeButton}
              onPress={() => setUserType('driver')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.buttonGradient}>
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>🚕</Text>
                  <Text style={styles.buttonTitle}>I'm a Taxi Driver</Text>
                  <Text style={styles.buttonDescription}>
                    Get AI-powered positioning recommendations during weather conditions
                  </Text>
                  <View style={styles.buttonFeatures}>
                    <Text style={styles.buttonFeature}>• Weather demand hotspots</Text>
                    <Text style={styles.buttonFeature}>• Real-time earnings tracking</Text>
                    <Text style={styles.buttonFeature}>• Optimal positioning alerts</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.userTypeButton}
              onPress={() => setUserType('passenger')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.buttonGradient}>
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>👤</Text>
                  <Text style={styles.buttonTitle}>I'm a Passenger</Text>
                  <Text style={styles.buttonDescription}>
                    Get smart recommendations: take taxi now or wait for weather to improve
                  </Text>
                  <View style={styles.buttonFeatures}>
                    <Text style={styles.buttonFeature}>• Weather forecast analysis</Text>
                    <Text style={styles.buttonFeature}>• Cost-benefit comparisons</Text>
                    <Text style={styles.buttonFeature}>• Smart timing recommendations</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Developed by Tatsuru Kikuchi
            </Text>
            <Text style={styles.footerSubtext}>
              University of Tokyo Faculty of Economics
            </Text>
            <Text style={styles.contactText}>
              📧 tatsuru.kikuchi@gmail.com
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  researchBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuresContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  selectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
  },
  userTypeButton: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonGradient: {
    padding: 1,
  },
  buttonContent: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 19,
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  buttonFeatures: {
    alignSelf: 'stretch',
  },
  buttonFeature: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'left',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  contactText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
});