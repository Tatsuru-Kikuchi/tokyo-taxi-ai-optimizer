import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import our core components for the iPhone app
import TaxiDriverApp from './TaxiDriverApp';
import PassengerWeatherApp from './PassengerWeatherApp';
import AdvancedEarningsAnalytics from './components/AdvancedEarningsAnalytics';
import SmartNotificationsManager from './components/SmartNotificationsManager';
import AdvancedSettingsManager from './components/AdvancedSettingsManager';
import ProfessionalNetworkingHub from './components/ProfessionalNetworkingHub';
import CostOptimizedTaxiOptimizer from './components/CostOptimizedTaxiOptimizer';
import LanguageSelector from './components/LanguageSelector';
import { LocalizationProvider, useLocalization } from './localization/LocalizationContext';

// Main iPhone App Navigation Component
const TokyoTaxiAIApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userType, setUserType] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const { t, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunchedBefore');
      const savedUserType = await AsyncStorage.getItem('userType');
      
      if (hasLaunched && savedUserType) {
        setIsFirstLaunch(false);
        setUserType(savedUserType);
        setCurrentScreen('dashboard');
      }
    } catch (error) {
      console.log('First launch check error:', error);
    }
  };

  const handleUserTypeSelection = async (type) => {
    try {
      await AsyncStorage.setItem('hasLaunchedBefore', 'true');
      await AsyncStorage.setItem('userType', type);
      setUserType(type);
      setIsFirstLaunch(false);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.log('User type selection error:', error);
    }
  };

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    Alert.alert(
      localeInfo.isJapanese ? 'ログアウト確認' : 'Logout Confirmation',
      localeInfo.isJapanese 
        ? 'ログアウトしてユーザータイプ選択に戻りますか？'
        : 'Logout and return to user type selection?',
      [
        { text: localeInfo.isJapanese ? 'キャンセル' : 'Cancel', style: 'cancel' },
        {
          text: localeInfo.isJapanese ? 'ログアウト' : 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userType');
            setUserType(null);
            setIsFirstLaunch(true);
            setCurrentScreen('home');
          }
        }
      ]
    );
  };

  // Welcome/User Type Selection Screen
  const WelcomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      <LinearGradient colors={['#1976D2', '#42A5F5']} style={styles.welcomeContainer}>
        {/* App Header */}
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>🚕 Tokyo Taxi AI</Text>
          <Text style={styles.appSubtitle}>
            {localeInfo.isJapanese ? 'AIタクシー最適化システム' : 'AI Taxi Optimization System'}
          </Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>

        {/* Language Selector */}
        <View style={styles.languageSection}>
          <LanguageSelector />
        </View>

        {/* User Type Selection */}
        <View style={styles.userTypeSection}>
          <Text style={styles.selectionTitle}>
            {localeInfo.isJapanese ? 'ユーザータイプを選択' : 'Select User Type'}
          </Text>

          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => handleUserTypeSelection('driver')}
          >
            <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.userTypeGradient}>
              <Ionicons name="car" size={32} color="white" />
              <Text style={styles.userTypeTitle}>
                {localeInfo.isJapanese ? 'タクシー運転手' : 'Taxi Driver'}
              </Text>
              <Text style={styles.userTypeDescription}>
                {localeInfo.isJapanese 
                  ? '収益最適化・需要予測・効率的なルート'
                  : 'Earnings optimization, demand prediction, efficient routes'
                }
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userTypeButton}
            onPress={() => handleUserTypeSelection('passenger')}
          >
            <LinearGradient colors={['#FF9800', '#FFB74D']} style={styles.userTypeGradient}>
              <Ionicons name="person" size={32} color="white" />
              <Text style={styles.userTypeTitle}>
                {localeInfo.isJapanese ? '乗客' : 'Passenger'}
              </Text>
              <Text style={styles.userTypeDescription}>
                {localeInfo.isJapanese 
                  ? '天気情報・タクシー需要・最適なタイミング'
                  : 'Weather info, taxi demand, optimal timing'
                }
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* App Features Preview */}
        <View style={styles.featuresPreview}>
          <Text style={styles.featuresTitle}>
            {localeInfo.isJapanese ? '主な機能' : 'Key Features'}
          </Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🧠</Text>
              <Text style={styles.featureText}>
                {localeInfo.isJapanese ? 'AI最適化' : 'AI Optimization'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>
                {localeInfo.isJapanese ? '収益分析' : 'Analytics'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🌦️</Text>
              <Text style={styles.featureText}>
                {localeInfo.isJapanese ? '天気連動' : 'Weather Intel'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔔</Text>
              <Text style={styles.featureText}>
                {localeInfo.isJapanese ? 'スマート通知' : 'Smart Alerts'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );

  // Main Dashboard Screen
  const DashboardScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <Text style={styles.dashboardTitle}>
          {userType === 'driver' 
            ? (localeInfo.isJapanese ? 'ドライバーダッシュボード' : 'Driver Dashboard')
            : (localeInfo.isJapanese ? '乗客ダッシュボード' : 'Passenger Dashboard')
          }
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {currentScreen === 'dashboard' && (
          userType === 'driver' ? <TaxiDriverApp /> : <PassengerWeatherApp />
        )}
        {currentScreen === 'analytics' && <AdvancedEarningsAnalytics />}
        {currentScreen === 'optimizer' && <CostOptimizedTaxiOptimizer />}
        {currentScreen === 'notifications' && <SmartNotificationsManager />}
        {currentScreen === 'networking' && <ProfessionalNetworkingHub />}
        {currentScreen === 'settings' && <AdvancedSettingsManager />}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'dashboard' && styles.activeNavItem]}
          onPress={() => handleScreenChange('dashboard')}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={currentScreen === 'dashboard' ? '#1976D2' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === 'dashboard' && styles.activeNavText]}>
            {localeInfo.isJapanese ? 'ホーム' : 'Home'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'analytics' && styles.activeNavItem]}
          onPress={() => handleScreenChange('analytics')}
        >
          <Ionicons 
            name="analytics" 
            size={24} 
            color={currentScreen === 'analytics' ? '#1976D2' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === 'analytics' && styles.activeNavText]}>
            {localeInfo.isJapanese ? '分析' : 'Analytics'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'optimizer' && styles.activeNavItem]}
          onPress={() => handleScreenChange('optimizer')}
        >
          <Ionicons 
            name="speedometer" 
            size={24} 
            color={currentScreen === 'optimizer' ? '#1976D2' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === 'optimizer' && styles.activeNavText]}>
            {localeInfo.isJapanese ? '最適化' : 'Optimize'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'notifications' && styles.activeNavItem]}
          onPress={() => handleScreenChange('notifications')}
        >
          <Ionicons 
            name="notifications" 
            size={24} 
            color={currentScreen === 'notifications' ? '#1976D2' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === 'notifications' && styles.activeNavText]}>
            {localeInfo.isJapanese ? '通知' : 'Alerts'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'networking' && styles.activeNavItem]}
          onPress={() => handleScreenChange('networking')}
        >
          <Ionicons 
            name="people" 
            size={24} 
            color={currentScreen === 'networking' ? '#1976D2' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === 'networking' && styles.activeNavText]}>
            {localeInfo.isJapanese ? 'ネットワーク' : 'Network'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'settings' && styles.activeNavItem]}
          onPress={() => handleScreenChange('settings')}
        >
          <Ionicons 
            name="settings" 
            size={24} 
            color={currentScreen === 'settings' ? '#1976D2' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === 'settings' && styles.activeNavText]}>
            {localeInfo.isJapanese ? '設定' : 'Settings'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Render appropriate screen
  if (isFirstLaunch || !userType) {
    return <WelcomeScreen />;
  } else {
    return <DashboardScreen />;
  }
};

// Main App Component with Localization Provider
const App = () => {
  return (
    <LocalizationProvider>
      <TokyoTaxiAIApp />
    </LocalizationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  appHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  languageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userTypeSection: {
    flex: 1,
    justifyContent: 'center',
  },
  selectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  userTypeButton: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userTypeGradient: {
    padding: 25,
    alignItems: 'center',
  },
  userTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 8,
  },
  userTypeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresPreview: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeNavItem: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  navText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  activeNavText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
});

export default App;