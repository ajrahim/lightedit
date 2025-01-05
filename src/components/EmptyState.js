import React, { act } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/components';

const EmptyState = ({
  icon,
  size = 50,
  titleText,
  actionText,
  handlePress,
}) => {
  return (
    <View style={styles.emptyState}>
      <Icon name={icon} size={size} color="aquamarine" />
      <Text style={styles.emptyStateText}>{titleText}</Text>
      {handlePress && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={handlePress}>
          <Text style={styles.emptyStateButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
