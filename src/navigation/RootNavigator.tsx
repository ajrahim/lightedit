import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EditorScreen from '../features/EditorScreen';
import HistoryScreen from '../features/HistoryScreen';
import PreviewScreen from '../features/PreviewScreen';
import LibraryScreen from '../features/LibraryScreen';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      {/* Tab Navigator */}
      <RootStack.Screen
        name="Dashboard"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      {/* Editor Screen */}
      <RootStack.Screen
        name="Editor"
        component={EditorScreen}
        options={{
          title: 'Editor',
          headerStyle: { backgroundColor: '#333' },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      />
      <RootStack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          headerStyle: { backgroundColor: '#333' },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      />
      <RootStack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{
          title: 'Preview',
          headerStyle: { backgroundColor: '#333' },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      />
      <RootStack.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'Library',
          headerStyle: { backgroundColor: '#333' },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
