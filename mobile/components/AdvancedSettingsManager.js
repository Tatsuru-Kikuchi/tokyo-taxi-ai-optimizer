import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalization } from '../localization/LocalizationContext';

// Advanced data management and backup system
class DataManager {
  constructor() {
    this.backupVersion = '1.0';
    this.dataTypes = [
      'earnings_analytics',
      'notification_preferences',
      'user_settings',
      'performance_history',
      'optimization_data'
    ];
  }

  // Export all user data
  async exportAllData() {
    try {
      const exportData = {
        version: this.backupVersion,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        data: {}
      };

      // Collect all stored data
      for (const dataType of this.dataTypes) {
        try {
          const data = await AsyncStorage.getItem(dataType);
          if (data) {
            exportData.data[dataType] = JSON.parse(data);
          }
        } catch (error) {
          console.warn(`Failed to export ${dataType}:`, error);
        }
      }

      // Add system information
      exportData.systemInfo = {
        platform: 'iOS',
        appVersion: '1.0.0',
        exportCount: Object.keys(exportData.data).length
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Data export failed:', error);
      throw new Error('Failed to export data');
    }
  }

  // Import data from backup
  async importData(backupData) {
    try {
      const parsedData = JSON.parse(backupData);
      
      if (!parsedData.version || !parsedData.data) {
        throw new Error('Invalid backup format');
      }

      let importCount = 0;
      const errors = [];

      // Import each data type
      for (const [dataType, data] of Object.entries(parsedData.data)) {
        try {
          await AsyncStorage.setItem(dataType, JSON.stringify(data));
          importCount++;
        } catch (error) {
          errors.push(`${dataType}: ${error.message}`);
        }
      }

      return {
        success: true,
        importCount,
        errors,
        totalItems: Object.keys(parsedData.data).length
      };
    } catch (error) {
      console.error('Data import failed:', error);
      throw new Error('Failed to import data: ' + error.message);
    }
  }

  // Clear all user data
  async clearAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => this.dataTypes.includes(key));
      
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
      }
      
      return appKeys.length;
    } catch (error) {
      console.error('Data clearing failed:', error);
      throw new Error('Failed to clear data');
    }
  }

  // Get storage usage statistics
  async getStorageStats() {
    try {
      const stats = {
        totalItems: 0,
        totalSize: 0,
        breakdown: {}
      };

      for (const dataType of this.dataTypes) {
        try {
          const data = await AsyncStorage.getItem(dataType);
          if (data) {
            stats.totalItems++;
            stats.totalSize += data.length;
            stats.breakdown[dataType] = {
              size: data.length,
              lastModified: Date.now() // Approximate
            };
          }
        } catch (error) {
          console.warn(`Failed to get stats for ${dataType}:`, error);
        }
      }

      return stats;
    } catch (error) {
      console.error('Storage stats failed:', error);
      return { totalItems: 0, totalSize: 0, breakdown: {} };
    }
  }

  // Generate analytics report
  async generateAnalyticsReport() {
    try {
      const earningsData = await AsyncStorage.getItem('earnings_analytics');
      const settingsData = await AsyncStorage.getItem('user_settings');
      
      if (!earningsData) {
        throw new Error('No analytics data available');
      }

      const earnings = JSON.parse(earningsData);
      const settings = settingsData ? JSON.parse(settingsData) : {};

      const report = {
        generatedAt: new Date().toISOString(),
        period: '30 days',
        summary: this.calculateEarningsSummary(earnings),
        performance: this.calculatePerformanceMetrics(earnings),
        recommendations: this.generateRecommendations(earnings),
        settings: settings
      };

      return this.formatReportAsText(report);
    } catch (error) {
      console.error('Report generation failed:', error);
      throw new Error('Failed to generate report');
    }
  }

  calculateEarningsSummary(earnings) {
    if (!earnings.earningsHistory || earnings.earningsHistory.length === 0) {
      return { message: 'No earnings data available' };
    }

    const history = earnings.earningsHistory;
    const total = history.reduce((sum, item) => sum + item.amount, 0);
    const average = total / history.length;
    const rides = history.length;

    return {
      totalEarnings: Math.round(total),
      averagePerRide: Math.round(average),
      totalRides: rides,
      period: `${history.length} rides recorded`
    };
  }

  calculatePerformanceMetrics(earnings) {
    if (!earnings.performanceMetrics) {
      return { message: 'No performance metrics available' };
    }

    return earnings.performanceMetrics;
  }

  generateRecommendations(earnings) {
    const recommendations = [];

    if (earnings.performanceMetrics?.bestHour) {
      recommendations.push(`Optimize for hour ${earnings.performanceMetrics.bestHour.hour}:00`);
    }

    if (earnings.performanceMetrics?.recentTrend === 'declining') {
      recommendations.push('Consider adjusting strategy - recent trend declining');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current optimization strategy');
    }

    return recommendations;
  }

  formatReportAsText(report) {
    return `
TAXI OPTIMIZATION ANALYTICS REPORT
Generated: ${new Date(report.generatedAt).toLocaleString()}
Period: ${report.period}

EARNINGS SUMMARY:
- Total Earnings: ¥${report.summary.totalEarnings?.toLocaleString() || 'N/A'}
- Average per Ride: ¥${report.summary.averagePerRide?.toLocaleString() || 'N/A'}
- Total Rides: ${report.summary.totalRides || 'N/A'}

PERFORMANCE METRICS:
- Efficiency: ¥${Math.round(report.performance.efficiency || 0)}/hour
- Best Hour: ${report.performance.bestHour?.hour || 'N/A'}:00
- Recent Trend: ${report.performance.recentTrend || 'N/A'}

RECOMMENDATIONS:
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

Generated by Tokyo Taxi AI Optimizer
Contact: tatsuru.kikuchi@gmail.com
    `.trim();
  }
}

// Professional settings and data management component
const AdvancedSettingsManager = () => {
  const [dataManager] = useState(() => new DataManager());
  const [storageStats, setStorageStats] = useState({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { t, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    try {
      const stats = await dataManager.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const handleExportData = async () => {
    setIsProcessing(true);
    try {
      const data = await dataManager.exportAllData();
      setExportData(data);
      setShowExportModal(true);
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'エクスポートエラー' : 'Export Error',
        error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareExport = async () => {
    try {
      const fileName = `taxi-optimizer-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      await Share.share({
        message: exportData,
        title: localeInfo.isJapanese ? 'タクシー最適化データ' : 'Taxi Optimizer Data',
      });
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'シェアエラー' : 'Share Error',
        error.message
      );
    }
  };

  const handleSaveExport = async () => {
    try {
      const fileName = `taxi-optimizer-backup-${Date.now()}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, exportData);
      
      Alert.alert(
        localeInfo.isJapanese ? '保存完了' : 'Saved',
        localeInfo.isJapanese 
          ? `ファイルが保存されました: ${fileName}`
          : `File saved: ${fileName}`
      );
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? '保存エラー' : 'Save Error',
        error.message
      );
    }
  };

  const handleImportData = async () => {
    if (!importData.trim()) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? 'データを入力してください' : 'Please enter data to import'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const result = await dataManager.importData(importData);
      
      Alert.alert(
        localeInfo.isJapanese ? 'インポート完了' : 'Import Complete',
        localeInfo.isJapanese 
          ? `${result.importCount}件のアイテムをインポートしました`
          : `Imported ${result.importCount} items successfully`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowImportModal(false);
              setImportData('');
              loadStorageStats();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'インポートエラー' : 'Import Error',
        error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets[0]) {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
        setImportData(fileContent);
      }
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'ファイル選択エラー' : 'File Selection Error',
        error.message
      );
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      localeInfo.isJapanese ? '全データ削除' : 'Clear All Data',
      localeInfo.isJapanese 
        ? 'すべてのデータを削除しますか？この操作は元に戻せません。'
        : 'Are you sure you want to clear all data? This action cannot be undone.',
      [
        { text: localeInfo.isJapanese ? 'キャンセル' : 'Cancel', style: 'cancel' },
        {
          text: localeInfo.isJapanese ? '削除' : 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              const clearedCount = await dataManager.clearAllData();
              Alert.alert(
                localeInfo.isJapanese ? '削除完了' : 'Data Cleared',
                localeInfo.isJapanese 
                  ? `${clearedCount}件のアイテムを削除しました`
                  : `Cleared ${clearedCount} items`
              );
              loadStorageStats();
            } catch (error) {
              Alert.alert(
                localeInfo.isJapanese ? 'エラー' : 'Error',
                error.message
              );
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const handleGenerateReport = async () => {
    setIsProcessing(true);
    try {
      const report = await dataManager.generateAnalyticsReport();
      
      await Share.share({
        message: report,
        title: localeInfo.isJapanese ? 'タクシー最適化レポート' : 'Taxi Optimization Report',
      });
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'レポートエラー' : 'Report Error',
        error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
        <Text style={styles.headerTitle}>
          ⚙️ {localeInfo.isJapanese ? '高度な設定管理' : 'Advanced Settings'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {localeInfo.isJapanese 
            ? 'データ管理・バックアップ・分析'
            : 'Data Management, Backup & Analytics'
          }
        </Text>
      </LinearGradient>

      {/* Storage Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>
          📊 {localeInfo.isJapanese ? 'ストレージ統計' : 'Storage Statistics'}
        </Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>
            {localeInfo.isJapanese ? 'データアイテム数' : 'Data Items'}
          </Text>
          <Text style={styles.statValue}>{storageStats.totalItems || 0}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>
            {localeInfo.isJapanese ? '使用容量' : 'Storage Used'}
          </Text>
          <Text style={styles.statValue}>{formatFileSize(storageStats.totalSize || 0)}</Text>
        </View>

        {storageStats.breakdown && Object.keys(storageStats.breakdown).length > 0 && (
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>
              {localeInfo.isJapanese ? '詳細内訳' : 'Breakdown'}
            </Text>
            {Object.entries(storageStats.breakdown).map(([key, data]) => (
              <View key={key} style={styles.breakdownItem}>
                <Text style={styles.breakdownKey}>{key}</Text>
                <Text style={styles.breakdownValue}>{formatFileSize(data.size)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Data Management Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>
          💾 {localeInfo.isJapanese ? 'データ管理' : 'Data Management'}
        </Text>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleExportData}
          disabled={isProcessing}
        >
          <Text style={styles.actionButtonText}>
            📤 {localeInfo.isJapanese ? 'データエクスポート' : 'Export Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowImportModal(true)}
          disabled={isProcessing}
        >
          <Text style={styles.actionButtonText}>
            📥 {localeInfo.isJapanese ? 'データインポート' : 'Import Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleGenerateReport}
          disabled={isProcessing}
        >
          <Text style={styles.actionButtonText}>
            📋 {localeInfo.isJapanese ? 'レポート生成' : 'Generate Report'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleClearAllData}
          disabled={isProcessing}
        >
          <Text style={styles.dangerButtonText}>
            🗑️ {localeInfo.isJapanese ? '全データクリア' : 'Clear All Data'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>
          ℹ️ {localeInfo.isJapanese ? 'アプリ情報' : 'App Information'}
        </Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {localeInfo.isJapanese ? 'バージョン' : 'Version'}
          </Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {localeInfo.isJapanese ? 'プラットフォーム' : 'Platform'}
          </Text>
          <Text style={styles.infoValue}>iOS</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {localeInfo.isJapanese ? '開発者' : 'Developer'}
          </Text>
          <Text style={styles.infoValue}>Tatsuru Kikuchi</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {localeInfo.isJapanese ? '連絡先' : 'Contact'}
          </Text>
          <Text style={styles.infoValue}>tatsuru.kikuchi@gmail.com</Text>
        </View>
      </View>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {localeInfo.isJapanese ? 'データエクスポート' : 'Export Data'}
            </Text>
            
            <Text style={styles.modalDescription}>
              {localeInfo.isJapanese 
                ? 'エクスポートが完了しました。データを共有または保存してください。'
                : 'Export completed. Share or save your data.'
              }
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleShareExport}>
                <Text style={styles.modalButtonText}>
                  📤 {localeInfo.isJapanese ? '共有' : 'Share'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveExport}>
                <Text style={styles.modalButtonText}>
                  💾 {localeInfo.isJapanese ? '保存' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.modalCloseText}>
                {localeInfo.isJapanese ? '閉じる' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={showImportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {localeInfo.isJapanese ? 'データインポート' : 'Import Data'}
            </Text>
            
            <TouchableOpacity style={styles.filePickerButton} onPress={handlePickFile}>
              <Text style={styles.filePickerText}>
                📁 {localeInfo.isJapanese ? 'ファイルを選択' : 'Choose File'}
              </Text>
            </TouchableOpacity>
            
            <TextInput
              style={styles.importInput}
              placeholder={localeInfo.isJapanese ? 'または直接貼り付け...' : 'Or paste data directly...'}
              value={importData}
              onChangeText={setImportData}
              multiline={true}
              numberOfLines={6}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowImportModal(false);
                  setImportData('');
                }}
              >
                <Text style={styles.modalCancelText}>
                  {localeInfo.isJapanese ? 'キャンセル' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalImportButton}
                onPress={handleImportData}
                disabled={isProcessing || !importData.trim()}
              >
                <Text style={styles.modalImportText}>
                  {isProcessing 
                    ? (localeInfo.isJapanese ? '処理中...' : 'Processing...')
                    : (localeInfo.isJapanese ? 'インポート' : 'Import')
                  }
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
  },
  statsContainer: {
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  breakdownContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  breakdownKey: {
    fontSize: 12,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 12,
    color: '#333',
  },
  actionsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalCloseButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#666',
    fontWeight: 'bold',
  },
  filePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  filePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  importInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
    maxHeight: 150,
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
  modalImportButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalImportText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdvancedSettingsManager;