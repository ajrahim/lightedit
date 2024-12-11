import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardStack from './DashboardStack';
import SettingsScreen from '../features/SettingsScreen';
import Icon from 'react-native-vector-icons/FontAwesome6'; // Import the icons library

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#333' },
        headerTintColor: '#fff',
        tabBarStyle: {
          paddingBottom: 5,
          backgroundColor: '#222',
          borderTopWidth: 0, // Remove the border
        },
        tabBarActiveTintColor: 'lightblue', // Highlight active tab
        tabBarInactiveTintColor: '#777', // Dim inactive tabs
      }}
    >
      <Tab.Screen
        name="DashboardStack"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon name="code" color={color} size={16} />
          ),
        }}
      />
      <Tab.Screen
        name="Models"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Models',
          tabBarIcon: ({ color, size }) => (
            <Icon name="atom" color={color} size={16} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sliders" color={color} size={16} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
