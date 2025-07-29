import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useLocalization } from '../localization/LocalizationContext';

const { width } = Dimensions.get('window');

// Advanced Customer Relationship Management System
class CustomerRelationshipManager {
  constructor() {
    this.customers = [];
    this.rideHistory = [];
    this.loyaltyProgram = {};
    this.customerInsights = {};
    this.communicationLogs = [];
    this.preferences = {};
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('crm_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.customers = data.customers || [];
        this.rideHistory = data.rideHistory || [];
        this.loyaltyProgram = data.loyaltyProgram || {};
        this.customerInsights = data.customerInsights || {};
        this.communicationLogs = data.communicationLogs || [];
        this.preferences = data.preferences || {};
      }
      
      if (this.customers.length === 0) {
        this.generateSampleData();
      }
      
      this.calculateCustomerInsights();
    } catch (error) {
      console.error('CRM initialization error:', error);
    }
  }

  generateSampleData() {
    const sampleCustomers = [
      {
        id: 'cust_001',
        name: 'Tanaka Hiroshi',
        phone: '+81-90-1234-5678',
        email: 'tanaka.h@example.com',
        firstRide: Date.now() - (30 * 24 * 60 * 60 * 1000),
        lastRide: Date.now() - (2 * 24 * 60 * 60 * 1000),
        totalRides: 15,
        totalSpent: 45000,
        averageRating: 4.8,
        preferredPayment: 'cash',
        frequentDestinations: ['Shibuya', 'Ginza', 'Tokyo Station'],
        loyaltyTier: 'gold',
        preferences: {
          temperature: 22,
          music: false,
          conversation: 'minimal',
          route: 'fastest'
        },
        notes: 'Always punctual, prefers quiet rides'
      },
      {
        id: 'cust_002',
        name: 'Yamada Keiko',
        phone: '+81-80-9876-5432',
        email: 'yamada.k@company.co.jp',
        firstRide: Date.now() - (60 * 24 * 60 * 60 * 1000),
        lastRide: Date.now() - (1 * 24 * 60 * 60 * 1000),
        totalRides: 28,
        totalSpent: 89000,
        averageRating: 4.9,
        preferredPayment: 'card',
        frequentDestinations: ['Roppongi', 'Shinjuku', 'Haneda Airport'],
        loyaltyTier: 'platinum',
        preferences: {
          temperature: 20,
          music: true,
          conversation: 'friendly',
          route: 'scenic'
        },
        notes: 'Business traveler, often needs airport runs'
      },
      {
        id: 'cust_003',
        name: 'Sato Takeshi',
        phone: '+81-70-5555-1234',
        email: 'sato.t@gmail.com',
        firstRide: Date.now() - (90 * 24 * 60 * 60 * 1000),
        lastRide: Date.now() - (7 * 24 * 60 * 60 * 1000),
        totalRides: 42,
        totalSpent: 156000,
        averageRating: 4.7,
        preferredPayment: 'digital',
        frequentDestinations: ['Akihabara', 'Shibuya', 'Odaiba'],
        loyaltyTier: 'diamond',
        preferences: {
          temperature: 24,
          music: true,
          conversation: 'chatty',
          route: 'efficient'
        },
        notes: 'Tech enthusiast, likes to discuss latest gadgets'
      }
    ];

    this.customers = sampleCustomers;

    // Generate ride history
    this.customers.forEach(customer => {
      for (let i = 0; i < customer.totalRides; i++) {
        const rideDate = new Date(customer.firstRide + (i * ((customer.lastRide - customer.firstRide) / customer.totalRides)));
        const destination = customer.frequentDestinations[Math.floor(Math.random() * customer.frequentDestinations.length)];
        
        this.rideHistory.push({
          id: `ride_${customer.id}_${i}`,
          customerId: customer.id,
          date: rideDate.getTime(),
          pickup: 'Various',
          destination: destination,
          fare: 2000 + (Math.random() * 8000),
          duration: 15 + (Math.random() * 45),
          distance: 3 + (Math.random() * 20),
          rating: customer.averageRating + ((Math.random() - 0.5) * 0.4),
          paymentMethod: customer.preferredPayment,
          weather: ['clear', 'cloudy', 'rain'][Math.floor(Math.random() * 3)],
          feedback: this.generateRandomFeedback()
        });
      }
    });

    // Initialize loyalty program
    this.loyaltyProgram = {
      tiers: {
        bronze: { minRides: 0, discount: 0, benefits: ['Basic support'] },
        silver: { minRides: 10, discount: 5, benefits: ['5% discount', 'Priority booking'] },
        gold: { minRides: 25, discount: 10, benefits: ['10% discount', 'Priority booking', 'Free water'] },
        platinum: { minRides: 50, discount: 15, benefits: ['15% discount', 'VIP support', 'Free amenities'] },
        diamond: { minRides: 100, discount: 20, benefits: ['20% discount', 'Personal concierge', 'Premium vehicle'] }
      },
      points: {}
    };

    this.customers.forEach(customer => {
      this.loyaltyProgram.points[customer.id] = customer.totalRides * 10;
    });
  }

  generateRandomFeedback() {
    const feedbacks = [
      'Great service, very professional driver',
      'Clean car and smooth ride',
      'Driver was very helpful with directions',
      'Excellent experience, will use again',
      'Fast and efficient service',
      'Driver was courteous and punctual',
      'Comfortable ride, good conversation',
      'Professional service, clean vehicle'
    ];
    return Math.random() > 0.3 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : '';
  }

  calculateCustomerInsights() {
    // Customer lifetime value analysis
    this.customerInsights.lifetimeValues = this.customers.map(customer => ({
      customerId: customer.id,
      name: customer.name,
      ltv: customer.totalSpent,
      avgRideValue: customer.totalSpent / customer.totalRides,
      frequency: customer.totalRides / ((Date.now() - customer.firstRide) / (30 * 24 * 60 * 60 * 1000)) // rides per month
    })).sort((a, b) => b.ltv - a.ltv);

    // Revenue analysis by customer tier
    this.customerInsights.revenueByTier = {};
    this.customers.forEach(customer => {
      if (!this.customerInsights.revenueByTier[customer.loyaltyTier]) {
        this.customerInsights.revenueByTier[customer.loyaltyTier] = 0;
      }
      this.customerInsights.revenueByTier[customer.loyaltyTier] += customer.totalSpent;
    });

    // Monthly retention analysis
    this.customerInsights.retentionAnalysis = this.calculateRetentionRates();

    // Popular destinations
    this.customerInsights.popularDestinations = this.analyzePopularDestinations();

    // Customer satisfaction trends
    this.customerInsights.satisfactionTrends = this.analyzeSatisfactionTrends();

    // Risk analysis (customers at risk of churning)
    this.customerInsights.churnRisk = this.identifyChurnRisks();
  }

  calculateRetentionRates() {
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    
    const activeCustomers = this.customers.filter(customer => 
      (now - customer.lastRide) < oneMonth
    ).length;
    
    const totalCustomers = this.customers.length;
    
    return {
      activeCustomers,
      totalCustomers,
      retentionRate: totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0,
      churnRate: totalCustomers > 0 ? ((totalCustomers - activeCustomers) / totalCustomers) * 100 : 0
    };
  }

  analyzePopularDestinations() {
    const destinationCounts = {};
    
    this.rideHistory.forEach(ride => {
      destinationCounts[ride.destination] = (destinationCounts[ride.destination] || 0) + 1;
    });

    return Object.entries(destinationCounts)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  analyzeSatisfactionTrends() {
    const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentRides = this.rideHistory.filter(ride => ride.date > last30Days);
    
    if (recentRides.length === 0) return { average: 0, trend: 'stable' };
    
    const averageRating = recentRides.reduce((sum, ride) => sum + ride.rating, 0) / recentRides.length;
    
    // Compare with previous period
    const previous30Days = last30Days - (30 * 24 * 60 * 60 * 1000);
    const previousRides = this.rideHistory.filter(ride => 
      ride.date > previous30Days && ride.date <= last30Days
    );
    
    if (previousRides.length === 0) return { average: averageRating, trend: 'stable' };
    
    const previousAverage = previousRides.reduce((sum, ride) => sum + ride.rating, 0) / previousRides.length;
    const change = averageRating - previousAverage;
    
    return {
      average: averageRating,
      trend: change > 0.1 ? 'improving' : change < -0.1 ? 'declining' : 'stable',
      change: change
    };
  }

  identifyChurnRisks() {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    return this.customers.filter(customer => {
      const daysSinceLastRide = (now - customer.lastRide) / (24 * 60 * 60 * 1000);
      const averageRideFrequency = customer.totalRides / ((now - customer.firstRide) / (24 * 60 * 60 * 1000));
      
      // Customer is at risk if they haven't ridden in longer than their usual frequency
      const expectedNextRide = customer.lastRide + (1 / averageRideFrequency * 24 * 60 * 60 * 1000);
      
      return now > expectedNextRide && daysSinceLastRide > 7;
    }).map(customer => ({
      ...customer,
      riskLevel: this.calculateRiskLevel(customer),
      daysSinceLastRide: Math.floor((now - customer.lastRide) / (24 * 60 * 60 * 1000))
    }));
  }

  calculateRiskLevel(customer) {
    const now = Date.now();
    const daysSinceLastRide = (now - customer.lastRide) / (24 * 60 * 60 * 1000);
    
    if (daysSinceLastRide > 30) return 'high';
    if (daysSinceLastRide > 14) return 'medium';
    return 'low';
  }

  async addCustomer(customerData) {
    try {
      const newCustomer = {
        id: `cust_${Date.now()}`,
        ...customerData,
        firstRide: Date.now(),
        lastRide: Date.now(),
        totalRides: 0,
        totalSpent: 0,
        averageRating: 0,
        loyaltyTier: 'bronze'
      };
      
      this.customers.push(newCustomer);
      this.loyaltyProgram.points[newCustomer.id] = 0;
      
      await this.saveData();
      this.calculateCustomerInsights();
      
      return newCustomer;
    } catch (error) {
      console.error('Add customer error:', error);
      return null;
    }
  }

  async updateCustomerPreferences(customerId, preferences) {
    try {
      const customerIndex = this.customers.findIndex(c => c.id === customerId);
      if (customerIndex !== -1) {
        this.customers[customerIndex].preferences = { ...this.customers[customerIndex].preferences, ...preferences };
        await this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update customer preferences error:', error);
      return false;
    }
  }

  async addCommunicationLog(customerId, type, content) {
    try {
      const log = {
        id: Date.now().toString(),
        customerId,
        type, // 'call', 'message', 'email', 'feedback'
        content,
        timestamp: Date.now(),
        status: 'completed'
      };
      
      this.communicationLogs.push(log);
      await this.saveData();
      
      return log;
    } catch (error) {
      console.error('Add communication log error:', error);
      return null;
    }
  }

  getLoyaltyBenefits(customerId) {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) return null;
    
    const tier = this.loyaltyProgram.tiers[customer.loyaltyTier];
    const points = this.loyaltyProgram.points[customerId] || 0;
    
    return {
      tier: customer.loyaltyTier,
      points,
      discount: tier.discount,
      benefits: tier.benefits,
      nextTier: this.getNextTier(customer.loyaltyTier),
      ridesUntilNextTier: this.getRidesUntilNextTier(customer)
    };
  }

  getNextTier(currentTier) {
    const tiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }

  getRidesUntilNextTier(customer) {
    const nextTier = this.getNextTier(customer.loyaltyTier);
    if (!nextTier) return 0;
    
    const nextTierRequirement = this.loyaltyProgram.tiers[nextTier].minRides;
    return Math.max(0, nextTierRequirement - customer.totalRides);
  }

  async saveData() {
    try {
      const data = {
        customers: this.customers,
        rideHistory: this.rideHistory,
        loyaltyProgram: this.loyaltyProgram,
        customerInsights: this.customerInsights,
        communicationLogs: this.communicationLogs,
        preferences: this.preferences
      };
      await AsyncStorage.setItem('crm_data', JSON.stringify(data));
    } catch (error) {
      console.error('CRM data save error:', error);
    }
  }
}

// Customer Relationship Management Component
const CustomerRelationshipSystem = () => {
  const [crmManager] = useState(() => new CustomerRelationshipManager());
  const [customers, setCustomers] = useState([]);
  const [customerInsights, setCustomerInsights] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    preferences: {
      temperature: 22,
      music: false,
      conversation: 'minimal',
      route: 'fastest'
    }
  });

  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeCRM();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeCRM = async () => {
    setIsLoading(true);
    try {
      await crmManager.initialize();
      setCustomers(crmManager.customers);
      setCustomerInsights(crmManager.customerInsights);
    } catch (error) {
      console.error('CRM initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? '名前と電話番号を入力してください' : 'Please enter name and phone number'
      );
      return;
    }

    try {
      const customer = await crmManager.addCustomer(newCustomer);
      if (customer) {
        setCustomers([...crmManager.customers]);
        setCustomerInsights({...crmManager.customerInsights});
        setNewCustomer({
          name: '',
          phone: '',
          email: '',
          preferences: {
            temperature: 22,
            music: false,
            conversation: 'minimal',
            route: 'fastest'
          }
        });
        setShowAddCustomerModal(false);
        
        Alert.alert(
          localeInfo.isJapanese ? '成功' : 'Success',
          localeInfo.isJapanese ? '顧客を追加しました' : 'Customer added successfully'
        );
      }
    } catch (error) {
      console.error('Add customer error:', error);
    }
  };

  const getCustomerTierColor = (tier) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2',
      diamond: '#B9F2FF'
    };
    return colors[tier] || '#999';
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      high: '#F44336',
      medium: '#FF9800',
      low: '#4CAF50'
    };
    return colors[level] || '#999';
  };

  const getCustomerRevenueData = () => {
    if (!customerInsights.revenueByTier) return [];
    
    return Object.entries(customerInsights.revenueByTier).map(([tier, revenue]) => ({
      name: tier.charAt(0).toUpperCase() + tier.slice(1),
      population: revenue,
      color: getCustomerTierColor(tier),
      legendFontColor: '#333',
      legendFontSize: 12
    }));
  };

  const getTopCustomersData = () => {
    if (!customerInsights.lifetimeValues) return { labels: [], datasets: [{ data: [] }] };
    
    const topCustomers = customerInsights.lifetimeValues.slice(0, 5);
    return {
      labels: topCustomers.map(customer => customer.name.split(' ')[0]),
      datasets: [{
        data: topCustomers.map(customer => customer.ltv)
      }]
    };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? '顧客データ読み込み中...' : 'Loading customer data...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#E91E63', '#C2185B']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerIcon}>👥</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? '顧客関係管理システム' : 'Customer Relationship Management'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {localeInfo.isJapanese 
              ? '顧客満足度向上と収益最大化のための総合CRM'
              : 'Comprehensive CRM for customer satisfaction and revenue optimization'
            }
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Customer Overview Stats */}
      <View style={styles.statsContainer}>
        <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.statsCard}>
          <Text style={styles.statsTitle}>
            📊 {localeInfo.isJapanese ? '顧客概要' : 'Customer Overview'}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{customers.length}</Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '総顧客数' : 'Total Customers'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {customerInsights.retentionAnalysis ? 
                  `${Math.round(customerInsights.retentionAnalysis.retentionRate)}%` : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '顧客維持率' : 'Retention Rate'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {customerInsights.lifetimeValues ? 
                  formatCurrency(Math.round(customerInsights.lifetimeValues.reduce((sum, c) => sum + c.ltv, 0) / customerInsights.lifetimeValues.length)) : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '平均LTV' : 'Avg LTV'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {customerInsights.satisfactionTrends ? 
                  customerInsights.satisfactionTrends.average.toFixed(1) : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '満足度' : 'Satisfaction'}
              </Text>
            </View>
          </View>
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
          style={[styles.tab, activeTab === 'customers' && styles.activeTab]}
          onPress={() => setActiveTab('customers')}
        >
          <Text style={[styles.tabText, activeTab === 'customers' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '顧客' : 'Customers'}
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
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'loyalty' && styles.activeTab]}
          onPress={() => setActiveTab('loyalty')}
        >
          <Text style={[styles.tabText, activeTab === 'loyalty' && styles.activeTabText]}>
            {localeInfo.isJapanese ? 'ロイヤルティ' : 'Loyalty'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Revenue by Tier Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              💰 {localeInfo.isJapanese ? 'ティア別収益分析' : 'Revenue by Customer Tier'}
            </Text>
            
            {getCustomerRevenueData().length > 0 && (
              <View style={styles.chartContainer}>
                <PieChart
                  data={getCustomerRevenueData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            )}
          </View>

          {/* Top Customers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏆 {localeInfo.isJapanese ? 'トップ顧客 (LTV)' : 'Top Customers (LTV)'}
            </Text>
            
            {customerInsights.lifetimeValues && (
              <View style={styles.chartContainer}>
                <BarChart
                  data={getTopCustomersData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  style={styles.chart}
                />
              </View>
            )}
          </View>

          {/* Churn Risk Alerts */}
          {customerInsights.churnRisk && customerInsights.churnRisk.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                ⚠️ {localeInfo.isJapanese ? '離脱リスク顧客' : 'Customers at Risk'}
              </Text>
              
              {customerInsights.churnRisk.slice(0, 3).map((customer, index) => (
                <View key={customer.id} style={styles.riskCustomerCard}>
                  <View style={styles.riskCustomerHeader}>
                    <Text style={styles.riskCustomerName}>{customer.name}</Text>
                    <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(customer.riskLevel) }]}>
                      <Text style={styles.riskBadgeText}>
                        {customer.riskLevel === 'high' ? (localeInfo.isJapanese ? '高' : 'HIGH') :
                         customer.riskLevel === 'medium' ? (localeInfo.isJapanese ? '中' : 'MED') :
                         (localeInfo.isJapanese ? '低' : 'LOW')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.riskCustomerInfo}>
                    {localeInfo.isJapanese ? '最終利用' : 'Last ride'}: {customer.daysSinceLastRide} {localeInfo.isJapanese ? '日前' : 'days ago'}
                  </Text>
                  <Text style={styles.riskCustomerInfo}>
                    LTV: {formatCurrency(customer.totalSpent)} | {localeInfo.isJapanese ? '利用回数' : 'Rides'}: {customer.totalRides}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                👥 {localeInfo.isJapanese ? '顧客一覧' : 'Customer List'}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddCustomerModal(true)}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>
                  {localeInfo.isJapanese ? '追加' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={customers}
              keyExtractor={(item) => item.id}
              renderItem={({ item: customer }) => (
                <TouchableOpacity
                  style={styles.customerCard}
                  onPress={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(true);
                  }}
                >
                  <View style={styles.customerHeader}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <View style={[styles.tierBadge, { backgroundColor: getCustomerTierColor(customer.loyaltyTier) }]}>
                      <Text style={styles.tierBadgeText}>
                        {customer.loyaltyTier.charAt(0).toUpperCase() + customer.loyaltyTier.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.customerStats}>
                    <Text style={styles.customerStat}>
                      {localeInfo.isJapanese ? '利用回数' : 'Rides'}: {customer.totalRides}
                    </Text>
                    <Text style={styles.customerStat}>
                      LTV: {formatCurrency(customer.totalSpent)}
                    </Text>
                    <Text style={styles.customerStat}>
                      {localeInfo.isJapanese ? '評価' : 'Rating'}: ⭐ {customer.averageRating.toFixed(1)}
                    </Text>
                  </View>
                  <Text style={styles.customerLastRide}>
                    {localeInfo.isJapanese ? '最終利用' : 'Last ride'}: {new Date(customer.lastRide).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </View>
        </Animated.View>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          visible={showCustomerModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCustomerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.customerModalContainer}>
              <View style={styles.customerModalHeader}>
                <Text style={styles.customerModalTitle}>{selectedCustomer.name}</Text>
                <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.customerModalContent}>
                <View style={styles.customerDetailSection}>
                  <Text style={styles.customerDetailTitle}>
                    📞 {localeInfo.isJapanese ? '連絡先情報' : 'Contact Information'}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? '電話' : 'Phone'}: {selectedCustomer.phone}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? 'メール' : 'Email'}: {selectedCustomer.email}
                  </Text>
                </View>

                <View style={styles.customerDetailSection}>
                  <Text style={styles.customerDetailTitle}>
                    🏆 {localeInfo.isJapanese ? 'ロイヤルティ情報' : 'Loyalty Information'}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? 'ティア' : 'Tier'}: {selectedCustomer.loyaltyTier.charAt(0).toUpperCase() + selectedCustomer.loyaltyTier.slice(1)}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? '総利用回数' : 'Total Rides'}: {selectedCustomer.totalRides}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? '総支払額' : 'Total Spent'}: {formatCurrency(selectedCustomer.totalSpent)}
                  </Text>
                </View>

                <View style={styles.customerDetailSection}>
                  <Text style={styles.customerDetailTitle}>
                    ⚙️ {localeInfo.isJapanese ? '顧客設定' : 'Preferences'}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? '車内温度' : 'Temperature'}: {selectedCustomer.preferences?.temperature || 'N/A'}°C
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? '音楽' : 'Music'}: {selectedCustomer.preferences?.music ? 
                      (localeInfo.isJapanese ? 'あり' : 'Yes') : (localeInfo.isJapanese ? 'なし' : 'No')}
                  </Text>
                  <Text style={styles.customerDetailText}>
                    {localeInfo.isJapanese ? '会話レベル' : 'Conversation'}: {selectedCustomer.preferences?.conversation || 'N/A'}
                  </Text>
                </View>

                {selectedCustomer.notes && (
                  <View style={styles.customerDetailSection}>
                    <Text style={styles.customerDetailTitle}>
                      📝 {localeInfo.isJapanese ? 'メモ' : 'Notes'}
                    </Text>
                    <Text style={styles.customerDetailText}>{selectedCustomer.notes}</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Customer Modal */}
      <Modal
        visible={showAddCustomerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCustomerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {localeInfo.isJapanese ? '新規顧客追加' : 'Add New Customer'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '顧客名' : 'Customer Name'}
              value={newCustomer.name}
              onChangeText={(text) => setNewCustomer({...newCustomer, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '電話番号' : 'Phone Number'}
              value={newCustomer.phone}
              onChangeText={(text) => setNewCustomer({...newCustomer, phone: text})}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? 'メールアドレス (任意)' : 'Email (optional)'}
              value={newCustomer.email}
              onChangeText={(text) => setNewCustomer({...newCustomer, email: text})}
              keyboardType="email-address"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddCustomerModal(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {localeInfo.isJapanese ? 'キャンセル' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCustomer}
              >
                <Text style={styles.saveButtonText}>
                  {localeInfo.isJapanese ? '保存' : 'Save'}
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
  statsContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsCard: {
    padding: 25,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
    backgroundColor: '#E91E63',
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
    backgroundColor: '#E91E63',
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
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  riskCustomerCard: {
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
  riskCustomerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskCustomerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  riskCustomerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  customerCard: {
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
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tierBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customerStat: {
    fontSize: 12,
    color: '#666',
  },
  customerLastRide: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
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
    padding: 25,
    borderRadius: 20,
    maxHeight: '80%',
    width: '90%',
  },
  customerModalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    maxHeight: '90%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  customerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customerModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  customerModalContent: {
    padding: 20,
  },
  customerDetailSection: {
    marginBottom: 20,
  },
  customerDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  customerDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
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
    backgroundColor: '#E91E63',
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

export default CustomerRelationshipSystem;