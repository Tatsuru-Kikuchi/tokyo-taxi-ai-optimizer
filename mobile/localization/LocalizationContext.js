import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './en.json';
import ja from './ja.json';

// Available translations
const translations = {
  en: en,
  ja: ja,
  'ja-JP': ja, // iOS locale format
  'en-US': en  // iOS locale format
};

// Create context
const LocalizationContext = createContext({});

// Custom hook to use localization
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

// Get nested object value using dot notation
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Localization Provider Component (No External APIs Required)
export const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize localization
  useEffect(() => {
    initializeLocalization();
  }, []);

  const initializeLocalization = async () => {
    try {
      // Check for saved language preference
      const savedLocale = await AsyncStorage.getItem('user_language');
      
      if (savedLocale && translations[savedLocale]) {
        setLocale(savedLocale);
      } else {
        // Detect device locale
        const deviceLocale = Localization.locale;
        const primaryLocale = deviceLocale.split('-')[0]; // Get 'ja' from 'ja-JP'
        
        // Set locale based on device language
        if (translations[deviceLocale]) {
          setLocale(deviceLocale);
        } else if (translations[primaryLocale]) {
          setLocale(primaryLocale);
        } else {
          setLocale('en'); // Fallback to English
        }
      }
    } catch (error) {
      console.warn('Failed to initialize localization:', error);
      setLocale('en'); // Fallback to English
    } finally {
      setIsLoading(false);
    }
  };

  // Change language function
  const changeLanguage = async (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      try {
        await AsyncStorage.setItem('user_language', newLocale);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  };

  // Get translation function (Static translations only)
  const t = (key, params = {}) => {
    const currentTranslations = translations[locale] || translations['en'];
    let translation = getNestedValue(currentTranslations, key);
    
    // Fallback to English if translation not found
    if (!translation && locale !== 'en') {
      translation = getNestedValue(translations['en'], key);
    }
    
    // Fallback to key if still not found
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
      return key;
    }

    // Replace parameters in translation
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return translation;
  };

  // Get current locale info
  const getCurrentLocaleInfo = () => {
    return {
      locale,
      isRTL: false, // Neither English nor Japanese are RTL
      isJapanese: locale === 'ja' || locale === 'ja-JP',
      isEnglish: locale === 'en' || locale === 'en-US',
      currency: locale.startsWith('ja') ? '¥' : '$',
      dateFormat: locale.startsWith('ja') ? 'YYYY年MM月DD日' : 'MM/DD/YYYY'
    };
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' }
    ];
  };

  // Format currency based on locale
  const formatCurrency = (amount) => {
    const info = getCurrentLocaleInfo();
    if (info.isJapanese) {
      return `¥${amount.toLocaleString('ja-JP')}`;
    } else {
      return `¥${amount.toLocaleString('en-US')}`;
    }
  };

  // Format date based on locale
  const formatDate = (date) => {
    const info = getCurrentLocaleInfo();
    if (info.isJapanese) {
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Format time based on locale
  const formatTime = (date) => {
    const info = getCurrentLocaleInfo();
    if (info.isJapanese) {
      return date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Context value
  const value = {
    locale,
    t,
    changeLanguage,
    getCurrentLocaleInfo,
    getAvailableLanguages,
    formatCurrency,
    formatDate,
    formatTime,
    isLoading
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Higher-order component for class components
export const withLocalization = (WrappedComponent) => {
  return function LocalizedComponent(props) {
    const localization = useLocalization();
    return <WrappedComponent {...props} localization={localization} />;
  };
};

// Utility functions for manual usage
export const getSupportedLocales = () => Object.keys(translations);

export const isLocaleSupported = (locale) => {
  return translations.hasOwnProperty(locale);
};

// Japanese-specific utilities (No API required)
export const JapaneseUtils = {
  // Convert full-width numbers to half-width
  convertNumbers: (text) => {
    return text.replace(/[０-９]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
    });
  },

  // Format Japanese addresses
  formatAddress: (prefecture, city, district) => {
    return `${prefecture}${city}${district}`;
  },

  // Business hours formatting for Japan
  formatBusinessHours: (openTime, closeTime) => {
    return `営業時間: ${openTime}〜${closeTime}`;
  },

  // Polite form helpers
  addPoliteEnding: (text) => {
    if (!text.endsWith('です') && !text.endsWith('ます') && !text.endsWith('ございます')) {
      return `${text}です`;
    }
    return text;
  },

  // Business context formatting
  formatForBusinessContext: (text) => {
    // Add appropriate business politeness
    const businessEnhancements = {
      'ありがとう': 'ありがとうございます',
      'です': 'でございます',
      'お客さん': 'お客様',
      '運転手': '運転手様'
    };

    let enhancedText = text;
    Object.entries(businessEnhancements).forEach(([casual, polite]) => {
      enhancedText = enhancedText.replace(new RegExp(casual, 'g'), polite);
    });

    return enhancedText;
  }
};

// Weather-specific translations (Static only)
export const WeatherLocalization = {
  getWeatherCondition: (condition, locale) => {
    const weatherMap = {
      'en': {
        'rain': 'Rain',
        'heavy_rain': 'Heavy Rain',
        'light_rain': 'Light Rain',
        'snow': 'Snow',
        'clear': 'Clear',
        'cloudy': 'Cloudy',
        'typhoon': 'Typhoon'
      },
      'ja': {
        'rain': '雨',
        'heavy_rain': '大雨',
        'light_rain': '小雨',
        'snow': '雪',
        'clear': '晴れ',
        'cloudy': '曇り',
        'typhoon': '台風'
      }
    };
    
    return weatherMap[locale]?.[condition] || condition;
  }
};

export default LocalizationProvider;