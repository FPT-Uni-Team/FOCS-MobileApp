import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

interface WelcomeScreenProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
  onGuestPress: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginPress,
  onRegisterPress,
  onGuestPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.plantImage}>
          
          <Text style={styles.plantPlaceholder}>🪴</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={onLoginPress}
          style={styles.loginButton}
          labelStyle={styles.buttonText}
          contentStyle={styles.buttonContent}
        >
          Login
        </Button>

        <Button
          mode="outlined"
          onPress={onRegisterPress}
          style={styles.registerButton}
          labelStyle={styles.registerButtonText}
          contentStyle={styles.buttonContent}
        >
          Register
        </Button>

        <Button
          mode="text"
          onPress={onGuestPress}
          style={styles.guestButton}
          labelStyle={styles.guestButtonText}
        >
          Continue as a guest
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  plantImage: {
    width: 200,
    height: 200,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  plantPlaceholder: {
    fontSize: 80,
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    marginBottom: 16,
  },
  registerButton: {
    borderColor: '#2c3e50',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  guestButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
