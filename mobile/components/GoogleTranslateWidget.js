import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from '../localization/LocalizationContext';

const GoogleTranslateWidget = ({ onTranslationComplete }) => {
  const { locale, translateDynamic, translateBatch, getCurrentLocaleInfo } = useLocalization();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const localeInfo = getCurrentLocaleInfo();

  // Sample dynamic content for testing
  const [dynamicContent, setDynamicContent] = useState([
    "Welcome to our taxi service",
    "Your ride will arrive in 5 minutes",
    "Heavy rainfall detected in your area",
    "Surge pricing is now active",
    "Thank you for choosing our service"
  ]);

  const [translatedContent, setTranslatedContent] = useState([]);

  const handleSingleTranslation = async () => {
    if (!localeInfo.googleTranslateEnabled) {
      Alert.alert(
        localeInfo.isJapanese ? 'Google翻訳未設定' : 'Google Translate Not Configured',
        localeInfo.isJapanese 
          ? 'Google翻訳APIキーが設定されていません。' 
          : 'Google Translate API key is not configured.'
      );
      return;
    }

    setIsTranslating(true);
    
    try {
      const sampleText = "The weather conditions are perfect for increased taxi demand.";
      const translated = await translateDynamic(sampleText, 'taxi');
      
      const newTranslation = {
        id: Date.now(),
        original: sampleText,
        translated: translated,
        timestamp: new Date().toLocaleTimeString(),
        context: 'taxi'
      };

      setTranslationHistory(prev => [newTranslation, ...prev.slice(0, 4)]);
      
      Alert.alert(
        localeInfo.isJapanese ? '翻訳完了' : 'Translation Complete',
        localeInfo.isJapanese 
          ? `翻訳されました: ${translated}`
          : `Translated: ${translated}`
      );

      if (onTranslationComplete) {
        onTranslationComplete(newTranslation);
      }
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese 
          ? '翻訳中にエラーが発生しました'
          : 'An error occurred during translation'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleBatchTranslation = async () => {
    if (!localeInfo.googleTranslateEnabled) {
      Alert.alert(
        localeInfo.isJapanese ? 'Google翻訳未設定' : 'Google Translate Not Configured',
        localeInfo.isJapanese 
          ? 'Google翻訳APIキーが設定されていません。' 
          : 'Google Translate API key is not configured.'
      );
      return;
    }

    setIsTranslating(true);
    
    try {
      const batchTranslated = await translateBatch(dynamicContent, 'business');
      setTranslatedContent(batchTranslated);
      
      Alert.alert(
        localeInfo.isJapanese ? 'バッチ翻訳完了' : 'Batch Translation Complete',
        localeInfo.isJapanese 
          ? `${batchTranslated.length}件の項目が翻訳されました`
          : `${batchTranslated.length} items have been translated`
      );
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese 
          ? 'バッチ翻訳中にエラーが発生しました'
          : 'An error occurred during batch translation'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const getContextColor = (context) => {
    switch (context) {
      case 'business': return '#2196F3';
      case 'taxi': return '#4CAF50';
      case 'weather': return '#FF9800';
      default: return '#757575';
    }
  };

  const getContextName = (context) => {
    if (localeInfo.isJapanese) {
      switch (context) {
        case 'business': return 'ビジネス';
        case 'taxi': return 'タクシー';
        case 'weather': return '天気';
        default: return '一般';
      }
    } else {
      return context.charAt(0).toUpperCase() + context.slice(1);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🌐</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? 'Google翻訳統合' : 'Google Translate Integration'}
          </Text>
          {localeInfo.googleTranslateEnabled && (
            <View style={styles.enabledBadge}>
              <Text style={styles.enabledText}>
                {localeInfo.isJapanese ? '有効' : 'Enabled'}
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {localeInfo.googleTranslateEnabled 
              ? (localeInfo.isJapanese ? '✅ Google翻訳APIが利用可能です' : '✅ Google Translate API is available')
              : (localeInfo.isJapanese ? '⚠️ Google翻訳APIキーを設定してください' : '⚠️ Please configure Google Translate API key')
            }
          </Text>
        </View>

        {/* Translation Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.singleButton]}
            onPress={handleSingleTranslation}
            disabled={isTranslating || !localeInfo.googleTranslateEnabled}
          >
            {isTranslating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>🔤</Text>
                <Text style={styles.buttonText}>
                  {localeInfo.isJapanese ? 'テスト翻訳' : 'Test Translation'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.batchButton]}
            onPress={handleBatchTranslation}
            disabled={isTranslating || !localeInfo.googleTranslateEnabled}
          >
            {isTranslating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>📋</Text>
                <Text style={styles.buttonText}>
                  {localeInfo.isJapanese ? 'バッチ翻訳' : 'Batch Translation'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Translation History */}
        {translationHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>
              {localeInfo.isJapanese ? '最近の翻訳' : 'Recent Translations'}
            </Text>
            {translationHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <View style={[styles.contextBadge, { backgroundColor: getContextColor(item.context) }]}>
                    <Text style={styles.contextText}>{getContextName(item.context)}</Text>
                  </View>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.originalText}>{item.original}</Text>
                <Text style={styles.translatedText}>{item.translated}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Batch Translation Results */}
        {translatedContent.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {localeInfo.isJapanese ? 'バッチ翻訳結果' : 'Batch Translation Results'}
            </Text>
            {translatedContent.map((translation, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.originalText}>{dynamicContent[index]}</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.translatedText}>{translation}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>
            {localeInfo.isJapanese ? '翻訳機能' : 'Translation Features'}
          </Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>
              {localeInfo.isJapanese 
                ? 'コンテキスト別翻訳（ビジネス、タクシー、天気）'
                : 'Context-aware translation (Business, Taxi, Weather)'
              }
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={styles.featureText}>
              {localeInfo.isJapanese 
                ? 'バッチ翻訳でパフォーマンス最適化'
                : 'Batch translation for performance optimization'
              }
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💾</Text>
            <Text style={styles.featureText}>
              {localeInfo.isJapanese 
                ? 'キャッシュ機能でAPI使用量を削減'
                : 'Caching system to reduce API usage'
              }
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎭</Text>
            <Text style={styles.featureText}>
              {localeInfo.isJapanese 
                ? '日本語敬語の自動適用'
                : 'Automatic Japanese politeness level adjustment'
              }
            </Text>
          </View>
        </View>

        {/* Configuration Help */}
        {!localeInfo.googleTranslateEnabled && (
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>
              {localeInfo.isJapanese ? '設定方法' : 'Configuration Guide'}
            </Text>
            <Text style={styles.helpText}>
              {localeInfo.isJapanese 
                ? '1. Google Cloud ConsoleでTranslate APIを有効化\n2. APIキーを取得\n3. LocalizationContext.jsのGOOGLE_TRANSLATE_API_KEYを更新'
                : '1. Enable Translate API in Google Cloud Console\n2. Obtain API key\n3. Update GOOGLE_TRANSLATE_API_KEY in LocalizationContext.js'
              }
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  enabledBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  enabledText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  singleButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  batchButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  contextText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  originalText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  translatedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  arrow: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 2,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  featureText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    flex: 1,
  },
  helpContainer: {
    backgroundColor: 'rgba(255,193,7,0.2)',
    padding: 12,
    borderRadius: 10,
  },
  helpTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    lineHeight: 16,
  },
});

export default GoogleTranslateWidget;