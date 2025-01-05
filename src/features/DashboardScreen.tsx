/**
 * Copyright (c) 2024 Yousef Ibrahimkhil & AJ Rahim
 *
 * All rights reserved. Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by Yousef Ibrahimkhil & AJ Rahim, 2024.
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import dayjs from 'dayjs';

import {
  addProject,
  deleteProject,
  renameProject,
} from '../redux/projectsSlice';
import { saveVersion } from '../redux/saveSlice';
import ProjectItem from '../components/ProjectItem';
import EmptyState from '../components/EmptyState';
import Icon from 'react-native-vector-icons/FontAwesome6';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const projects = useSelector((state) => state.projects.projects);
  const saves = useSelector((state) => state.saves.saves);

  const [modalVisible, setModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [renameProjectName, setRenameProjectName] = useState('');

  // New state variables for delete confirmation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Helper to get the latest version for a project
  const getLatestVersion = (projectId) => {
    const projectVersions = saves.filter(
      (save) => save.projectId === projectId,
    );
    if (projectVersions.length === 0) return null;

    return projectVersions.reduce((latest, current) =>
      new Date(latest.timestamp) > new Date(current.timestamp)
        ? latest
        : current,
    );
  };

  // Sort projects by their latest version timestamp
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const latestA = getLatestVersion(a.id);
      const latestB = getLatestVersion(b.id);

      const timeA = latestA ? new Date(latestA.timestamp).getTime() : 0;
      const timeB = latestB ? new Date(latestB.timestamp).getTime() : 0;

      return timeB - timeA;
    });
  }, [projects, saves]);

  useEffect(() => {
    if (route.params?.showAddModal) {
      setModalVisible(true);
      navigation.setParams({ showAddModal: false });
    }
  }, [route.params?.showAddModal, navigation]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
      };
      dispatch(addProject(newProject));

      const initialContent = {
        projectId: newProject.id,
        html: '<h1>Hello World</h1>',
        css: 'h1 {\n  font-family: Arial;\n}',
        js: 'console.log("Hello World");',
        timestamp: new Date().toISOString(),
      };
      dispatch(saveVersion(initialContent));
      setNewProjectName('');
      setModalVisible(false);
    }
  };

  const handleRenameProject = () => {
    if (renameProjectName.trim() && selectedProjectId) {
      dispatch(
        renameProject({
          projectId: selectedProjectId, // Use projectId, not id
          name: renameProjectName.trim(),
        }),
      );
      setRenameProjectName('');
      setRenameModalVisible(false);
    }
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      dispatch(deleteProject({ projectId: projectToDelete.id }));
      setProjectToDelete(null);
      setDeleteModalVisible(false);
    }
  };

  const renderHeader = () => <Text style={styles.header}>Recent</Text>;

  const renderProjectItem = ({ item }) => {
    const latestSave = getLatestVersion(item.id);
    const lastSaveTime = latestSave
      ? dayjs(latestSave.timestamp).format('MMM DD, YYYY h:mm A')
      : 'No saves yet';

    return <ProjectItem item={item} lastSaveTime={lastSaveTime} />;
  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.renameButton]}
        onPress={() => {
          setRenameProjectName(data.item.name);
          setSelectedProjectId(data.item.id);
          setRenameModalVisible(true);
        }}
      >
        <Text style={styles.actionText}>Rename</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        // Open delete confirmation modal
        onPress={() => {
          setProjectToDelete(data.item);
          setDeleteModalVisible(true);
        }}
      >
        <Icon name="trash" size={18} color="#000" />
        {/* <Text style={styles.actionText}>Delete</Text> */}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {projects.length > 0 ? (
        <SwipeListView
          useFlatList={true}
          data={sortedProjects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-180}
          disableRightSwipe={true} // Optional: Prevent left swipe
          refreshing={false}
        />
      ) : (
        <EmptyState
          icon={'meteor'}
          titleText={'No Projects Yet'}
          actionText={'Create First Project'}
          handlePress={() => setModalVisible(true)}
        />
      )}

      {/* New Project Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
              placeholderTextColor="#aaa"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateProject}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Rename Project Modal */}
      <Modal
        visible={renameModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalContainer} behavior="padding">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Project</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new project name"
              value={renameProjectName}
              onChangeText={setRenameProjectName}
              placeholderTextColor="#aaa"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleRenameProject}
              >
                <Text style={styles.createButtonText}>Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Confirm Deletion</Text>
            <Text style={styles.confirmModalMessage}>
              Are you sure you want to delete the project "
              {projectToDelete?.name}"? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setProjectToDelete(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={handleDeleteProject}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightblue',
    opacity: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 70,
  },
  renameButton: {
    backgroundColor: 'lavender',
  },
  deleteButton: {
    backgroundColor: 'tomato',
  },
  actionText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 500,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  confirmModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 4,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  confirmModalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteConfirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'lightcoral',
    borderRadius: 4,
  },
  deleteConfirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DashboardScreen;
