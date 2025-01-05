import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EditorScreen from '../features/EditorScreen';
import HistoryScreen from '../features/HistoryScreen';
import PreviewScreen from '../features/PreviewScreen';
import LibraryScreen from '../features/LibraryScreen';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'; // Import here
import { View } from 'react-native-reanimated/lib/typescript/Animated';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerTintColor: styles.headerTintColor,
        headerBackTitleVisible: false,
      }}
    >
      <RootStack.Screen
        name="Root"
        component={TabNavigator}
        options={({ navigation, route }) => {
          const active = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';

          return {
            headerShown: true,
            headerLargeTitle: true,
            headerShadowVisible: false,
            title: active,
            headerRight: () =>
              active === 'Dashboard' ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate('Root', {
                      screen: 'Dashboard',
                      params: { showAddModal: true },
                    });
                  }}
                >
                  <Icon name="plus" size={13} color="#222" />
                  <Text style={styles.addButtonText}>New Project</Text>
                </TouchableOpacity>
              ) : null,
          };
        }}
      />
      <RootStack.Screen
        name="Editor"
        options={{ headerShadowVisible: false }}
        component={EditorScreen}
      />
      <RootStack.Screen
        name="History"
        options={{ headerShadowVisible: false }}
        component={HistoryScreen}
      />
      <RootStack.Screen
        name="Preview"
        options={{ headerShadowVisible: false }}
        component={PreviewScreen}
      />
      <RootStack.Screen
        name="Libraries"
        options={{ headerShadowVisible: false }}
        component={LibraryScreen}
      />
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#222',
  },
  headerTintColor: '#fff',
  addButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: 500,
    color: '#222',
    fontSize: 14,
  },
});

export default RootNavigator;
