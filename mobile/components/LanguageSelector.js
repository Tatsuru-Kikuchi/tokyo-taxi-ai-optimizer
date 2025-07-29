import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from '../localization/LocalizationContext';

const LanguageSelector = ({ visible, onClose }) => {
  const { locale, changeLanguage, getAvailableLanguages } = useLocalization();
  const languages = getAvailableLanguages();

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select Language / 言語選択</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.languageList}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    locale === language.code && styles.selectedLanguage
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageContent}>
                    <Text style={styles.languageFlag}>
                      {language.code === 'ja' ? '🇯🇵' : '🇺🇸'}
                    </Text>
                    <View style={styles.languageText}>
                      <Text style={styles.languageName}>{language.name}</Text>
                      <Text style={styles.languageNative}>{language.nativeName}</Text>
                    </View>
                    {locale === language.code && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Language settings are saved automatically
              </Text>
              <Text style={styles.footerTextJa}>
                言語設定は自動的に保存されます
              </Text>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageList: {
    padding: 20,
  },
  languageOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguage: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 30,
    marginRight: 15,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  checkmark: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerTextJa: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});

export default LanguageSelector;