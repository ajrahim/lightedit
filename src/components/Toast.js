import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/toast';

export const renderToast = (toastOptions) => {
  const { type, message } = toastOptions;

  let containerStyle = [styles.toastContainer];
  let textStyle = [styles.toastText];

  switch (type) {
    case 'success':
      containerStyle.push({ backgroundColor: 'lightgreen' });
      break;
    case 'failed':
      containerStyle.push({ backgroundColor: 'lightcoral' });
      break;
    default:
      break;
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{message}</Text>
    </View>
  );
};

// Define preset options for each toast type for convenience
export const toastOptions = {
  general: {
    type: 'general',
    placement: 'bottom',
    duration: 1000,
  },
  success: {
    type: 'success',
    placement: 'bottom',
    duration: 1000,
  },
  failed: {
    type: 'failed',
    placement: 'bottom',
    duration: 1000,
  },
};
