import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import useAuth from '../../hooks/useAuth';

const HomeScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Chào mừng bạn!
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Bạn đã đăng nhập thành công
      </Text>

      <Button mode="outlined" onPress={logout} style={styles.logoutButton}>
        Đăng xuất
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default HomeScreen;
