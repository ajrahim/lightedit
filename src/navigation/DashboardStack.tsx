import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import DashboardScreen from '../features/DashboardScreen';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          headerLargeTitle: true, // Enables large native-style title
          headerShadowVisible: false, // Hides the shadow
          headerStyle: {
            borderBottomWidth: 0, // Remove the bottom border
            backgroundColor: '#222', // Optional: Customize the background color
          },
          headerLargeTitleStyle: {
            fontSize: 32, // Customize the large title font size
            fontWeight: 'bold', // Optional: Make it bold
            color: '#fff', // Optional: Change the title color
            borderBottomWidth: 0, // Remove the bottom border
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                navigation.setParams({ showAddModal: true });
              }}
            >
              <Icon name="plus" size={14} color="#222" />
              <Text style={styles.addButtonText}>New Project</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
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

export default DashboardStack;
