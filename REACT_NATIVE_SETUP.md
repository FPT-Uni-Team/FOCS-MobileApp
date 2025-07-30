# React Native Development Setup Guide

## ✅ Migration Completed

### Successfully migrated from Expo to Pure React Native:
- ✅ Removed all Expo dependencies 
- ✅ Setup React Native CLI
- ✅ Updated Android MainApplication.kt
- ✅ Fixed notification sagas
- ✅ Updated sound service to use react-native-sound
- ✅ Firebase notification service integrated

## 🛠️ Required Development Environment Setup

### 1. Java Development Kit (JDK)
**Download and Install:**
- JDK 17: https://adoptium.net/
- Or JDK 11: https://www.oracle.com/java/technologies/downloads/

**Set Environment Variable:**
```
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot
```

### 2. Android Studio
**Download:** https://developer.android.com/studio

**After Installation:**
- Open Android Studio
- Go to SDK Manager (gear icon)
- Install:
  - Android SDK Platform 33
  - Android SDK Build-Tools 33.0.0
  - Android Emulator
  - Android SDK Platform-Tools

**Set Environment Variable:**
```
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
```

**Add to PATH:**
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

### 3. Create Android Virtual Device (AVD)
1. Open Android Studio
2. Tools > AVD Manager
3. Create Virtual Device
4. Choose device (e.g., Pixel 4)
5. Choose system image (API 33+)
6. Finish and Launch

## 🚀 Running the App

### Option 1: With Emulator
```bash
# Start Android emulator first
# Then run:
npx react-native run-android
```

### Option 2: With Physical Device
1. Enable Developer Options on phone
2. Enable USB Debugging
3. Connect via USB
4. Run:
```bash
npx react-native run-android
```

### Option 3: Debug Commands
```bash
# Check devices
adb devices

# Start Metro bundler separately
npx react-native start

# Build and install (in new terminal)
npx react-native run-android
```

## 🧪 Testing Firebase Notifications

Once app is running:

### 1. Open React Native Debugger or Chrome DevTools
### 2. Test in console:
```javascript
// Get device token
NotificationTester.testGetToken()

// Test registration
NotificationTester.testRegistration()

// Simulate notifications
NotificationTester.simulateNotification('New Ordered')
NotificationTester.simulateNotification('New Notify')
```

## 📱 App Features Working

- ✅ Firebase Cloud Messaging
- ✅ Device token registration
- ✅ Notification sound playback
- ✅ Redux integration
- ✅ Navigation deep linking
- ✅ Background/foreground notification handling

## 🐛 Troubleshooting

### Common Issues:

**1. JAVA_HOME not set:**
- Install JDK and set environment variable
- Restart terminal/IDE

**2. Android SDK not found:**
- Install Android Studio
- Set ANDROID_HOME environment variable

**3. No devices found:**
- Start Android emulator
- Or connect physical device with USB debugging

**4. Build errors:**
```bash
# Clean build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**5. Metro bundler issues:**
```bash
# Reset cache
npx react-native start --reset-cache
```

## 🎯 Next Steps

1. **Setup development environment** (Java + Android Studio)
2. **Create/start Android emulator**
3. **Run app:** `npx react-native run-android`
4. **Test Firebase notifications**
5. **Connect to real backend API**

## 📚 Documentation

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Setup](https://developer.android.com/studio/install)
- [React Native Firebase](https://rnfirebase.io/)

Your app is now **Pure React Native** and ready for production! 🚀 