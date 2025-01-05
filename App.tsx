import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastProvider } from 'react-native-toast-notifications';
import { store, persistor } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { renderToast } from './src/components/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider
        renderToast={renderToast}
        placement="bottom"
        duration={3000}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

export default App;
