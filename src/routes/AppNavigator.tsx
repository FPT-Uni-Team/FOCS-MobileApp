import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/auth/LoginScreen';
import WelcomeScreen from '../pages/welcome/WelcomeScreen';
import useAuth from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import TableListScreen from '../pages/table/TableListScreen';

const Stack = createNativeStackNavigator();

const WelcomeWrapper = ({ navigation }: any) => (
  <WelcomeScreen
    onLoginPress={() => navigation.navigate('Login')}
    onRegisterPress={() => {}}
    onGuestPress={() => {}}
  />
);

const LoginWrapper = ({ navigation }: any) => (
  <LoginScreen
    onBackPress={() => navigation.goBack()}
    onRegisterPress={() => {}}
  />
);

const AppNavigator = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Tables" component={TableListScreen} />
      ) : (
        <>
          <Stack.Screen key="Welcome" name="Welcome" component={WelcomeWrapper} />
          <Stack.Screen key="Login" name="Login" component={LoginWrapper} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
 