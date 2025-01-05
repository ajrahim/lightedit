import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/screens';

const EditorControls = ({
  onQueryPress,
  onLibraryPress,
  onSavePress,
  onHistoryPress,
  onPreviewPress,
}) => {

  const iconSize = 18;
  const iconColor = "lightblue";

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navButton} onPress={onQueryPress}>
        <Icon name="bolt-lightning" size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onLibraryPress}>
        <Icon name="book" size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onSavePress}>
        <Icon name="floppy-disk" size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onHistoryPress}>
        <Icon name="clock-rotate-left" size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={onPreviewPress}>
        <Icon name="play" size={iconSize} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default EditorControls;
