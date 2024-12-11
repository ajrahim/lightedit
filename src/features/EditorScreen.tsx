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
import { selectActiveProject } from '../redux/projectsSlice';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements'
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { queryLogic } from '../infrastructures/logicService';
import EditorControls from '../components/EditorControls';
import { toastOptions } from '../components/Toast';
import CodeEditor from '@rivascva/react-native-code-editor';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/screens';

// Import js-beautify functions
import { js as beautifyJS, html as beautifyHTML, css as beautifyCSS } from 'js-beautify';

// Import the toast hook
import { useToast } from 'react-native-toast-notifications';

const EditorContext = createContext(null);

const EditorScreen = ({ route }) => {
  const dispatch = useDispatch();
  const height = useHeaderHeight()
  const navigation = useNavigation();
  const toast = useToast();
  const { projectName } = route?.params || {};
  const project = useSelector(selectActiveProject);

  const [editorLanguage, setEditorLanguage] = useState('html');
  const latestVersion = useSelector(
    selectLatestVersionByProjectId(project?.id)
  );

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('HTML');
  const [content, setContent] = useState({
    html: '<h1>Hello World</h1>',
    css: 'body {\n  font-family: Arial;\n}',
    js: 'console.log("Hello World");',
  });
  const [query, setQuery] = useState('');
  const [queryInProgress, setQueryInProgress] = useState(false);
  const [queryResponse, setQueryResponse] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [helpVisible, setHelpVisible] = useState(false);
  const [queryVisible, setQueryVisible] = useState(false);

  useEffect(() => {
    if (!project) return;
    if (latestVersion) {
      setContent((prevContent) => ({
        html: latestVersion.html || prevContent.html,
        css: latestVersion.css || prevContent.css,
        js: latestVersion.js || prevContent.js,
      }));
      setLastSaved(latestVersion.timestamp);
    }
  }, [latestVersion, project]);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => setHelpVisible(true)}
          >
            <Icon name="download" size={16} color="#777" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setHelpVisible(true)}
          >
            <Icon name="circle-question" size={16} color="#777" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // Dynamically set the editor language based on active tab
  useEffect(() => {
    if (activeTab === 'HTML') {
      setEditorLanguage('html');
    } else if (activeTab === 'CSS') {
      setEditorLanguage('css');
    } else if (activeTab === 'JS') {
      setEditorLanguage('javascript');
    }
  }, [activeTab]);

  const handleInsertText = (text) => {
    // Append the clicked character to the current tab's content
    setContent((prevContent) => ({
      ...prevContent,
      [activeTab.toLowerCase()]: prevContent[activeTab.toLowerCase()] + text,
    }));
  };

  const handleSavePress = () => {
    if (!project) return;
    const timestamp = new Date().toISOString();
    const newVersion = {
      ...content,
      timestamp,
      projectId: project.id,
    };
    dispatch(saveVersion(newVersion));
    setLastSaved(timestamp);
    toast.show('Project saved!', toastOptions.success)
  };

  const handleLibraryPress = () => {
    if (!project) return;
    navigation.navigate('Libraries', {
      projectId: project.id
    });
  };

  const handleLogicQuery = async () => {
    if (!project) return;
    setQueryInProgress(true);
    setQueryResponse('');
    try {
      const libraries = (project.libraries || []).map((library) => library.source);
      const result = await queryLogic({
        query,
        libraries: libraries || [],
        html: content.html,
        css: content.css,
        js: content.js
      });
      setQueryResponse(result.response);
      setContent({
        html: result.content.html,
        css: result.content.css,
        js: result.content.js
      });
    } catch (error) {
      console.error('Error executing query:', error);
      toast.show('Error executing query. Please try again.', toastOptions.failed);
    } finally {
      setQueryInProgress(false);
    }
  };

  const handleHistoryPress = () => {
    if (!project) return;
    navigation.navigate('History', {
      projectId: project.id,
      onRestoreVersion: (version) => {
        setContent({
          html: version.html,
          css: version.css,
          js: version.js,
        });
      },
      currentVersionTimestamp: lastSaved,
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

  const handleFormatCode = () => {
    const currentContent = content[activeTab.toLowerCase()];
    let formatted;
    try {
      if (activeTab === 'HTML') {
        formatted = beautifyHTML(currentContent, { indent_size: 2 });
      } else if (activeTab === 'CSS') {
        formatted = beautifyCSS(currentContent, { indent_size: 2 });
      } else if (activeTab === 'JS') {
        formatted = beautifyJS(currentContent, { indent_size: 2 });
      }

      if (formatted) {
        setContent((prevContent) => ({
          ...prevContent,
          [activeTab.toLowerCase()]: formatted,
        }));
      }
    } catch (error) {
      console.error('Error formatting code:', error);
      toast.show('Error formatting code. Ensure your code is valid.', toastOptions.failed);
    }
  };

  if (!project) {
    return <Text>Project not found</Text>;
  }

  // Define character sets for each language
  const htmlChars = ['<', '>', '/', '=', '"', "'", '(', ')', '{', '}', '!'];
  const cssChars = ['{', '}', ':', ';', '#', '.', '%', '!', '@import ', '@media ', '/*  */'];
  const jsChars = ['(', ')', '{', '}', '[', ']', '=', '=>', ';', '.', ',', '"', "'"];

  // Determine which characters to show based on the active tab
  let currentChars;
  if (activeTab === 'HTML') {
    currentChars = htmlChars;
  } else if (activeTab === 'CSS') {
    currentChars = cssChars;
  } else if (activeTab === 'JS') {
    currentChars = jsChars;
  }

  return (
    <EditorContext.Provider value={{ default: true }}>
      <KeyboardAvoidingView 
        keyboardVerticalOffset={height}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <EditorControls
          onQueryPress={handleQueryPress}
          onLibraryPress={handleLibraryPress}
          onSavePress={handleSavePress}
          onHistoryPress={handleHistoryPress}
          onPreviewPress={handlePreviewPress}
        />
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
              <Text 
                style={[
                  styles.tabButtonText,
                  activeTab === tab ? styles.activeTabButtonText : null,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Code Editor */}
        <View style={styles.editorContainer}>
          <CodeEditor
            value={content[activeTab.toLowerCase()]}   
            onChange={(newValue) => {
              setContent((prev) => ({
                ...prev,
                [activeTab.toLowerCase()]: newValue,
              }));
            }}
            language={editorLanguage}
            showLineNumbers
            autoFocus
            style={styles.codeEditor}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {isKeyboardVisible ? (
            <View style={styles.codeButtonContainer}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled={true}
                horizontal={true}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.codeButtonContainer}>
                {currentChars.map((char) => (
                  <TouchableOpacity
                    key={char}
                    style={styles.codeButton}
                    onPress={() => handleInsertText(char)}
                  >
                    <Text style={styles.codeButtonText}>{char}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Clean/Format Button */}
              <TouchableOpacity
                style={[styles.codeButton, styles.codeButtonClean]}
                onPress={handleFormatCode}
              >
                <Icon name="broom" size={14} color="#222" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.lastSavedText}>
              Last Saved:{' '}
              {lastSaved
                ? new Date(lastSaved).toLocaleString()
                : 'Not Yet Saved'}
            </Text>
          )}
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
            <View style={styles.keyboardOverlay}>
              <View style={styles.keyboardOverlayContainer}>
                <View style={styles.keyboardOverlayTop}>
                  <View style={styles.keyboardOverlayIcon}>
                    <Icon name="bolt-lightning" size={16} color="lightblue" />
                  </View>
                  <Text style={styles.keyboardOverlayTitle}>AI Assistant</Text>
                </View>
                {queryInProgress ? (
                  <View style={styles.keyboardOverlayProcessing}>
                    <ActivityIndicator size="small" color="lightblue" />
                    <Text style={styles.keyboardOverlayProcessingText}>Processing Request...</Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={styles.keyboardOverlayInput}
                      placeholder="Enter your AI query here..."
                      placeholderTextColor="#aaa"
                      value={query}
                      onChangeText={setQuery}
                      autoFocus
                    />
                  </>
                )}

                {queryResponse ? (
                  <View style={styles.keyboardOverlayResponse}>
                    <Text style={styles.keyboardOverlayResponseText}>{queryResponse}</Text>
                  </View>
                ) : null}

                <View style={styles.keyboardOverlayButtonContainer}>
                  {!queryInProgress && (
                    <TouchableOpacity
                      style={styles.keyboardOverlayButton}
                      onPress={() => {
                        setQueryVisible(false);
                        setQuery('');
                        setQueryResponse('');
                      }}
                    >
                      <Text style={styles.keyboardOverlayButtonText}>Close</Text>
                    </TouchableOpacity>
                  )}
                  {!queryInProgress && (
                    <TouchableOpacity
                      style={styles.keyboardOverlayButton}
                      onPress={handleLogicQuery}
                    >
                      <Text style={[styles.keyboardOverlayButtonText, styles.keyboardOverlayButtonTextSubmit]}>Submit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </EditorContext.Provider>
  );
};

export default EditorScreen;
