import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import UserTypeSelection from '../screens/UserTypeSelection';
import DriverHotspotMap from '../screens/driver/HotspotMap';
import DriverEarningsTracker from '../screens/driver/EarningsTracker';
import DriverSettings from '../screens/driver/Settings';
import PassengerTripPlanner from '../screens/passenger/TripPlanner';
import PassengerDecisionPanel from '../screens/passenger/DecisionPanel';
import PassengerSettings from '../screens/passenger/Settings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Driver Tab Navigator
const DriverTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Hotspots') {
            iconName = 'location-on';
          } else if (route.name === 'Earnings') {
            iconName = 'monetization-on';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#ecf0f1',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#3498db',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Hotspots" 
        component={DriverHotspotMap}
        options={{
          title: '🚕 Weather Hotspots',
          headerTitle: 'Driver Dashboard'
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={DriverEarningsTracker}
        options={{
          title: '💰 Earnings',
          headerTitle: 'Revenue Tracker'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={DriverSettings}
        options={{
          title: '⚙️ Settings',
          headerTitle: 'Driver Settings'
        }}
      />
    </Tab.Navigator>
  );
};

// Passenger Tab Navigator
const PassengerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'TripPlanner') {
            iconName = 'navigation';
          } else if (route.name === 'Decisions') {
            iconName = 'psychology';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#ecf0f1',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#2ecc71',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="TripPlanner" 
        component={PassengerTripPlanner}
        options={{
          title: '🎯 Plan Trip',
          headerTitle: 'Trip Planner'
        }}
      />
      <Tab.Screen 
        name="Decisions" 
        component={PassengerDecisionPanel}
        options={{
          title: '🤖 Smart Advice',
          headerTitle: 'Transportation Advice'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={PassengerSettings}
        options={{
          title: '⚙️ Settings',
          headerTitle: 'Passenger Settings'
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserType();
  }, []);

  const loadUserType = async () => {
    try {
      const savedUserType = await AsyncStorage.getItem('userType');
      if (savedUserType) {
        setUserType(savedUserType);
      }
    } catch (error) {
      console.error('Error loading user type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelection = async (type) => {
    try {
      await AsyncStorage.setItem('userType', type);
      setUserType(type);
    } catch (error) {
      console.error('Error saving user type:', error);
      Alert.alert('Error', 'Failed to save user preference');
    }
  };

  const resetUserType = async () => {
    try {
      await AsyncStorage.removeItem('userType');
      setUserType(null);
    } catch (error) {
      console.error('Error resetting user type:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🌦️ Tokyo Taxi AI</Text>
        <Text style={styles.loadingSubtext}>Loading weather intelligence...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userType ? (
          <Stack.Screen name="UserTypeSelection">
            {props => (
              <UserTypeSelection
                {...props}
                onUserTypeSelect={handleUserTypeSelection}
              />
            )}
          </Stack.Screen>
        ) : userType === 'driver' ? (
          <Stack.Screen name="DriverApp">
            {props => <DriverTabs {...props} onReset={resetUserType} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="PassengerApp">
            {props => <PassengerTabs {...props} onReset={resetUserType} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#ecf0f1',
    textAlign: 'center',
  },
});

export default AppNavigator;