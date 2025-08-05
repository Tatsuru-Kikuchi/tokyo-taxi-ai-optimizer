import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { registerRootComponent } from 'expo';

const { width, height } = Dimensions.get('window');

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentRevenue, setCurrentRevenue] = useState(25200);
  const [optimizedRevenue, setOptimizedRevenue] = useState(33150);
  const [aiAccuracy, setAiAccuracy] = useState(87);
  const [demandLevel, setDemandLevel] = useState('High');
  const [weatherCondition, setWeatherCondition] = useState('Rain');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const dataTimer = setInterval(() => {
      setAiAccuracy(prev => Math.min(100, prev + Math.random() * 2 - 1));
      setDemandLevel(
        Math.random() > 0.5 ? 'High' : 
        Math.random() > 0.3 ? 'Medium' : 'Low'
      );
    }, 10000);
    return () => clearInterval(dataTimer);
  }, []);

  const revenueIncrease = ((optimizedRevenue - currentRevenue) / currentRevenue * 100).toFixed(1);
  const dailyIncrease = optimizedRevenue - currentRevenue;
  const annualIncrease = dailyIncrease * 365;

  const handleOptimizeRoute = () => {
    Alert.alert(
      '🎯 Route Optimized!',
      `AI suggests heading to Shibuya Station area.\nExpected wait time: 3.2 minutes\nDemand surge: +42%\nWeather bonus: Rain detected (+18%)`,
      [{ text: 'Navigate', style: 'default' }, { text: 'Dismiss', style: 'cancel' }]
    );
  };

  const handleWeatherAlert = () => {
    Alert.alert(
      '⛈️ Weather Opportunity!',
      `Rain started in Shinjuku area.\nExpected demand increase: +34%\nRecommended position: Near train stations\nEstimated additional revenue: ¥2,400/hour`,
      [{ text: 'Go to Area', style: 'default' }, { text: 'Later', style: 'cancel' }]
    );
  };

  const handleMapView = () => {
    Alert.alert(
      '🗺️ Interactive Map',
      `Map Features Coming Soon:\n• Rain zones visualization\n• Demand hotspots\n• Optimal pickup locations\n• Real-time traffic data\n• Customer locations`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleWeatherForecast = () => {
    Alert.alert(
      '🌦️ AI Weather Forecast',
      `Next 3 Hours:\n14:00 - Light Rain (Shibuya +25% demand)\n15:00 - Heavy Rain (Shinjuku +45% demand)\n16:00 - Cloudy (Normal demand)\n\nRecommendation: Position near Shibuya Station`,
      [{ text: 'Set Alert', style: 'default' }, { text: 'Close', style: 'cancel' }]
    );
  };

  const handleDemandAnalysis = () => {
    Alert.alert(
      '📊 AI Demand Analysis',
      `Current Hotspots:\n🔥 Shibuya Station - Very High\n🔥 Shinjuku South - High\n🟡 Tokyo Station - Medium\n🟢 Ginza - Low\n\nPredicted in 30min:\n📈 Roppongi Hills +60%\n📈 Akasaka +35%`,
      [{ text: 'Navigate', style: 'default' }, { text: 'Close', style: 'cancel' }]
    );
  };

  const StatCard = ({ title, value, subtitle, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const FeatureCard = ({ icon, title, description, onPress }) => (
    <TouchableOpacity
      style={styles.featureCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const TabButton = ({ id, icon, label, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderHomeContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          おはよう！ {currentTime.getHours() < 12 ? '朝' : currentTime.getHours() < 18 ? '午後' : '夜'}の運転
        </Text>
        <Text style={styles.dateTime}>
          {currentTime.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
      </View>

      {/* AI Status Banner - Fixed without LinearGradient */}
      <View style={styles.aiBanner}>
        <View style={styles.aiBannerContent}>
          <Text style={styles.aiBannerTitle}>🤖 AI最適化システム</Text>
          <Text style={styles.aiBannerStatus}>稼働中 • 精度 {aiAccuracy.toFixed(1)}%</Text>
        </View>
        <TouchableOpacity style={styles.optimizeButton} onPress={handleOptimizeRoute}>
          <Text style={styles.optimizeButtonText}>最適化</Text>
        </TouchableOpacity>
      </View>

      {/* Revenue Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 収益分析</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="本日の収益"
            value={`¥${currentRevenue.toLocaleString()}`}
            subtitle="従来システム"
            color="#95a5a6"
          />
          <StatCard
            title="AI最適化後"
            value={`¥${optimizedRevenue.toLocaleString()}`}
            subtitle={`+¥${dailyIncrease.toLocaleString()} (+${revenueIncrease}%)`}
            color="#2ecc71"
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            title="年間増収予測"
            value={`¥${(annualIncrease / 1000).toFixed(0)}万`}
            subtitle="285万円の追加収入"
            color="#f39c12"
          />
          <StatCard
            title="現在の需要"
            value={demandLevel}
            subtitle={weatherCondition === 'Rain' ? '雨天ボーナス +18%' : '通常レベル'}
            color={demandLevel === 'High' ? '#e74c3c' : demandLevel === 'Medium' ? '#f39c12' : '#95a5a6'}
            onPress={handleWeatherAlert}
          />
        </View>
      </View>

      {/* Enhanced Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ クイックアクション</Text>
        <View style={styles.actionsGrid}>
          <FeatureCard
            icon="🎯"
            title="需要予測"
            description="3時間先までの需要を87%精度で予測"
            onPress={handleDemandAnalysis}
          />
          <FeatureCard
            icon="⛈️"
            title="天気連動"
            description="雨天時の需要増加を活用した最適化"
            onPress={handleWeatherForecast}
          />
          <FeatureCard
            icon="🚆"
            title="交通情報"
            description="電車遅延による需要急増を検知"
            onPress={() => Alert.alert('交通情報', 'JR山手線: 5分遅延\n→ 品川駅周辺で需要増加予測\n→ 推定追加収益: ¥1,800')}
          />
          <FeatureCard
            icon="🗺️"
            title="マップ表示"
            description="雨エリア・需要ホットスポット・最適ルート"
            onPress={handleMapView}
          />
        </View>
      </View>

      {/* New Map Integration Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗺️ リアルタイムマップ</Text>
        <View style={styles.mapPreview}>
          <Text style={styles.mapTitle}>📍 現在の最適エリア</Text>
          <View style={styles.mapInfo}>
            <Text style={styles.mapLocation}>🎯 推奨位置: 渋谷駅周辺</Text>
            <Text style={styles.mapWeather}>🌧️ 雨エリア: 新宿・池袋</Text>
            <Text style={styles.mapDemand}>📈 高需要: 六本木ヒルズ</Text>
          </View>
          <TouchableOpacity style={styles.mapButton} onPress={handleMapView}>
            <Text style={styles.mapButtonText}>フルマップを表示</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Research Foundation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔬 研究基盤</Text>
        <View style={styles.researchCard}>
          <Text style={styles.researchTitle}>先進的経済学研究に基づくシステム</Text>
          <Text style={styles.researchDescription}>
            • 3ヶ月間の実証実験データ（150台のタクシー）{"\n"}
            • 統計的有意性: p &lt; 0.01（99%信頼区間）{"\n"}
            • 雨天時需要相関係数: 0.847{"\n"}
            • 経済効果: 年間171億円の業界インパクト
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderAnalyticsContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 詳細分析</Text>
        
        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>分単位収益</Text>
            <View style={styles.metricComparison}>
              <Text style={styles.metricBefore}>¥52.3</Text>
              <Text style={styles.metricArrow}>→</Text>
              <Text style={styles.metricAfter}>¥68.1</Text>
              <Text style={styles.metricImprovement}>+30.2%</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>待機時間</Text>
            <View style={styles.metricComparison}>
              <Text style={styles.metricBefore}>6.8分</Text>
              <Text style={styles.metricArrow}>→</Text>
              <Text style={styles.metricAfter}>4.2分</Text>
              <Text style={styles.metricImprovement}>-38.2%</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>稼働率</Text>
            <View style={styles.metricComparison}>
              <Text style={styles.metricBefore}>65%</Text>
              <Text style={styles.metricArrow}>→</Text>
              <Text style={styles.metricAfter}>83%</Text>
              <Text style={styles.metricImprovement}>+27.7%</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Weather & Demand Analytics */}
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>🌦️ 3時間天気予測</Text>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastTime}>14:00</Text>
            <Text style={styles.forecastWeather}>🌧️ 小雨</Text>
            <Text style={styles.forecastDemand}>需要 +25%</Text>
          </View>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastTime}>15:00</Text>
            <Text style={styles.forecastWeather}>⛈️ 強雨</Text>
            <Text style={styles.forecastDemand}>需要 +45%</Text>
          </View>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastTime}>16:00</Text>
            <Text style={styles.forecastWeather}>☁️ 曇り</Text>
            <Text style={styles.forecastDemand}>需要 通常</Text>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>🧠 AI洞察</Text>
          <Text style={styles.insightsText}>
            • 雨天時の収益は平均84.7%増加{"\n"}
            • 朝の通勤時間帯（7-9時）が最も効率的{"\n"}
            • 渋谷-新宿間のルートが最高収益{"\n"}
            • 電車遅延時の駅周辺需要は156%増加
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettingsContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ 設定</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>🔔 通知設定</Text>
          <Text style={styles.settingValue}>オン</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>🌍 言語</Text>
          <Text style={styles.settingValue}>日本語</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>📊 データ同期</Text>
          <Text style={styles.settingValue}>自動</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>🔐 プライバシー</Text>
          <Text style={styles.settingValue}>設定済み</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>🗺️ マップ設定</Text>
          <Text style={styles.settingValue}>準備中</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>📞 配車機能</Text>
          <Text style={styles.settingValue}>開発中</Text>
        </TouchableOpacity>
        
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>アプリについて</Text>
          <Text style={styles.aboutText}>
            Tokyo Taxi AI Optimizer v1.2.0{"\n"}
            先進的経済学研究に基づく{"\n"}
            科学的実証済みシステム{"\n"}
            {"\n"}
            開発者: Tatsuru Kikuchi{"\n"}
            研究機関: 経済学研究所{"\n"}
            技術協力: ODPT, 気象庁{"\n"}
            {"\n"}
            🚀 近日追加予定:{"\n"}
            • Google Maps統合{"\n"}
            • リアルタイム配車{"\n"}
            • チャット機能
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Content */}
      {activeTab === 'home' && renderHomeContent()}
      {activeTab === 'analytics' && renderAnalyticsContent()}
      {activeTab === 'settings' && renderSettingsContent()}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TabButton
          id="home"
          icon="🏠"
          label="ホーム"
          isActive={activeTab === 'home'}
          onPress={setActiveTab}
        />
        <TabButton
          id="analytics"
          icon="📊"
          label="分析"
          isActive={activeTab === 'analytics'}
          onPress={setActiveTab}
        />
        <TabButton
          id="settings"
          icon="⚙️"
          label="設定"
          isActive={activeTab === 'settings'}
          onPress={setActiveTab}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  // Fixed aiBanner without LinearGradient
  aiBanner: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#667eea', // Solid color instead of gradient
  },
  aiBannerContent: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  aiBannerStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  optimizeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  optimizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flex: 0.48,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#95a5a6',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  // New Map Preview Section
  mapPreview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  mapInfo: {
    marginBottom: 15,
  },
  mapLocation: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 5,
    fontWeight: '500',
  },
  mapWeather: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 5,
  },
  mapDemand: {
    fontSize: 14,
    color: '#f39c12',
  },
  mapButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Weather Forecast Card
  forecastCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  forecastTime: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  forecastWeather: {
    fontSize: 14,
    flex: 1.5,
    textAlign: 'center',
  },
  forecastDemand: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  researchCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  researchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  researchDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  metricsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  metricLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  metricComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  metricBefore: {
    fontSize: 14,
    color: '#95a5a6',
    marginRight: 8,
  },
  metricArrow: {
    fontSize: 16,
    color: '#3498db',
    marginRight: 8,
  },
  metricAfter: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
    marginRight: 8,
  },
  metricImprovement: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  insightsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  insightsText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  settingValue: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  aboutSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabIconActive: {
    fontSize: 26,
  },
  tabLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  tabLabelActive: {
    color: '#667eea',
    fontWeight: '500',
  },
});

// Register the main component
registerRootComponent(App);

export default App;