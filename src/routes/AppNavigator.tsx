import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import LoginScreen from '../pages/auth/LoginScreen';
import WelcomeScreen from '../pages/welcome/WelcomeScreen';
import useAuth from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import TableListScreen from '../pages/table/TableListScreen';
import OrderListScreen from '../pages/order/OrderListScreen';
import MenuItemListScreen from '../pages/menu/MenuItemListScreen';
import NotificationScreen from '../pages/notification/NotificationScreen';
import UserProfileScreen from '../pages/profile/UserProfileScreen';
import BottomNav from '../components/common/BottomNav/BottomNav';
import MenuItemDetailScreen from '../pages/menu/MenuItemDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const WelcomeWrapper = ({ navigation }: any) => (
  <WelcomeScreen
    onLoginPress={() => navigation.navigate('Login')}
    onRegisterPress={() => {}}
    onGuestPress={() => {}}
  />
);

const LoginWrapper = ({ navigation }: any) => (
  <LoginScreen onBackPress={() => navigation.goBack()} onRegisterPress={() => {}} />
);

const NotificationWrapper = () => (
  <NotificationScreen />
);

const MainAppTabs = () => (
  <Tab.Navigator
    tabBar={(props: BottomTabBarProps) => {
      const currentRouteName = props.state.routes[props.state.index].name;
      let selectedKey = 'table';
      
      switch (currentRouteName) {
        case 'Tables':
          selectedKey = 'table';
          break;
        case 'Orders':
          selectedKey = 'order';
          break;
        case 'MenuItems':
          selectedKey = 'menu';
          break;
        case 'Notifications':
          selectedKey = 'notification';
          break;
        case 'Profile':
          selectedKey = 'profile';
          break;
      }

      return (
        <BottomNav
          selected={selectedKey}
          onSelect={(key) => {
            const screenMap: { [key: string]: string } = {
              'table': 'Tables',
              'order': 'Orders',
              'menu': 'MenuItems',
              'notification': 'Notifications',
              'profile': 'Profile',
            };
            props.navigation.navigate(screenMap[key] || 'Tables');
          }}
        />
      );
    }}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Tables" component={TableListScreen} />
    <Tab.Screen name="Orders" component={OrderListScreen} />
    <Tab.Screen name="MenuItems" component={MenuItemListScreen} />
    <Tab.Screen name="Notifications" component={NotificationWrapper} />
    <Tab.Screen name="Profile" component={UserProfileScreen} />
  </Tab.Navigator>
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
        <>
          <Stack.Screen name="MainApp" component={MainAppTabs} />
          <Stack.Screen name="MenuItemDetail" component={MenuItemDetailScreen} options={{ headerShown: false }} />
        </>
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
 