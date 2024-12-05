import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveVersion,
  selectLatestVersionByProjectId,
} from '../redux/saveSlice';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CodeEditor from '@rivascva/react-native-code-editor';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/screens';

const EditorContext = createContext(null);

const EditorScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { projectName } = route?.params || {};
  const projects = useSelector((state) => state.projects.projects);
  const project = projects.find((p) => p.name === projectName);
  const [editorLanguage, setEditorLanguage] = useState('htmlbars')

  if (!project) {
    return <Text>Project not found</Text>;
  }

  const latestVersion = useSelector(
    selectLatestVersionByProjectId(project.id)
  );

  const [activeTab, setActiveTab] = useState('HTML');
  const [content, setContent] = useState({
    html: '<h1>Hello World</h1>',
    css: 'body {\n  font-family: Arial;\n}',
    js: 'console.log("Hello World");',
  });
  const [query, setQuery] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [helpVisible, setHelpVisible] = useState(false);
  const [queryVisible, setQueryVisible] = useState(false);

  useEffect(() => {
    if (latestVersion) {
      setContent((prevContent) => ({
        html: latestVersion.html || prevContent.html,
        css: latestVersion.css || prevContent.css,
        js: latestVersion.js || prevContent.js,
      }));
      setLastSaved(latestVersion.timestamp);
    }
  }, [latestVersion]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => setHelpVisible(true)}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Help</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleContentChange = useCallback(
    (newValue) => {
      setContent((prevContent) => ({
        ...prevContent,
        [activeTab.toLowerCase()]: newValue,
      }));
    },
    [activeTab]
  );

  const handleSavePress = () => {
    const timestamp = new Date().toISOString();
    const newVersion = {
      ...content,
      timestamp,
      projectId: project.id,
    };
    dispatch(saveVersion(newVersion));
    setLastSaved(timestamp);
    alert('Project saved!');
  };

  const handleLibraryPress = () => {
    navigation.navigate('Library', {
      projectId: project.id
    });
  };

  const handleHistoryPress = () => {
    navigation.navigate('History', {
      projectId: project.id,
      onRestoreVersion: (version) => {
        setContent({
          html: version.html,
          css: version.css,
          js: version.js,
        });
      },
    });
  };

  const handleQueryPress = () => {
    setQueryVisible(true);
  };

  const handlePreviewPress = () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>${content.css}</style>
    </head>
    <body>
      ${content.html}
      <script>${content.js}</script>
    </body>
    </html>
    `;

    navigation.navigate('Preview', { content: htmlContent });
  };

  return (
    <EditorContext.Provider value={{ default: true }}>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={handleQueryPress}>
            <Icon name="bolt-lightning" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleLibraryPress}
          >
            <Icon name="book" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleSavePress}>
            <Icon name="floppy-disk" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleHistoryPress}
          >
            <Icon name="clock-rotate-left" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePreviewPress}
          >
            <Icon name="play" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['HTML', 'CSS', 'JS'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab ? styles.activeTab : null,
              ]}
              onPress={() => {
                setActiveTab(tab);
              }}
            >
              <Text style={styles.tabButtonText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Code Editor */}
        <View style={styles.editorContainer}>
          <CodeEditor
            key={activeTab}
            initialValue={content[activeTab.toLowerCase()]}
            language={editorLanguage}
            onChange={handleContentChange}
            theme="dark"
            style={styles.codeEditor}
            syntaxHighlighting
            showLineNumbers
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.lastSavedText}>
            Last Saved:{' '}
            {lastSaved
              ? new Date(lastSaved).toLocaleString()
              : 'Not Yet Saved'}
          </Text>
        </View>

        {/* Help Modal */}
        <Modal
          visible={helpVisible}
          transparent={true}
          onRequestClose={() => setHelpVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editor Help</Text>
              <Text style={styles.modalContent}>
                This is the help section for the editor. Include your detailed
                documentation or tips here.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setHelpVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Query Modal */}
        <Modal
          visible={queryVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setQueryVisible(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>AI Query</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter your AI query here..."
                  placeholderTextColor="#aaa"
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setQueryVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      // Handle the query submission here
                      setQueryVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </EditorContext.Provider>
  );
};

export default EditorScreen;
