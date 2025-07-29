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
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useLocalization } from '../localization/LocalizationContext';

const { width } = Dimensions.get('window');

// Advanced Vehicle Management System
class VehicleMaintenanceManager {
  constructor() {
    this.maintenanceRecords = [];
    this.vehicleInfo = {};
    this.reminderSettings = {};
    this.performanceMetrics = {};
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('vehicle_maintenance_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.maintenanceRecords = data.maintenanceRecords || [];
        this.vehicleInfo = data.vehicleInfo || {};
        this.reminderSettings = data.reminderSettings || {};
        this.performanceMetrics = data.performanceMetrics || {};
      }
    } catch (error) {
      console.error('Vehicle maintenance initialization error:', error);
    }
  }

  async addMaintenanceRecord(record) {
    try {
      const newRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...record
      };
      
      this.maintenanceRecords.push(newRecord);
      this.calculatePerformanceMetrics();
      await this.saveData();
      
      return newRecord;
    } catch (error) {
      console.error('Add maintenance record error:', error);
      return null;
    }
  }

  calculatePerformanceMetrics() {
    if (this.maintenanceRecords.length === 0) return;

    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);

    // Recent maintenance costs
    const recentRecords = this.maintenanceRecords.filter(record => record.timestamp > thirtyDaysAgo);
    const quarterlyRecords = this.maintenanceRecords.filter(record => record.timestamp > ninetyDaysAgo);

    this.performanceMetrics = {
      monthlyMaintenanceCost: recentRecords.reduce((sum, record) => sum + (record.cost || 0), 0),
      quarterlyMaintenanceCost: quarterlyRecords.reduce((sum, record) => sum + (record.cost || 0), 0),
      averageServiceInterval: this.calculateAverageServiceInterval(),
      fuelEfficiencyTrend: this.calculateFuelEfficiencyTrend(),
      upcomingMaintenanceItems: this.getUpcomingMaintenance(),
      vehicleHealthScore: this.calculateVehicleHealthScore()
    };
  }

  calculateAverageServiceInterval() {
    const serviceRecords = this.maintenanceRecords
      .filter(record => record.type === 'service')
      .sort((a, b) => a.timestamp - b.timestamp);

    if (serviceRecords.length < 2) return 0;

    const intervals = [];
    for (let i = 1; i < serviceRecords.length; i++) {
      const interval = serviceRecords[i].timestamp - serviceRecords[i-1].timestamp;
      intervals.push(interval / (24 * 60 * 60 * 1000)); // Convert to days
    }

    return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  }

  calculateFuelEfficiencyTrend() {
    const fuelRecords = this.maintenanceRecords
      .filter(record => record.type === 'fuel' && record.efficiency)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-10); // Last 10 fuel records

    if (fuelRecords.length < 3) return 'insufficient_data';

    const recent = fuelRecords.slice(-3).reduce((sum, record) => sum + record.efficiency, 0) / 3;
    const earlier = fuelRecords.slice(0, 3).reduce((sum, record) => sum + record.efficiency, 0) / 3;

    const change = ((recent - earlier) / earlier) * 100;
    
    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  getUpcomingMaintenance() {
    const currentMileage = this.vehicleInfo.currentMileage || 0;
    const lastServiceMileage = this.getLastServiceMileage();
    
    const upcomingItems = [];
    
    // Standard maintenance intervals (example for Toyota taxi)
    const maintenanceSchedule = {
      'Oil Change': { interval: 5000, lastService: lastServiceMileage.oil || 0 },
      'Brake Inspection': { interval: 10000, lastService: lastServiceMileage.brakes || 0 },
      'Tire Rotation': { interval: 8000, lastService: lastServiceMileage.tires || 0 },
      'Air Filter': { interval: 15000, lastService: lastServiceMileage.airFilter || 0 },
      'Transmission Service': { interval: 30000, lastService: lastServiceMileage.transmission || 0 }
    };

    Object.entries(maintenanceSchedule).forEach(([item, schedule]) => {
      const mileageSinceService = currentMileage - schedule.lastService;
      const mileageUntilNext = schedule.interval - mileageSinceService;
      
      if (mileageUntilNext <= 2000) { // Within 2000 km of service
        upcomingItems.push({
          item,
          mileageUntilNext: Math.max(0, mileageUntilNext),
          urgency: mileageUntilNext <= 0 ? 'overdue' : mileageUntilNext <= 500 ? 'urgent' : 'upcoming'
        });
      }
    });

    return upcomingItems.sort((a, b) => a.mileageUntilNext - b.mileageUntilNext);
  }

  getLastServiceMileage() {
    const serviceMileages = {};
    
    this.maintenanceRecords
      .filter(record => record.mileage)
      .forEach(record => {
        if (record.type === 'oil' || record.description?.toLowerCase().includes('oil')) {
          serviceMileages.oil = Math.max(serviceMileages.oil || 0, record.mileage);
        }
        if (record.type === 'brakes' || record.description?.toLowerCase().includes('brake')) {
          serviceMileages.brakes = Math.max(serviceMileages.brakes || 0, record.mileage);
        }
        // Add more service types as needed
      });

    return serviceMileages;
  }

  calculateVehicleHealthScore() {
    let score = 100;
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Recent maintenance frequency (more recent maintenance = better score)
    const recentMaintenance = this.maintenanceRecords.filter(record => record.timestamp > thirtyDaysAgo);
    if (recentMaintenance.length === 0) score -= 15;

    // Overdue maintenance
    const overdueItems = this.getUpcomingMaintenance().filter(item => item.urgency === 'overdue');
    score -= overdueItems.length * 10;

    // Fuel efficiency trend
    const fuelTrend = this.calculateFuelEfficiencyTrend();
    if (fuelTrend === 'declining') score -= 10;
    if (fuelTrend === 'improving') score += 5;

    // Vehicle age (if available)
    if (this.vehicleInfo.year) {
      const age = new Date().getFullYear() - this.vehicleInfo.year;
      if (age > 10) score -= Math.min(20, (age - 10) * 2);
    }

    return Math.max(0, Math.min(100, score));
  }

  async saveData() {
    try {
      const data = {
        maintenanceRecords: this.maintenanceRecords,
        vehicleInfo: this.vehicleInfo,
        reminderSettings: this.reminderSettings,
        performanceMetrics: this.performanceMetrics
      };
      await AsyncStorage.setItem('vehicle_maintenance_data', JSON.stringify(data));
    } catch (error) {
      console.error('Vehicle maintenance data save error:', error);
    }
  }
}

// Vehicle Maintenance Component
const VehicleMaintenanceTracker = () => {
  const [maintenanceManager] = useState(() => new VehicleMaintenanceManager());
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [newMaintenanceRecord, setNewMaintenanceRecord] = useState({
    type: 'service',
    description: '',
    cost: '',
    mileage: '',
    notes: ''
  });

  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeMaintenanceManager();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeMaintenanceManager = async () => {
    setIsLoading(true);
    try {
      await maintenanceManager.initialize();
      setMaintenanceRecords(maintenanceManager.maintenanceRecords);
      setPerformanceMetrics(maintenanceManager.performanceMetrics);
      setVehicleInfo(maintenanceManager.vehicleInfo);
    } catch (error) {
      console.error('Maintenance manager initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaintenance = async () => {
    if (!newMaintenanceRecord.description.trim()) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? '説明を入力してください' : 'Please enter a description'
      );
      return;
    }

    try {
      const record = await maintenanceManager.addMaintenanceRecord({
        ...newMaintenanceRecord,
        cost: parseFloat(newMaintenanceRecord.cost) || 0,
        mileage: parseFloat(newMaintenanceRecord.mileage) || 0
      });

      if (record) {
        setMaintenanceRecords([...maintenanceManager.maintenanceRecords]);
        setPerformanceMetrics({...maintenanceManager.performanceMetrics});
        setNewMaintenanceRecord({
          type: 'service',
          description: '',
          cost: '',
          mileage: '',
          notes: ''
        });
        setShowAddMaintenanceModal(false);
        
        Alert.alert(
          localeInfo.isJapanese ? '成功' : 'Success',
          localeInfo.isJapanese ? 'メンテナンス記録を追加しました' : 'Maintenance record added successfully'
        );
      }
    } catch (error) {
      console.error('Add maintenance error:', error);
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? 'メンテナンス記録の追加に失敗しました' : 'Failed to add maintenance record'
      );
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FF5722';
    return '#D32F2F';
  };

  const getMaintenanceCostChartData = () => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthlyRecords = maintenanceRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      
      const monthlyCost = monthlyRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
      
      last6Months.push({
        month: monthStart.toLocaleDateString(localeInfo.isJapanese ? 'ja-JP' : 'en-US', { month: 'short' }),
        cost: monthlyCost
      });
    }
    
    return {
      labels: last6Months.map(data => data.month),
      datasets: [{
        data: last6Months.map(data => data.cost)
      }]
    };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? '車両メンテナンスデータ読み込み中...' : 'Loading vehicle maintenance data...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerIcon}>🚗</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? '車両メンテナンス管理' : 'Vehicle Maintenance Manager'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {localeInfo.isJapanese 
              ? '車両の健康状態とメンテナンススケジュール'
              : 'Vehicle health monitoring and maintenance scheduling'
            }
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Vehicle Health Overview */}
      <View style={styles.healthOverview}>
        <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.healthCard}>
          <Text style={styles.healthTitle}>
            🏥 {localeInfo.isJapanese ? '車両健康スコア' : 'Vehicle Health Score'}
          </Text>
          <View style={styles.healthScoreContainer}>
            <Text style={[styles.healthScore, { color: getHealthScoreColor(performanceMetrics.vehicleHealthScore || 85) }]}>
              {Math.round(performanceMetrics.vehicleHealthScore || 85)}
            </Text>
            <Text style={styles.healthScoreLabel}>/ 100</Text>
          </View>
          <Text style={styles.healthStatus}>
            {performanceMetrics.vehicleHealthScore >= 80 
              ? (localeInfo.isJapanese ? '優良' : 'Excellent')
              : performanceMetrics.vehicleHealthScore >= 60
              ? (localeInfo.isJapanese ? '良好' : 'Good')
              : performanceMetrics.vehicleHealthScore >= 40
              ? (localeInfo.isJapanese ? '注意' : 'Attention Required')
              : (localeInfo.isJapanese ? '要対応' : 'Action Required')
            }
          </Text>
        </LinearGradient>
      </View>

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
          style={[styles.tab, activeTab === 'maintenance' && styles.activeTab]}
          onPress={() => setActiveTab('maintenance')}
        >
          <Text style={[styles.tabText, activeTab === 'maintenance' && styles.activeTabText]}>
            {localeInfo.isJapanese ? 'メンテナンス' : 'Maintenance'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '分析' : 'Analytics'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Upcoming Maintenance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ⏰ {localeInfo.isJapanese ? '今後のメンテナンス' : 'Upcoming Maintenance'}
            </Text>
            
            {performanceMetrics.upcomingMaintenanceItems?.length > 0 ? (
              performanceMetrics.upcomingMaintenanceItems.map((item, index) => (
                <View key={index} style={styles.maintenanceItem}>
                  <View style={styles.maintenanceItemHeader}>
                    <Text style={styles.maintenanceItemTitle}>{item.item}</Text>
                    <View style={[styles.urgencyBadge, { 
                      backgroundColor: item.urgency === 'overdue' ? '#D32F2F' :
                                     item.urgency === 'urgent' ? '#FF5722' : '#FF9800'
                    }]}>
                      <Text style={styles.urgencyText}>
                        {item.urgency === 'overdue' 
                          ? (localeInfo.isJapanese ? '期限切れ' : 'OVERDUE')
                          : item.urgency === 'urgent'
                          ? (localeInfo.isJapanese ? '緊急' : 'URGENT')
                          : (localeInfo.isJapanese ? '予定' : 'UPCOMING')
                        }
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.maintenanceItemDistance}>
                    {item.mileageUntilNext === 0 
                      ? (localeInfo.isJapanese ? '今すぐ対応が必要' : 'Immediate attention required')
                      : `${item.mileageUntilNext} km ${localeInfo.isJapanese ? '後' : 'remaining'}`
                    }
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                {localeInfo.isJapanese ? '予定されたメンテナンスはありません' : 'No upcoming maintenance scheduled'}
              </Text>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatCurrency(performanceMetrics.monthlyMaintenanceCost || 0)}
              </Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '今月のコスト' : 'This Month'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {Math.round(performanceMetrics.averageServiceInterval || 0)}
              </Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '平均間隔(日)' : 'Avg Interval (days)'}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                📝 {localeInfo.isJapanese ? 'メンテナンス履歴' : 'Maintenance History'}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddMaintenanceModal(true)}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>
                  {localeInfo.isJapanese ? '追加' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {maintenanceRecords.length > 0 ? (
              maintenanceRecords
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10)
                .map((record, index) => (
                  <View key={record.id || index} style={styles.recordCard}>
                    <View style={styles.recordHeader}>
                      <Text style={styles.recordType}>{record.type.toUpperCase()}</Text>
                      <Text style={styles.recordDate}>
                        {new Date(record.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.recordDescription}>{record.description}</Text>
                    <View style={styles.recordDetails}>
                      {record.cost > 0 && (
                        <Text style={styles.recordCost}>
                          💰 {formatCurrency(record.cost)}
                        </Text>
                      )}
                      {record.mileage > 0 && (
                        <Text style={styles.recordMileage}>
                          🛣️ {record.mileage.toLocaleString()} km
                        </Text>
                      )}
                    </View>
                    {record.notes && (
                      <Text style={styles.recordNotes}>📝 {record.notes}</Text>
                    )}
                  </View>
                ))
            ) : (
              <Text style={styles.noDataText}>
                {localeInfo.isJapanese ? 'メンテナンス履歴がありません' : 'No maintenance records found'}
              </Text>
            )}
          </View>
        </Animated.View>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📊 {localeInfo.isJapanese ? 'メンテナンスコスト分析' : 'Maintenance Cost Analysis'}
            </Text>
            
            {maintenanceRecords.length > 0 && (
              <View style={styles.chartContainer}>
                <BarChart
                  data={getMaintenanceCostChartData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726"
                    }
                  }}
                  style={styles.chart}
                />
              </View>
            )}

            {/* Fuel Efficiency Trend */}
            <View style={styles.trendCard}>
              <Text style={styles.trendTitle}>
                ⛽ {localeInfo.isJapanese ? '燃費トレンド' : 'Fuel Efficiency Trend'}
              </Text>
              <Text style={[styles.trendValue, {
                color: performanceMetrics.fuelEfficiencyTrend === 'improving' ? '#4CAF50' :
                       performanceMetrics.fuelEfficiencyTrend === 'declining' ? '#F44336' : '#FF9800'
              }]}>
                {performanceMetrics.fuelEfficiencyTrend === 'improving' 
                  ? (localeInfo.isJapanese ? '改善中 ↗️' : 'Improving ↗️')
                  : performanceMetrics.fuelEfficiencyTrend === 'declining'
                  ? (localeInfo.isJapanese ? '悪化中 ↘️' : 'Declining ↘️')
                  : performanceMetrics.fuelEfficiencyTrend === 'stable'
                  ? (localeInfo.isJapanese ? '安定 ➡️' : 'Stable ➡️')
                  : (localeInfo.isJapanese ? 'データ不足' : 'Insufficient Data')
                }
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Add Maintenance Modal */}
      {showAddMaintenanceModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {localeInfo.isJapanese ? 'メンテナンス記録追加' : 'Add Maintenance Record'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '説明' : 'Description'}
              value={newMaintenanceRecord.description}
              onChangeText={(text) => setNewMaintenanceRecord({...newMaintenanceRecord, description: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? 'コスト (円)' : 'Cost (¥)'}
              value={newMaintenanceRecord.cost}
              onChangeText={(text) => setNewMaintenanceRecord({...newMaintenanceRecord, cost: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '走行距離 (km)' : 'Mileage (km)'}
              value={newMaintenanceRecord.mileage}
              onChangeText={(text) => setNewMaintenanceRecord({...newMaintenanceRecord, mileage: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder={localeInfo.isJapanese ? 'メモ (任意)' : 'Notes (optional)'}
              value={newMaintenanceRecord.notes}
              onChangeText={(text) => setNewMaintenanceRecord({...newMaintenanceRecord, notes: text})}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddMaintenanceModal(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {localeInfo.isJapanese ? 'キャンセル' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddMaintenance}
              >
                <Text style={styles.saveButtonText}>
                  {localeInfo.isJapanese ? '保存' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  healthOverview: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  healthCard: {
    padding: 25,
    alignItems: 'center',
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  healthScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  healthScoreLabel: {
    fontSize: 20,
    color: '#666',
    marginLeft: 5,
  },
  healthStatus: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
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
    backgroundColor: '#FF9800',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  maintenanceItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  maintenanceItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  maintenanceItemDistance: {
    fontSize: 14,
    color: '#666',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 120,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordDate: {
    fontSize: 12,
    color: '#666',
  },
  recordDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recordCost: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  recordMileage: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  recordNotes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  trendCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 20,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehicleMaintenanceTracker;