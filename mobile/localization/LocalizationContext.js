import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './en.json';
import ja from './ja.json';

// Google Translate API configuration
const GOOGLE_TRANSLATE_API_KEY = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Replace with actual key
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

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

// Google Translate service integration
class GoogleTranslateService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.cache = new Map(); // Cache translations to avoid repeated API calls
  }

  async translateText(text, targetLanguage, sourceLanguage = 'en') {
    if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
      console.warn('Google Translate API key not configured, using fallback translations');
      return null;
    }

    // Check cache first
    const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the translation
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Google Translate error:', error);
      return null;
    }
  }

  async translateBatch(texts, targetLanguage, sourceLanguage = 'en') {
    if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
      return null;
    }

    try {
      const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations.map(t => t.translatedText);
    } catch (error) {
      console.error('Google Translate batch error:', error);
      return null;
    }
  }

  // Japanese-specific enhancements
  async translateToJapanese(text, context = 'general') {
    let translatedText = await this.translateText(text, 'ja', 'en');
    
    if (!translatedText) return null;

    // Apply Japanese business context improvements
    if (context === 'business') {
      translatedText = this.applyBusinessPoliteForm(translatedText);
    } else if (context === 'taxi') {
      translatedText = this.applyTaxiIndustryTerms(translatedText);
    } else if (context === 'weather') {
      translatedText = this.applyWeatherTerminology(translatedText);
    }

    return translatedText;
  }

  applyBusinessPoliteForm(text) {
    // Convert to more polite business forms
    const politenessMap = {
      'です。': 'でございます。',
      'ます。': 'ております。',
      'する': 'いたします',
      'できる': 'できます',
      'ある': 'ございます'
    };

    let politeText = text;
    Object.entries(politenessMap).forEach(([casual, polite]) => {
      politeText = politeText.replace(new RegExp(casual, 'g'), polite);
    });

    return politeText;
  }

  applyTaxiIndustryTerms(text) {
    // Apply taxi industry specific terminology
    const taxiTermsMap = {
      'driver': '運転手様',
      'passenger': 'お客様',
      'fare': '運賃',
      'route': '経路',
      'destination': '目的地',
      'pickup': 'お迎え',
      'surge pricing': 'サージ料金',
      'demand': '需要'
    };

    let industryText = text;
    Object.entries(taxiTermsMap).forEach(([english, japanese]) => {
      const englishPattern = new RegExp(english, 'gi');
      industryText = industryText.replace(englishPattern, japanese);
    });

    return industryText;
  }

  applyWeatherTerminology(text) {
    // Apply weather-specific terminology
    const weatherTermsMap = {
      'heavy rain': '大雨',
      'light rain': '小雨',
      'moderate rain': '中雨',
      'thunderstorm': '雷雨',
      'typhoon': '台風',
      'clear': '晴れ',
      'cloudy': '曇り',
      'snow': '雪',
      'humidity': '湿度',
      'temperature': '気温',
      'wind speed': '風速'
    };

    let weatherText = text;
    Object.entries(weatherTermsMap).forEach(([english, japanese]) => {
      const englishPattern = new RegExp(english, 'gi');
      weatherText = weatherText.replace(englishPattern, japanese);
    });

    return weatherText;
  }
}

// Initialize Google Translate service
const googleTranslateService = new GoogleTranslateService(GOOGLE_TRANSLATE_API_KEY);

// Localization Provider Component
export const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicTranslations, setDynamicTranslations] = useState({});

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

  // Enhanced translation function with Google Translate fallback
  const t = async (key, params = {}, useGoogleTranslate = false, context = 'general') => {
    const currentTranslations = translations[locale] || translations['en'];
    let translation = getNestedValue(currentTranslations, key);
    
    // If translation not found and Google Translate is enabled
    if (!translation && useGoogleTranslate && locale === 'ja') {
      // Try to get English version first
      const englishTranslation = getNestedValue(translations['en'], key);
      if (englishTranslation) {
        try {
          const googleTranslation = await googleTranslateService.translateToJapanese(
            englishTranslation, 
            context
          );
          
          if (googleTranslation) {
            // Cache the Google translation
            const cacheKey = `${locale}-${key}`;
            setDynamicTranslations(prev => ({
              ...prev,
              [cacheKey]: googleTranslation
            }));
            
            translation = googleTranslation;
          }
        } catch (error) {
          console.warn('Google Translate failed:', error);
        }
      }
    }

    // Check dynamic translations cache
    if (!translation) {
      const cacheKey = `${locale}-${key}`;
      translation = dynamicTranslations[cacheKey];
    }
    
    // Fallback to English if translation still not found
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

  // Synchronous translation function (existing translations only)
  const tSync = (key, params = {}) => {
    const currentTranslations = translations[locale] || translations['en'];
    let translation = getNestedValue(currentTranslations, key);
    
    // Check dynamic translations cache
    if (!translation) {
      const cacheKey = `${locale}-${key}`;
      translation = dynamicTranslations[cacheKey];
    }
    
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

  // Translate dynamic content using Google Translate
  const translateDynamic = async (text, context = 'general') => {
    if (locale === 'en') return text;
    
    try {
      const translated = await googleTranslateService.translateToJapanese(text, context);
      return translated || text;
    } catch (error) {
      console.warn('Dynamic translation failed:', error);
      return text;
    }
  };

  // Batch translate multiple texts
  const translateBatch = async (texts, context = 'general') => {
    if (locale === 'en') return texts;
    
    try {
      const translations = await googleTranslateService.translateBatch(texts, 'ja', 'en');
      if (translations) {
        return translations.map((translation, index) => 
          context === 'business' ? 
          googleTranslateService.applyBusinessPoliteForm(translation) : 
          translation
        );
      }
      return texts;
    } catch (error) {
      console.warn('Batch translation failed:', error);
      return texts;
    }
  };

  // Get current locale info
  const getCurrentLocaleInfo = () => {
    return {
      locale,
      isRTL: false, // Neither English nor Japanese are RTL
      isJapanese: locale === 'ja' || locale === 'ja-JP',
      isEnglish: locale === 'en' || locale === 'en-US',
      currency: locale.startsWith('ja') ? '¥' : '$',
      dateFormat: locale.startsWith('ja') ? 'YYYY年MM月DD日' : 'MM/DD/YYYY',
      googleTranslateEnabled: !!GOOGLE_TRANSLATE_API_KEY && GOOGLE_TRANSLATE_API_KEY !== 'YOUR_GOOGLE_TRANSLATE_API_KEY'
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
    t: tSync, // Synchronous version for React components
    tAsync: t, // Asynchronous version with Google Translate
    translateDynamic,
    translateBatch,
    changeLanguage,
    getCurrentLocaleInfo,
    getAvailableLanguages,
    formatCurrency,
    formatDate,
    formatTime,
    isLoading,
    googleTranslateService
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

// Japanese-specific utilities enhanced with Google Translate
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

  // Enhanced with Google Translate context
  formatForContext: async (text, context) => {
    if (googleTranslateService.apiKey && googleTranslateService.apiKey !== 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
      switch (context) {
        case 'business':
          return googleTranslateService.applyBusinessPoliteForm(text);
        case 'taxi':
          return googleTranslateService.applyTaxiIndustryTerms(text);
        case 'weather':
          return googleTranslateService.applyWeatherTerminology(text);
        default:
          return text;
      }
    }
    return text;
  }
};

// Weather-specific translations enhanced with Google Translate
export const WeatherLocalization = {
  getWeatherCondition: async (condition, locale, useGoogleTranslate = false) => {
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
    
    let result = weatherMap[locale]?.[condition] || condition;
    
    // Enhance with Google Translate if enabled
    if (useGoogleTranslate && locale === 'ja' && !weatherMap[locale]?.[condition]) {
      try {
        const enhanced = await googleTranslateService.translateToJapanese(condition, 'weather');
        return enhanced || result;
      } catch (error) {
        console.warn('Weather translation enhancement failed:', error);
      }
    }
    
    return result;
  }
};

export default LocalizationProvider;