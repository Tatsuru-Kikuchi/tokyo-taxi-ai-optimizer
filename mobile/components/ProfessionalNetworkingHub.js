import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Calendar from 'expo-calendar';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '../localization/LocalizationContext';

// Professional networking and integration system
class ProfessionalNetworking {
  constructor() {
    this.integrations = {
      calendar: false,
      contacts: false,
      location: false,
      notifications: false
    };
    this.businessContacts = [];
    this.scheduledEvents = [];
  }

  async initializeIntegrations() {
    const results = {};
    
    // Calendar integration
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      results.calendar = status === 'granted';
      this.integrations.calendar = results.calendar;
    } catch (error) {
      console.warn('Calendar permission error:', error);
      results.calendar = false;
    }

    // Contacts integration
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      results.contacts = status === 'granted';
      this.integrations.contacts = results.contacts;
    } catch (error) {
      console.warn('Contacts permission error:', error);
      results.contacts = false;
    }

    // Location integration
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      results.location = status === 'granted';
      this.integrations.location = results.location;
    } catch (error) {
      console.warn('Location permission error:', error);
      results.location = false;
    }

    return results;
  }

  // Create business calendar events
  async createOptimizationEvent(eventData) {
    if (!this.integrations.calendar) {
      throw new Error('Calendar access not granted');
    }

    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.source.name === 'Default') || calendars[0];

      if (!defaultCalendar) {
        throw new Error('No calendar available');
      }

      const eventDetails = {
        title: eventData.title,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: eventData.location,
        notes: eventData.notes,
        alarms: eventData.alarms || []
      };

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
      return eventId;
    } catch (error) {
      console.error('Calendar event creation failed:', error);
      throw error;
    }
  }

  // Add business contacts
  async addBusinessContact(contactData) {
    if (!this.integrations.contacts) {
      throw new Error('Contacts access not granted');
    }

    try {
      const contact = {
        name: contactData.name,
        phoneNumbers: contactData.phoneNumbers || [],
        emails: contactData.emails || [],
        company: contactData.company || '',
        jobTitle: contactData.jobTitle || '',
        note: contactData.note || ''
      };

      const contactId = await Contacts.addContactAsync(contact);
      return contactId;
    } catch (error) {
      console.error('Contact addition failed:', error);
      throw error;
    }
  }

  // Generate business networking recommendations
  generateNetworkingOpportunities() {
    return [
      {
        type: 'taxi_company',
        title: 'Tokyo Taxi Companies',
        description: 'Connect with major taxi companies for partnership opportunities',
        contacts: [
          { name: 'Tokyo Taxi Co.', phone: '+81-3-1234-5678', email: 'info@tokyotaxi.co.jp' },
          { name: 'Nihon Kotsu', phone: '+81-3-5755-2336', email: 'contact@nihon-kotsu.co.jp' },
          { name: 'Kokusai Motorcars', phone: '+81-3-3581-4151', email: 'info@km-group.co.jp' }
        ]
      },
      {
        type: 'technology',
        title: 'Technology Partners',
        description: 'Connect with tech companies for app integration',
        contacts: [
          { name: 'Japan AI Research', phone: '+81-3-8888-9999', email: 'partner@ai-research.jp' },
          { name: 'Tokyo Tech Hub', phone: '+81-3-7777-8888', email: 'contact@tech-hub.tokyo' }
        ]
      },
      {
        type: 'industry',
        title: 'Industry Associations',
        description: 'Join professional taxi industry organizations',
        contacts: [
          { name: 'Japan Taxi Association', phone: '+81-3-3264-8080', email: 'info@taxi-japan.or.jp' },
          { name: 'Tokyo Transport Union', phone: '+81-3-5555-6666', email: 'contact@transport-tokyo.jp' }
        ]
      }
    ];
  }

  // Create business calendar templates
  getBusinessCalendarTemplates() {
    const now = new Date();
    
    return [
      {
        title: 'Peak Hour Strategy Meeting',
        description: 'Weekly review of peak hour performance and optimization',
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
        duration: 60, // minutes
        recurring: 'weekly',
        location: 'Shibuya Office',
        notes: 'Review earnings data and adjust positioning strategy'
      },
      {
        title: 'Weather Impact Analysis',
        description: 'Monthly analysis of weather patterns on taxi demand',
        startTime: new Date(now.getFullYear(), now.getMonth() + 1, 1), // Next month
        duration: 90,
        recurring: 'monthly',
        location: 'Home Office',
        notes: 'Analyze correlation between weather and earnings'
      },
      {
        title: 'Vehicle Maintenance Check',
        description: 'Regular vehicle maintenance and inspection',
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        duration: 120,
        recurring: 'bi-weekly',
        location: 'Service Center',
        notes: 'Ensure optimal vehicle performance for maximum earnings'
      }
    ];
  }

  // Professional development suggestions
  getProfessionalDevelopment() {
    return [
      {
        category: 'Technology Skills',
        title: 'Mobile App Optimization Training',
        description: 'Learn advanced features of taxi optimization apps',
        provider: 'Tokyo Tech Academy',
        duration: '2 hours',
        cost: '¥5,000',
        benefit: 'Increase earnings by 15-20%'
      },
      {
        category: 'Business Development',
        title: 'Customer Service Excellence',
        description: 'Improve passenger satisfaction and repeat business',
        provider: 'Japan Service Institute',
        duration: '4 hours',
        cost: '¥8,000',
        benefit: 'Higher ratings and premium fares'
      },
      {
        category: 'Financial Management',
        title: 'Taxi Business Finance',
        description: 'Optimize earnings, taxes, and business expenses',
        provider: 'Tokyo Business School',
        duration: '6 hours',
        cost: '¥12,000',
        benefit: 'Save 10-15% on business costs'
      }
    ];
  }
}

// Professional Networking Component
const ProfessionalNetworkingHub = () => {
  const [networking] = useState(() => new ProfessionalNetworking());
  const [integrationStatus, setIntegrationStatus] = useState({});
  const [networkingOpportunities, setNetworkingOpportunities] = useState([]);
  const [calendarTemplates, setCalendarTemplates] = useState([]);
  const [professionalDev, setProfessionalDev] = useState([]);
  const [activeTab, setActiveTab] = useState('networking');

  const { t, getCurrentLocaleInfo } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeNetworking();
  }, []);

  const initializeNetworking = async () => {
    try {
      const status = await networking.initializeIntegrations();
      setIntegrationStatus(status);
      
      const opportunities = networking.generateNetworkingOpportunities();
      setNetworkingOpportunities(opportunities);
      
      const templates = networking.getBusinessCalendarTemplates();
      setCalendarTemplates(templates);
      
      const development = networking.getProfessionalDevelopment();
      setProfessionalDev(development);
    } catch (error) {
      console.error('Networking initialization failed:', error);
    }
  };

  const handleCallContact = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? '電話をかけることができませんでした' : 'Unable to make phone call'
      );
    });
  };

  const handleEmailContact = (email) => {
    const url = `mailto:${email}?subject=${encodeURIComponent('Tokyo Taxi AI Optimizer Partnership')}`;
    Linking.openURL(url).catch(err => {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? 'メールを開くことができませんでした' : 'Unable to open email'
      );
    });
  };

  const handleAddToContacts = async (contact) => {
    try {
      const contactData = {
        name: contact.name,
        phoneNumbers: [{ number: contact.phone, label: 'work' }],
        emails: [{ email: contact.email, label: 'work' }],
        company: contact.name,
        jobTitle: 'Business Partner',
        note: 'Added through Tokyo Taxi AI Optimizer'
      };

      await networking.addBusinessContact(contactData);
      
      Alert.alert(
        localeInfo.isJapanese ? '連絡先追加完了' : 'Contact Added',
        localeInfo.isJapanese 
          ? `${contact.name}を連絡先に追加しました`
          : `${contact.name} has been added to your contacts`
      );
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        error.message
      );
    }
  };

  const handleCreateCalendarEvent = async (template) => {
    try {
      const startDate = template.startTime;
      const endDate = new Date(startDate.getTime() + template.duration * 60 * 1000);
      
      const eventData = {
        title: template.title,
        startDate,
        endDate,
        location: template.location,
        notes: template.notes,
        alarms: [{ relativeOffset: -15 }] // 15 minutes before
      };

      await networking.createOptimizationEvent(eventData);
      
      Alert.alert(
        localeInfo.isJapanese ? 'カレンダー追加完了' : 'Calendar Event Created',
        localeInfo.isJapanese 
          ? `${template.title}をカレンダーに追加しました`
          : `${template.title} has been added to your calendar`
      );
    } catch (error) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        error.message
      );
    }
  };

  const handleOpenWebsite = (url) => {
    Linking.openURL(url).catch(err => {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? 'ウェブサイトを開くことができませんでした' : 'Unable to open website'
      );
    });
  };

  const getIntegrationStatusIcon = (isEnabled) => {
    return isEnabled ? '✅' : '❌';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#673AB7', '#3F51B5']} style={styles.header}>
        <Text style={styles.headerTitle}>
          🤝 {localeInfo.isJapanese ? 'プロフェッショナルネットワーキング' : 'Professional Networking'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {localeInfo.isJapanese 
            ? 'ビジネス拡大・パートナーシップ・成長機会'
            : 'Business Growth, Partnerships & Opportunities'
          }
        </Text>
      </LinearGradient>

      {/* Integration Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>
          🔗 {localeInfo.isJapanese ? '統合ステータス' : 'Integration Status'}
        </Text>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>
              {getIntegrationStatusIcon(integrationStatus.calendar)}
            </Text>
            <Text style={styles.statusLabel}>
              {localeInfo.isJapanese ? 'カレンダー' : 'Calendar'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>
              {getIntegrationStatusIcon(integrationStatus.contacts)}
            </Text>
            <Text style={styles.statusLabel}>
              {localeInfo.isJapanese ? '連絡先' : 'Contacts'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>
              {getIntegrationStatusIcon(integrationStatus.location)}
            </Text>
            <Text style={styles.statusLabel}>
              {localeInfo.isJapanese ? '位置情報' : 'Location'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'networking' && styles.activeTab]}
          onPress={() => setActiveTab('networking')}
        >
          <Text style={styles.tabText}>
            {localeInfo.isJapanese ? 'ネットワーキング' : 'Networking'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={styles.tabText}>
            {localeInfo.isJapanese ? 'カレンダー' : 'Calendar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'development' && styles.activeTab]}
          onPress={() => setActiveTab('development')}
        >
          <Text style={styles.tabText}>
            {localeInfo.isJapanese ? '成長' : 'Growth'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Networking Tab */}
      {activeTab === 'networking' && (
        <View>
          {networkingOpportunities.map((opportunity, index) => (
            <View key={index} style={styles.opportunityCard}>
              <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
              <Text style={styles.opportunityDescription}>{opportunity.description}</Text>
              
              {opportunity.contacts.map((contact, contactIndex) => (
                <View key={contactIndex} style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactDetails}>{contact.phone}</Text>
                    <Text style={styles.contactDetails}>{contact.email}</Text>
                  </View>
                  
                  <View style={styles.contactActions}>
                    <TouchableOpacity 
                      style={styles.contactButton}
                      onPress={() => handleCallContact(contact.phone)}
                    >
                      <Text style={styles.contactButtonText}>📞</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.contactButton}
                      onPress={() => handleEmailContact(contact.email)}
                    >
                      <Text style={styles.contactButtonText}>✉️</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.contactButton}
                      onPress={() => handleAddToContacts(contact)}
                    >
                      <Text style={styles.contactButtonText}>👤</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <View>
          <Text style={styles.sectionTitle}>
            📅 {localeInfo.isJapanese ? 'ビジネスカレンダーテンプレート' : 'Business Calendar Templates'}
          </Text>
          
          {calendarTemplates.map((template, index) => (
            <View key={index} style={styles.templateCard}>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
              
              <View style={styles.templateDetails}>
                <Text style={styles.templateDetail}>
                  ⏰ {localeInfo.isJapanese ? '時間' : 'Duration'}: {template.duration} {localeInfo.isJapanese ? '分' : 'min'}
                </Text>
                <Text style={styles.templateDetail}>
                  🔄 {localeInfo.isJapanese ? '頻度' : 'Frequency'}: {template.recurring}
                </Text>
                <Text style={styles.templateDetail}>
                  📍 {localeInfo.isJapanese ? '場所' : 'Location'}: {template.location}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.addToCalendarButton}
                onPress={() => handleCreateCalendarEvent(template)}
              >
                <Text style={styles.addToCalendarText}>
                  📅 {localeInfo.isJapanese ? 'カレンダーに追加' : 'Add to Calendar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Professional Development Tab */}
      {activeTab === 'development' && (
        <View>
          <Text style={styles.sectionTitle}>
            📚 {localeInfo.isJapanese ? '専門能力開発' : 'Professional Development'}
          </Text>
          
          {professionalDev.map((course, index) => (
            <View key={index} style={styles.courseCard}>
              <Text style={styles.courseCategory}>{course.category}</Text>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
              
              <View style={styles.courseDetails}>
                <Text style={styles.courseDetail}>
                  🏢 {localeInfo.isJapanese ? '提供者' : 'Provider'}: {course.provider}
                </Text>
                <Text style={styles.courseDetail}>
                  ⏱️ {localeInfo.isJapanese ? '時間' : 'Duration'}: {course.duration}
                </Text>
                <Text style={styles.courseDetail}>
                  💰 {localeInfo.isJapanese ? '費用' : 'Cost'}: {course.cost}
                </Text>
                <Text style={styles.courseBenefit}>
                  💡 {localeInfo.isJapanese ? '効果' : 'Benefit'}: {course.benefit}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.courseButton}
                onPress={() => Alert.alert(
                  localeInfo.isJapanese ? '詳細情報' : 'More Information',
                  localeInfo.isJapanese 
                    ? 'このコースの詳細については、プロバイダーにお問い合わせください。'
                    : 'Please contact the provider for more details about this course.'
                )}
              >
                <Text style={styles.courseButtonText}>
                  📞 {localeInfo.isJapanese ? '詳細問い合わせ' : 'Contact for Details'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>
          ⚡ {localeInfo.isJapanese ? 'クイックアクション' : 'Quick Actions'}
        </Text>
        
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleOpenWebsite('https://www.taxi-japan.or.jp')}
          >
            <Text style={styles.quickActionIcon}>🏢</Text>
            <Text style={styles.quickActionText}>
              {localeInfo.isJapanese ? 'タクシー協会' : 'Taxi Association'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleOpenWebsite('https://www.linkedin.com')}
          >
            <Text style={styles.quickActionIcon}>💼</Text>
            <Text style={styles.quickActionText}>
              {localeInfo.isJapanese ? 'LinkedIn' : 'LinkedIn'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleEmailContact('tatsuru.kikuchi@gmail.com')}
          >
            <Text style={styles.quickActionIcon}>📧</Text>
            <Text style={styles.quickActionText}>
              {localeInfo.isJapanese ? '開発者連絡' : 'Contact Developer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#673AB7',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  opportunityCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 20,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  opportunityDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  contactDetails: {
    fontSize: 11,
    color: '#666',
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  contactButtonText: {
    fontSize: 16,
  },
  templateCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 20,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  templateDetails: {
    marginBottom: 15,
  },
  templateDetail: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  addToCalendarButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCalendarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  courseCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 20,
  },
  courseCategory: {
    fontSize: 12,
    color: '#673AB7',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  courseDetails: {
    marginBottom: 15,
  },
  courseDetail: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  courseBenefit: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  courseButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  courseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfessionalNetworkingHub;