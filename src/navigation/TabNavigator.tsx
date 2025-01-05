import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../features/SettingsScreen';
import DashboardScreen from '../features/DashboardScreen';
import ModelsScreen from '../features/ModelsScreen';
import Icon from 'react-native-vector-icons/FontAwesome6';

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
        name="Dashboard"
        component={DashboardScreen}
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
        component={ModelsScreen}
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
