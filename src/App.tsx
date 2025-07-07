import React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store } from './store/store';
import AppNavigator from './routes/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
