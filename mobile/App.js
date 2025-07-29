import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LocalizationProvider, useLocalization } from './localization/LocalizationContext';
import TaxiDriverApp from './TaxiDriverApp';
import PassengerWeatherApp from './PassengerWeatherApp';
import LanguageSelector from './components/LanguageSelector';

// Main App Component with Localization
const MainApp = () => {
  const [userType, setUserType] = useState(null); // 'driver' or 'passenger'
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();

  if (userType === 'driver') {
    return <TaxiDriverApp />;
  }

  if (userType === 'passenger') {
    return <PassengerWeatherApp />;
  }

  const localeInfo = getCurrentLocaleInfo();

  // User selection screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.content}>
          {/* Language Selector Button */}
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Text style={styles.languageButtonText}>
              {localeInfo.isJapanese ? '🇯🇵 日本語' : '🇺🇸 English'}
            </Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🌧️🚕</Text>
            <Text style={styles.title}>{t('app.title')}</Text>
            <Text style={styles.subtitle}>
              {t('app.subtitle')}
            </Text>
            <Text style={styles.researchBadge}>
              {t('app.researchBadge')}
            </Text>
          </View>

          {/* Features showcase */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>{t('userSelection.poweredByAI')}</Text>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>{t('userSelection.features.aiAccuracy')}</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureText}>{t('userSelection.features.revenueImprovement')}</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌦️</Text>
              <Text style={styles.featureText}>{t('userSelection.features.weatherIntelligence')}</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>{t('userSelection.features.instantRecommendations')}</Text>
            </View>
          </View>

          {/* User type selection */}
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>{t('userSelection.chooseExperience')}</Text>
            
            <TouchableOpacity 
              style={styles.userTypeButton}
              onPress={() => setUserType('driver')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.buttonGradient}>
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>🚕</Text>
                  <Text style={styles.buttonTitle}>{t('userSelection.driver.title')}</Text>
                  <Text style={styles.buttonDescription}>
                    {t('userSelection.driver.description')}
                  </Text>
                  <View style={styles.buttonFeatures}>
                    {t('userSelection.driver.features').map((feature, index) => (
                      <Text key={index} style={styles.buttonFeature}>• {feature}</Text>
                    ))}
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
                  <Text style={styles.buttonTitle}>{t('userSelection.passenger.title')}</Text>
                  <Text style={styles.buttonDescription}>
                    {t('userSelection.passenger.description')}
                  </Text>
                  <View style={styles.buttonFeatures}>
                    {t('userSelection.passenger.features').map((feature, index) => (
                      <Text key={index} style={styles.buttonFeature}>• {feature}</Text>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('footer.developer')}
            </Text>
            <Text style={styles.footerSubtext}>
              {t('footer.university')}
            </Text>
            <Text style={styles.contactText}>
              {t('footer.contact')}
            </Text>
          </View>
        </View>

        {/* Language Selector Modal */}
        {showLanguageSelector && (
          <LanguageSelector 
            visible={showLanguageSelector}
            onClose={() => setShowLanguageSelector(false)}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

// App wrapper with LocalizationProvider
export default function App() {
  return (
    <LocalizationProvider>
      <MainApp />
    </LocalizationProvider>
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
  languageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 100,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
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
    paddingHorizontal: 10,
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
    flex: 1,
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
    paddingHorizontal: 10,
  },
  buttonFeatures: {
    alignSelf: 'stretch',
  },
  buttonFeature: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'left',
    paddingLeft: 10,
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