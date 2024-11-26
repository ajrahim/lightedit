import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, PanResponder } from 'react-native';
import { WebView } from 'react-native-webview';

const PreviewScreen = ({ route }) => {
  const { content } = route.params || {};

  const [consoleMessages, setConsoleMessages] = useState([]);
  const scrollViewRef = useRef();

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (['log', 'error', 'warn'].includes(data.type)) {
        setConsoleMessages((prevMessages) => [...prevMessages, data]);
        // Auto-scroll to the bottom
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (e) {
      console.error('Failed to parse message from WebView', e);
    }
  };

  const wrapContentWithConsoleOverride = (htmlContent) => {
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

    return htmlContent.replace(/<head>/i, `<head>${consoleOverrideScript}`);
  };

  const contentWithConsoleOverride = wrapContentWithConsoleOverride(content || '<h1>No content available</h1>');

  const windowHeight = Dimensions.get('window').height;
  const [webViewHeight, setWebViewHeight] = useState(windowHeight * 0.7);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        let newWebViewHeight = webViewHeight + gestureState.dy * -1;
        if (newWebViewHeight < 100) {
          newWebViewHeight = 100;
        } else if (newWebViewHeight > windowHeight - 100) {
          newWebViewHeight = windowHeight - 100;
        }
        setWebViewHeight(newWebViewHeight);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={{ height: webViewHeight }}>
        <WebView
          source={{ html: contentWithConsoleOverride }}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  webview: {
    flex: 1,
  },
  draggableBar: {
    height: 20,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#888',
    borderRadius: 2,
  },
  consoleContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  consoleTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  consoleScrollView: {
    flex: 1,
  },
  consoleText: {
    fontSize: 12,
  },
  logText: {
    color: '#ffffff',
  },
  warnText: {
    color: '#ffae42',
  },
  errorText: {
    color: '#ff4c4c',
  },
});

export default PreviewScreen;
