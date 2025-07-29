import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from '../localization/LocalizationContext';

const EarningsCard = ({ earnings, onPress, animated = true }) => {
  const { formatCurrency, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();
  
  const [animatedValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [animated]);

  const animatedEarnings = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, earnings.currentHour],
  });

  const getEarningsStatus = () => {
    const hourlyTarget = 2500; // Target earnings per hour
    const performance = (earnings.currentHour / hourlyTarget) * 100;
    
    if (performance >= 120) {
      return {
        status: localeInfo.isJapanese ? '絶好調！' : 'Excellent!',
        color: '#4CAF50',
        icon: '🔥'
      };
    } else if (performance >= 100) {
      return {
        status: localeInfo.isJapanese ? '好調' : 'Good',
        color: '#2196F3', 
        icon: '✨'
      };
    } else if (performance >= 80) {
      return {
        status: localeInfo.isJapanese ? '普通' : 'Average',
        color: '#FF9800',
        icon: '📈'
      };
    } else {
      return {
        status: localeInfo.isJapanese ? '改善の余地あり' : 'Room for improvement',
        color: '#757575',
        icon: '💪'
      };
    }
  };

  const earningsStatus = getEarningsStatus();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardIcon}>💰</Text>
            <Text style={styles.cardTitle}>
              {localeInfo.isJapanese ? 'リアルタイム収益' : 'Real-time Earnings'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: earningsStatus.color }]}>
            <Text style={styles.statusIcon}>{earningsStatus.icon}</Text>
            <Text style={styles.statusText}>{earningsStatus.status}</Text>
          </View>
        </View>

        {/* Main earnings display */}
        <View style={styles.mainEarnings}>
          <View style={styles.currentHourContainer}>
            <Text style={styles.currentHourLabel}>
              {localeInfo.isJapanese ? '今時間' : 'Current Hour'}
            </Text>
            {animated ? (
              <Animated.Text style={styles.currentHourValue}>
                {animatedEarnings.interpolate({
                  inputRange: [0, earnings.currentHour],
                  outputRange: [0, earnings.currentHour],
                })}
              </Animated.Text>
            ) : (
              <Text style={styles.currentHourValue}>
                {formatCurrency(earnings.currentHour)}
              </Text>
            )}
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(100, (earnings.currentHour / 2500) * 100)}%`,
                    backgroundColor: earningsStatus.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {localeInfo.isJapanese ? '時間目標: ¥2,500' : 'Hourly Target: ¥2,500'}
            </Text>
          </View>
        </View>

        {/* Earnings breakdown */}
        <View style={styles.breakdown}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownIcon}>📊</Text>
            <View style={styles.breakdownText}>
              <Text style={styles.breakdownLabel}>
                {localeInfo.isJapanese ? '本日合計' : 'Today Total'}
              </Text>
              <Text style={styles.breakdownValue}>
                {formatCurrency(earnings.todayTotal)}
              </Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownIcon}>🌧️</Text>
            <View style={styles.breakdownText}>
              <Text style={styles.breakdownLabel}>
                {localeInfo.isJapanese ? '天気ボーナス' : 'Weather Bonus'}
              </Text>
              <Text style={[styles.breakdownValue, styles.bonusValue]}>
                +{formatCurrency(earnings.weatherBonus)}
              </Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownIcon}>🎯</Text>
            <View style={styles.breakdownText}>
              <Text style={styles.breakdownLabel}>
                {localeInfo.isJapanese ? '本日予想' : 'Daily Projection'}
              </Text>
              <Text style={styles.breakdownValue}>
                {formatCurrency(earnings.projectedDaily)}
              </Text>
            </View>
          </View>
        </View>

        {/* Growth indicators */}
        <View style={styles.growthContainer}>
          <View style={styles.growthItem}>
            <Text style={styles.growthIcon}>📈</Text>
            <Text style={styles.growthText}>
              +{((earnings.weatherBonus / earnings.todayTotal) * 100).toFixed(1)}%{' '}
              {localeInfo.isJapanese ? '天気による増加' : 'weather boost'}
            </Text>
          </View>
          
          <View style={styles.growthItem}>
            <Text style={styles.growthIcon}>⚡</Text>
            <Text style={styles.growthText}>
              {localeInfo.isJapanese ? '30.2% 平均向上' : '30.2% avg improvement'}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            {localeInfo.isJapanese 
              ? '雨の日は需要の高いエリアに移動して収益を最大化しましょう'
              : 'Maximize earnings by positioning in high-demand areas during rain'
            }
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainEarnings: {
    marginBottom: 25,
  },
  currentHourContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  currentHourLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  currentHourValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  breakdown: {
    marginBottom: 20,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  breakdownIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  breakdownText: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bonusValue: {
    color: '#4CAF50',
  },
  growthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  growthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  growthIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  growthText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    flex: 1,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
    flex: 1,
  },
});

export default EarningsCard;