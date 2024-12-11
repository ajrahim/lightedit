import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectVersionsByProjectId } from '../redux/saveSlice';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/screens';

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectId, onRestoreVersion, currentVersionTimestamp } = route.params || {};
  const history = useSelector(selectVersionsByProjectId(projectId));
  const reversedHistory = [...history].reverse();

  const handleRestoreVersion = (version) => {
    if (onRestoreVersion) {
      onRestoreVersion(version);
    }
    navigation.goBack();
  };

  const isCurrentVersion = (timestamp) => {
    return currentVersionTimestamp && (new Date(timestamp).toISOString() === currentVersionTimestamp);
  };

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);

    // Format date as "December 5, 2020"
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(dateObject);

    // Format time as "5:30 PM"
    const timeOptions = { hour: 'numeric', minute: 'numeric' };
    const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(dateObject);

    return `${dateString} @ ${timeString}`;
  };

  return (
    <View style={[styles.container, styles.containerMargins]}>
      <FlatList
        data={reversedHistory}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        renderItem={({ item, index }) => {
          const displayIndex = reversedHistory.length - index;
          const isFirstItem = index === 0;
          const isLastItem = index === reversedHistory.length - 1;
          const current = isCurrentVersion(item.timestamp);
          const formattedDate = formatDate(item.timestamp);

          return (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => handleRestoreVersion(item)}
            >
              <View style={styles.historyLineContainer}>
                <View
                  style={[
                    styles.historyLine,
                    isFirstItem && styles.historyLineFirst,
                    isLastItem && styles.historyLineLast,
                  ]}
                />
                <View style={styles.historyCircle} />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyVersion}>{displayIndex}</Text>
                  <Text style={styles.historyText}>{formattedDate}</Text>
                  {current && (
                    <Icon name="check" size={12} color="green" style={styles.currentCheck} />
                  )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HistoryScreen;
