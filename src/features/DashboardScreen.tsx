import React, { useEffect, useState } from 'react';
import {
  FlatList,
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
import { addProject, setActiveProject } from '../redux/projectsSlice';
import { saveVersion } from '../redux/saveSlice';
import ProjectItem from '../components/ProjectItem';
import { useNavigation, useRoute } from '@react-navigation/native';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);

  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (route.params?.showAddModal) {
      setModalVisible(true);
      navigation.setParams({ showAddModal: false }); // Reset param
    }
  }, [route.params?.showAddModal]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
      };
      dispatch(addProject(newProject));

      // Save initial version
      const initialContent = {
        projectId: newProject.id,
        html: '<h1>Hello World</h1>',
        css: 'body {\n  font-family: Arial;\n}',
        js: 'console.log("Hello World");',
        timestamp: new Date().toISOString(),
      };
      dispatch(saveVersion(initialContent));
      setNewProjectName('');
      setModalVisible(false);
    }
  };

  const renderHeader = () => (
    <Text style={styles.header}>Recent</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Project List */}
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 6 }}
      />

      {/* New Project Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalContainer}>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
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
});

export default DashboardScreen;
