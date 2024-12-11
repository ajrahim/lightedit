import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastProvider } from 'react-native-toast-notifications';
import { store, persistor } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { renderToast } from './src/components/Toast'; // Import the renderToast function

function App() {
  return (
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
  );
}

export default App;
