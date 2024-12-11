import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EditorScreen from '../features/EditorScreen';
import HistoryScreen from '../features/HistoryScreen';
import PreviewScreen from '../features/PreviewScreen';
import LibraryScreen from '../features/LibraryScreen';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

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
        name="Dashboard"
        component={TabNavigator}
        options={({ navigation, route }) => {
          const activeTab =
            route.state?.routes[route.state.index]?.name || 'Dashboard';

          // Dynamic title and header customization based on active tab
          const headerTitle = activeTab === 'Feed'
            ? 'Your Feed'
            : activeTab === 'Bookmarks'
            ? 'Saved Articles'
            : activeTab === 'Settings'
            ? 'Settings'
            : 'Dashboard';

          const showAddButton = activeTab === 'Dashboard';

          return {
            headerShown: true,
            headerLargeTitle: true,
            headerShadowVisible: false,
            title: headerTitle,
            headerRight: () =>
              showAddButton ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigation.setParams({ showAddModal: true });
                  }}
                >
                  <Icon name="plus" size={14} color="#222" />
                  <Text style={styles.addButtonText}>New Project</Text>
                </TouchableOpacity>
              ) : null,
          };
        }}
      />
      <RootStack.Screen name="Editor" options={{headerShadowVisible: false}} component={EditorScreen} />
      <RootStack.Screen name="History" component={HistoryScreen} />
      <RootStack.Screen name="Preview" component={PreviewScreen} />
      <RootStack.Screen name="Libraries" options={{headerShadowVisible: false}} component={LibraryScreen} />
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
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
  },
  addButtonText: {
    marginLeft: 8,
    color: '#222',
    fontSize: 14,
  },
});

export default RootNavigator;
