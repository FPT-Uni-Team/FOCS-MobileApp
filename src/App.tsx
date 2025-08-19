import React, { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './store/store';
import AppNavigator from './routes/AppNavigator';
import FirebaseNotificationService from './services/firebaseNotificationService';

const App = () => {
  const navigationRef = useRef<any>(null);
  
  useEffect(() => {
    const initializeFirebaseNotifications = async () => {
      try {
        const notificationService = FirebaseNotificationService.getInstance();
        notificationService.setNavigationRef(navigationRef);
        await notificationService.initialize();
      } catch (error) {
      }
    };

    initializeFirebaseNotifications();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
 