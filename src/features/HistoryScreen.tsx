import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectVersionsByProjectId } from '../redux/saveSlice';

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectId, onRestoreVersion } = route.params || {};
  
  // Retrieve the history of saves for the given projectId
  const history = useSelector(selectVersionsByProjectId(projectId));

  // Reverse the history array to show newest to oldest
  const reversedHistory = [...history].reverse();

  const handleRestoreVersion = (version) => {
    if (onRestoreVersion) {
      onRestoreVersion(version);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reversedHistory}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        renderItem={({ item, index }) => {
          // Calculate display index from highest to lowest
          const displayIndex = reversedHistory.length - index;
          return (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => handleRestoreVersion(item)}
            >
              <Text style={styles.historyText}>
                {`#${displayIndex}: ${new Date(item.timestamp).toLocaleString()}`}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  historyItem: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
});

export default HistoryScreen;
