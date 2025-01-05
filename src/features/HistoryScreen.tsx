import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectVersionsByProjectId, updateNotes } from '../redux/saveSlice';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/screens';
import { SwipeListView } from 'react-native-swipe-list-view';

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { projectId, onRestoreVersion, currentVersionTimestamp } =
    route.params || {};
  const history = useSelector(selectVersionsByProjectId(projectId));
  const reversedHistory = [...history].reverse();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newNotes, setNewNotes] = useState('');

  const handleRestoreVersion = (version) => {
    if (onRestoreVersion) {
      onRestoreVersion(version);
    }
    navigation.goBack();
  };

  const isCurrentVersion = (timestamp) => {
    return (
      currentVersionTimestamp &&
      new Date(timestamp).toISOString() === currentVersionTimestamp
    );
  };

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);

    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(
      dateObject,
    );

    const timeOptions = { hour: 'numeric', minute: 'numeric' };
    const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(
      dateObject,
    );

    return `${dateString} @ ${timeString}`;
  };

  const openNotesModal = (item) => {
    setCurrentItem(item);
    setNewNotes(item.notes || '');
    setModalVisible(true);
  };

  const saveNotes = () => {
    if (currentItem && currentItem.timestamp && projectId) {
      dispatch(
        updateNotes({
          projectId,
          timestamp: currentItem.timestamp,
          notes: newNotes,
        }),
      );
    }
    setModalVisible(false);
    setCurrentItem(null);
  };

  const renderItem = ({ item, index }) => {
    const displayIndex = reversedHistory.length - index;
    const isFirstItem = index === 0;
    const isLastItem = index === reversedHistory.length - 1;
    const current = isCurrentVersion(item.timestamp);
    const formattedDate = formatDate(item.timestamp);

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleRestoreVersion(item)}
        activeOpacity={1}
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
          <View style={styles.historyContentTop}>
            <Text style={styles.historyVersion}>{displayIndex}</Text>
            <Text style={styles.historyText}>{formattedDate}</Text>
            {current && (
              <Icon
                name="check"
                size={12}
                color="green"
                style={styles.currentCheck}
              />
            )}
          </View>
          {item.notes ? (
            <Text style={styles.historyContentNotes}>{item.notes}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({ item }) => (
    <View style={localStyles.hiddenItemContainer}>
      <TouchableOpacity
        style={localStyles.actionButton}
        activeOpacity={1}
        onPress={() => openNotesModal(item)}
      >
        <Icon name="note-sticky" size={20} color="lightgreen" />
        <Text style={localStyles.actionButtonText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, styles.containerMargins]}>
      <SwipeListView
        data={reversedHistory}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-120} // Amount to open from the right side
        // disableRightSwipe // Only allow swipe from right to left
        closeOnRowPress
        closeOnScroll
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContainer}>
            <Text style={localStyles.modalTitle}>Add/Edit Notes</Text>
            <TextInput
              style={localStyles.textInput}
              value={newNotes}
              onChangeText={setNewNotes}
              placeholder="Enter notes here..."
              multiline
            />
            <View style={localStyles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={saveNotes} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  hiddenItemContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#222',
    flex: 1,
    justifyContent: 'center',
  },
  actionButton: {
    width: 120,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  actionButtonText: {
    color: 'lightgreen',
    marginLeft: 10,
  },
  notesText: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  textInput: {
    height: 100,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HistoryScreen;
