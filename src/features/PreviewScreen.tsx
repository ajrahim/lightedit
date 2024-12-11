import React, { useState, useRef, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, PanResponder, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { selectActiveProject } from '../redux/projectsSlice';
import Icon from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles/screens';

const PreviewScreen = ({ route, navigation }) => {
  const { content } = route.params || {};
  const activeProject = useSelector(selectActiveProject);

  const [consoleMessages, setConsoleMessages] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const scrollViewRef = useRef();

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (['log', 'error', 'warn'].includes(data.type)) {
        setConsoleMessages((prevMessages) => [...prevMessages, data]);
        // Auto-scroll to the bottom
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    } catch (e) {
      console.error('Failed to parse message from WebView', e);
    }
  };

  const wrapContentWithConsoleOverride = (htmlContent, libraries) => {
    const libraryScripts = libraries
      .map((library) => `<script>${library.code}</script>`)
      .join('\n');

    const consoleOverrideScript = `
      <script>
        (function() {
          // Override console methods
          const originalLog = console.log;
          console.log = function(...args) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: args.join(' ') }));
            originalLog.apply(console, args);
          };

          const originalError = console.error;
          console.error = function(...args) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: args.join(' ') }));
            originalError.apply(console, args);
          };

          const originalWarn = console.warn;
          console.warn = function(...args) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'warn', message: args.join(' ') }));
            originalWarn.apply(console, args);
          };

          // Capture JavaScript errors
          window.onerror = function(message, source, lineno, colno, error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: message + ' at ' + source + ':' + lineno + ':' + colno
            }));
          };
        })();
      </script>
    `;

    return htmlContent.replace(/<head>/i, `<head>${consoleOverrideScript}\n${libraryScripts}`);
  };

  const libraries = activeProject?.libraries || [];
  const contentWithConsoleOverride = wrapContentWithConsoleOverride(content || '<h1>No content available</h1>', libraries);

  const windowHeight = Dimensions.get('window').height;
  const [webViewHeight, setWebViewHeight] = useState(windowHeight * 0.7);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Remove the -1 multiplier to fix the drag direction
        let newWebViewHeight = webViewHeight + gestureState.dy;

        if (newWebViewHeight < 100) {
          newWebViewHeight = 100;
        } else if (newWebViewHeight > windowHeight - 100) {
          newWebViewHeight = windowHeight - 100;
        }
        setWebViewHeight(newWebViewHeight);
      },
    })
  ).current;

  // Set a navigation header button to toggle the console
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowConsole(prev => !prev)} style={styles.headerButton}>
          <Icon name="terminal" size={16} color={showConsole ? 'red' : 'lightblue'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showConsole]);

  return (
    <View style={styles.container}>
      <View style={{ height: showConsole ? webViewHeight : '100%' }}>
        <WebView
          source={{ html: contentWithConsoleOverride }}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      </View>
      {showConsole && (
        <>
          <View {...panResponder.panHandlers} style={styles.draggableBar}>
            <View style={styles.barIndicator} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.consoleContainer}>
              <Text style={styles.consoleTitle}>Console Output:</Text>
              <ScrollView style={styles.consoleScrollView} ref={scrollViewRef}>
                {consoleMessages.map((msg, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.consoleText,
                      msg.type === 'error'
                        ? styles.errorText
                        : msg.type === 'warn'
                        ? styles.warnText
                        : styles.logText,
                    ]}
                  >
                    {msg.message}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default PreviewScreen;
