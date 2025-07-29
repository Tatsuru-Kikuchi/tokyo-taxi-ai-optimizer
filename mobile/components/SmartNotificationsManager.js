import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '../localization/LocalizationContext';

// Smart notification system for taxi optimization
class SmartNotificationManager {
  constructor() {
    this.preferences = {
      demandAlerts: true,
      weatherAlerts: true,
      earningsTargets: true,
      peakHourReminders: true,
      maintenanceReminders: true,
      competitorAlerts: false
    };
    this.scheduledNotifications = [];
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Load saved preferences
      const savedPrefs = await AsyncStorage.getItem('notification_preferences');
      if (savedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
      }

      // Configure notification handling
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      this.isInitialized = true;
      await this.scheduleSmartNotifications();
      return true;
    } catch (error) {
      console.error('Notification manager initialization failed:', error);
      return false;
    }
  }

  async updatePreferences(newPreferences) {
    this.preferences = { ...this.preferences, ...newPreferences };
    await AsyncStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
    
    // Reschedule notifications based on new preferences
    await this.cancelAllScheduledNotifications();
    await this.scheduleSmartNotifications();
  }

  async scheduleSmartNotifications() {
    if (!this.isInitialized) return;

    // Schedule peak hour reminders
    if (this.preferences.peakHourReminders) {
      await this.schedulePeakHourReminders();
    }

    // Schedule weather-based alerts
    if (this.preferences.weatherAlerts) {
      await this.scheduleWeatherAlerts();
    }

    // Schedule earnings target reminders
    if (this.preferences.earningsTargets) {
      await this.scheduleEarningsReminders();
    }

    // Schedule maintenance reminders
    if (this.preferences.maintenanceReminders) {
      await this.scheduleMaintenanceReminders();
    }
  }

  async schedulePeakHourReminders() {
    const peakHours = [
      { hour: 7, minute: 30, message: 'Morning rush hour starting soon! 🌅' },
      { hour: 17, minute: 0, message: 'Evening rush hour begins! 🌆' },
      { hour: 22, minute: 0, message: 'Weekend nightlife peak time! 🌃' }
    ];

    for (const peak of peakHours) {
      const trigger = {
        hour: peak.hour,
        minute: peak.minute,
        repeats: true
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Peak Hour Alert',
          body: peak.message,
          data: { type: 'peak_hour' },
        },
        trigger,
      });

      this.scheduledNotifications.push(notificationId);
    }
  }

  async scheduleWeatherAlerts() {
    // Schedule daily weather check (8 AM)
    const trigger = {
      hour: 8,
      minute: 0,
      repeats: true
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weather Impact Alert',
        body: 'Check today\'s weather for demand optimization! 🌤️',
        data: { type: 'weather_check' },
      },
      trigger,
    });

    this.scheduledNotifications.push(notificationId);
  }

  async scheduleEarningsReminders() {
    // Schedule earnings check reminders
    const reminders = [
      { hour: 12, minute: 0, message: 'Midday earnings check - how are you doing? 💰' },
      { hour: 18, minute: 0, message: 'Evening update - track your progress! 📊' }
    ];

    for (const reminder of reminders) {
      const trigger = {
        hour: reminder.hour,
        minute: reminder.minute,
        repeats: true
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Earnings Check',
          body: reminder.message,
          data: { type: 'earnings_reminder' },
        },
        trigger,
      });

      this.scheduledNotifications.push(notificationId);
    }
  }

  async scheduleMaintenanceReminders() {
    // Schedule weekly maintenance reminder (Sunday 20:00)
    const trigger = {
      weekday: 1, // Sunday
      hour: 20,
      minute: 0,
      repeats: true
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Vehicle Maintenance',
        body: 'Weekly vehicle check reminder! 🚗',
        data: { type: 'maintenance' },
      },
      trigger,
    });

    this.scheduledNotifications.push(notificationId);
  }

  // Immediate smart notifications
  async sendDemandAlert(area, demandLevel, earnings) {
    if (!this.preferences.demandAlerts) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'High Demand Alert! 🚨',
        body: `${area} showing ${demandLevel}/10 demand. Potential earnings: ¥${earnings}`,
        data: { type: 'demand_alert', area, demandLevel, earnings },
      },
      trigger: null, // Send immediately
    });
  }

  async sendWeatherAlert(condition, impact) {
    if (!this.preferences.weatherAlerts) return;

    const weatherEmojis = {
      rain: '🌧️',
      heavy_rain: '⛈️',
      snow: '❄️',
      clear: '☀️',
      cloudy: '☁️'
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Weather Update ${weatherEmojis[condition]}`,
        body: `${condition} detected. Expected demand impact: +${impact}%`,
        data: { type: 'weather_alert', condition, impact },
      },
      trigger: null,
    });
  }

  async sendEarningsTarget(current, target) {
    if (!this.preferences.earningsTargets) return;

    const percentage = Math.round((current / target) * 100);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Earnings Target Update 💰',
        body: `${percentage}% of daily target reached (¥${current.toLocaleString()}/¥${target.toLocaleString()})`,
        data: { type: 'earnings_target', current, target, percentage },
      },
      trigger: null,
    });
  }

  async sendOptimizationTip(tip) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Smart Tip 💡',
        body: tip,
        data: { type: 'optimization_tip' },
      },
      trigger: null,
    });
  }

  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledNotifications = [];
  }

  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

// Smart Notifications Settings Component
const SmartNotificationsManager = () => {
  const [notificationManager] = useState(() => new SmartNotificationManager());
  const [isInitialized, setIsInitialized] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [showTestModal, setShowTestModal] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [scheduledCount, setScheduledCount] = useState(0);

  const { t, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    const success = await notificationManager.initialize();
    setIsInitialized(success);
    setPreferences(notificationManager.preferences);
    
    if (success) {
      const scheduled = await notificationManager.getScheduledNotifications();
      setScheduledCount(scheduled.length);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await notificationManager.updatePreferences(newPreferences);
    
    // Update scheduled count
    const scheduled = await notificationManager.getScheduledNotifications();
    setScheduledCount(scheduled.length);

    Alert.alert(
      localeInfo.isJapanese ? '設定更新' : 'Settings Updated',
      localeInfo.isJapanese 
        ? '通知設定が更新されました'
        : 'Notification preferences have been updated'
    );
  };

  const sendTestNotification = async () => {
    if (!testMessage.trim()) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? 'メッセージを入力してください' : 'Please enter a message'
      );
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: localeInfo.isJapanese ? 'テスト通知' : 'Test Notification',
        body: testMessage,
        data: { type: 'test' },
      },
      trigger: null,
    });

    setShowTestModal(false);
    setTestMessage('');
    
    Alert.alert(
      localeInfo.isJapanese ? '送信完了' : 'Sent',
      localeInfo.isJapanese ? 'テスト通知を送信しました' : 'Test notification sent'
    );
  };

  const sendSampleDemandAlert = async () => {
    await notificationManager.sendDemandAlert('Shibuya', 9, 4200);
  };

  const sendSampleWeatherAlert = async () => {
    await notificationManager.sendWeatherAlert('rain', 40);
  };

  const sendSampleEarningsAlert = async () => {
    await notificationManager.sendEarningsTarget(18500, 25000);
  };

  const sendOptimizationTip = async () => {
    const tips = [
      'Consider positioning near Shibuya Station during rain for higher demand',
      'Evening hours (17:00-19:00) show highest earnings potential',
      'Weekend nights in Roppongi area typically have 30% higher fares'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    await notificationManager.sendOptimizationTip(randomTip);
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      localeInfo.isJapanese ? '確認' : 'Confirm',
      localeInfo.isJapanese 
        ? 'すべての予定通知をキャンセルしますか？'
        : 'Cancel all scheduled notifications?',
      [
        { text: localeInfo.isJapanese ? 'キャンセル' : 'Cancel', style: 'cancel' },
        { 
          text: localeInfo.isJapanese ? '削除' : 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await notificationManager.cancelAllScheduledNotifications();
            setScheduledCount(0);
            Alert.alert(
              localeInfo.isJapanese ? '完了' : 'Done',
              localeInfo.isJapanese ? 'すべての通知をクリアしました' : 'All notifications cleared'
            );
          }
        }
      ]
    );
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            📱 {localeInfo.isJapanese ? '通知設定' : 'Notification Setup'}
          </Text>
          <Text style={styles.errorText}>
            {localeInfo.isJapanese 
              ? '通知の許可が必要です。設定から許可してください。'
              : 'Notification permissions required. Please enable in settings.'
            }
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeNotifications}>
            <Text style={styles.retryButtonText}>
              {localeInfo.isJapanese ? '再試行' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>
          🔔 {localeInfo.isJapanese ? 'スマート通知管理' : 'Smart Notifications'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {localeInfo.isJapanese 
            ? 'AI最適化アラートとリマインダー'
            : 'AI-powered optimization alerts and reminders'
          }
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {localeInfo.isJapanese ? '予定通知' : 'Scheduled'}: {scheduledCount}
          </Text>
        </View>
      </LinearGradient>

      {/* Notification Preferences */}
      <View style={styles.preferencesContainer}>
        <Text style={styles.sectionTitle}>
          ⚙️ {localeInfo.isJapanese ? '通知設定' : 'Notification Preferences'}
        </Text>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>
              📈 {localeInfo.isJapanese ? '需要アラート' : 'Demand Alerts'}
            </Text>
            <Text style={styles.preferenceDescription}>
              {localeInfo.isJapanese 
                ? '高需要エリアの通知'
                : 'High-demand area notifications'
              }
            </Text>
          </View>
          <Switch
            value={preferences.demandAlerts}
            onValueChange={(value) => handlePreferenceChange('demandAlerts', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.demandAlerts ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>
              🌦️ {localeInfo.isJapanese ? '天気アラート' : 'Weather Alerts'}
            </Text>
            <Text style={styles.preferenceDescription}>
              {localeInfo.isJapanese 
                ? '天気変化による需要影響の通知'
                : 'Weather impact on demand notifications'
              }
            </Text>
          </View>
          <Switch
            value={preferences.weatherAlerts}
            onValueChange={(value) => handlePreferenceChange('weatherAlerts', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.weatherAlerts ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>
              💰 {localeInfo.isJapanese ? '売上目標' : 'Earnings Targets'}
            </Text>
            <Text style={styles.preferenceDescription}>
              {localeInfo.isJapanese 
                ? '日々の売上目標の進捗通知'
                : 'Daily earnings target progress'
              }
            </Text>
          </View>
          <Switch
            value={preferences.earningsTargets}
            onValueChange={(value) => handlePreferenceChange('earningsTargets', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.earningsTargets ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>
              ⏰ {localeInfo.isJapanese ? 'ピーク時間' : 'Peak Hour Reminders'}
            </Text>
            <Text style={styles.preferenceDescription}>
              {localeInfo.isJapanese 
                ? 'ラッシュ時間の開始通知'
                : 'Rush hour start notifications'
              }
            </Text>
          </View>
          <Switch
            value={preferences.peakHourReminders}
            onValueChange={(value) => handlePreferenceChange('peakHourReminders', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.peakHourReminders ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>
              🔧 {localeInfo.isJapanese ? 'メンテナンス' : 'Maintenance Reminders'}
            </Text>
            <Text style={styles.preferenceDescription}>
              {localeInfo.isJapanese 
                ? '車両メンテナンスのリマインダー'
                : 'Vehicle maintenance reminders'
              }
            </Text>
          </View>
          <Switch
            value={preferences.maintenanceReminders}
            onValueChange={(value) => handlePreferenceChange('maintenanceReminders', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.maintenanceReminders ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Test Notifications */}
      <View style={styles.testContainer}>
        <Text style={styles.sectionTitle}>
          🧪 {localeInfo.isJapanese ? 'テスト通知' : 'Test Notifications'}
        </Text>

        <View style={styles.testButtonsContainer}>
          <TouchableOpacity style={styles.testButton} onPress={sendSampleDemandAlert}>
            <Text style={styles.testButtonText}>
              📈 {localeInfo.isJapanese ? '需要アラート' : 'Demand Alert'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={sendSampleWeatherAlert}>
            <Text style={styles.testButtonText}>
              🌧️ {localeInfo.isJapanese ? '天気アラート' : 'Weather Alert'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={sendSampleEarningsAlert}>
            <Text style={styles.testButtonText}>
              💰 {localeInfo.isJapanese ? '売上更新' : 'Earnings Update'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={sendOptimizationTip}>
            <Text style={styles.testButtonText}>
              💡 {localeInfo.isJapanese ? '最適化ヒント' : 'Optimization Tip'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.customTestButton} 
          onPress={() => setShowTestModal(true)}
        >
          <Text style={styles.customTestButtonText}>
            ✏️ {localeInfo.isJapanese ? 'カスタムテスト' : 'Custom Test Message'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Management Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>
          🛠️ {localeInfo.isJapanese ? '管理アクション' : 'Management Actions'}
        </Text>

        <TouchableOpacity style={styles.actionButton} onPress={clearAllNotifications}>
          <Text style={styles.actionButtonText}>
            🗑️ {localeInfo.isJapanese ? 'すべての通知をクリア' : 'Clear All Notifications'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Test Modal */}
      <Modal
        visible={showTestModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {localeInfo.isJapanese ? 'カスタムテスト通知' : 'Custom Test Notification'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder={localeInfo.isJapanese ? 'メッセージを入力...' : 'Enter message...'}
              value={testMessage}
              onChangeText={setTestMessage}
              multiline={true}
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowTestModal(false)}
              >
                <Text style={styles.modalCancelText}>
                  {localeInfo.isJapanese ? 'キャンセル' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalSendButton} onPress={sendTestNotification}>
                <Text style={styles.modalSendText}>
                  {localeInfo.isJapanese ? '送信' : 'Send'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 30,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 15,
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  preferencesContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 15,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
    color: '#666',
  },
  testContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
  },
  testButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customTestButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  customTestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorCard: {
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 25,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: 'bold',
  },
  modalSendButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalSendText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SmartNotificationsManager;