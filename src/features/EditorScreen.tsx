import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveVersion,
  selectLatestVersionByProjectId,
  selectVersionsByProjectId,
} from '../redux/saveSlice';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TouchableOpacity,
  View,
  Animated,
  Keyboard,
  TextInput,
} from 'react-native';
import CodeEditor from '@rivascva/react-native-code-editor';
import styles from '../styles/screens';

const EditorContext = createContext(null);

const EditorScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { projectName } = route?.params || {};
  const projects = useSelector((state) => state.projects.projects);
  const project = projects.find((p) => p.name === projectName);

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
  const [inputVisible, setInputVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputAnimation = useRef(new Animated.Value(0)).current;
  const codeRef = useRef(null);

  useEffect(() => {
    if (latestVersion) {
      setContent({
        html: latestVersion.html || '<h1>Hello World</h1>',
        css: latestVersion.css || 'body {\n  font-family: Arial;\n}',
        js: latestVersion.js || 'console.log("Hello World");',
      });
      setLastSaved(latestVersion.timestamp);
    }
  }, [latestVersion]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        Animated.timing(inputAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setInputVisible(false);
        Animated.timing(inputAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [inputAnimation]);

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
    setInputVisible(true);
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
            <Text style={styles.navButtonText}>Q</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleSavePress}>
            <Text style={styles.navButtonText}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleHistoryPress}
          >
            <Text style={styles.navButtonText}>H</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePreviewPress}
          >
            <Text style={styles.navButtonText}>P</Text>
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        {inputVisible && (
          <Animated.View
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    translateY: inputAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, -keyboardHeight],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.inputLabel}>AI Query</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your AI query here..."
              placeholderTextColor="#aaa"
              value={query}
              onChangeText={setQuery}
            />
          </Animated.View>
        )}

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
            ref={codeRef}
            value={content[activeTab.toLowerCase()]}
            language={activeTab.toLowerCase()}
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
      </View>
    </EditorContext.Provider>
  );
};

export default EditorScreen;
