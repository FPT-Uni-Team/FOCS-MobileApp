# Firebase Notification Setup Guide

## ✅ Completed Setup Steps

### 1. Migration to React Native
- ✅ Ejected from Expo managed workflow
- ✅ Installed React Native Firebase packages
- ✅ Configured Android build with Google Services
- ✅ Migrated from expo-router to @react-navigation

### 2. Firebase Configuration
- ✅ Added `google-services.json` for Android
- ✅ Updated `android/build.gradle` with Google Services plugin
- ✅ Updated `android/app/build.gradle` with plugin apply

### 3. Service Implementation
- ✅ Created `FirebaseNotificationService.ts`
- ✅ Integrated with existing notification Redux store
- ✅ Integrated with existing sound service
- ✅ Setup navigation for deep linking

### 4. Integration Points
- ✅ Redux store integration for notifications
- ✅ Sound service integration for notification sounds
- ✅ Navigation integration for notification taps
- ✅ AsyncStorage for device token persistence

## 🧪 Testing Instructions

### 1. Get Device Token
```javascript
// In React Native Debugger console or dev tools
NotificationTester.testGetToken()
```

### 2. Test Registration
```javascript
// Test device token registration with backend
NotificationTester.testRegistration()
```

### 3. Simulate Notifications
```javascript
// Simulate new order notification
NotificationTester.simulateNotification('New Ordered')

// Simulate general notification
NotificationTester.simulateNotification('New Notify')
```

### 4. Log Firebase Config
```javascript
NotificationTester.logFirebaseConfig()
```

## 📱 App Features

### Notification Handling
- **Foreground**: Show alert with sound
- **Background**: Show system notification with sound
- **App Closed**: Show system notification, open app when tapped

### Action Types Supported
- `New Ordered`: Creates order notification, navigates to Orders screen
- `Kitchen Ready`: Creates kitchen ready notification, navigates to Production Orders screen
- `Kitchen Call Staff`: Creates urgent kitchen call notification, navigates to Production Orders screen
- `Customer Call Staff`: Creates customer call notification, navigates to Tables screen
- `New Notify`: Creates system notification, navigates to Notifications screen

### Integration Features
- Redux store updates for notification count
- Sound playback using existing sound service
- Navigation deep linking to relevant screens
- Device token registration with backend API

## 🔧 Backend Integration

### API Endpoint Required
```
POST /api/auth/mobile-token
```

**Payload:**
```json
{
  "actorId": "string",
  "deviceToken": "string", 
  "platform": "android" | "ios"
}
```

### Message Format Expected
```json
{
  "title": "string",
  "message": "string",
  "target_groups": ["string"],
  "store_id": "string",
  "table_id": "string"
}
```

### Action Types
- `New Ordered` - For new order notifications
- `Kitchen Ready` - For kitchen ready notifications
- `Kitchen Call Staff` - For kitchen calling staff notifications
- `Customer Call Staff` - For customer calling staff notifications
- `New Notify` - For general system notifications

## 📋 Firebase Console Setup

### Required Steps (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `focs-e053a`
3. Add Android app with package: `com.anonymous.mobileadminsite`
4. Download the real `google-services.json` and replace the current one
5. Enable Cloud Messaging in Firebase Console

### Testing with Firebase Console
1. Go to Cloud Messaging in Firebase Console
2. Send test message to device token
3. Use payload format as per documentation

## 🚀 Next Steps

### For iOS (if needed later)
1. Run `npx expo run:ios` to generate iOS folder
2. Add `GoogleService-Info.plist` to iOS project
3. Update `ios/Podfile` with Firebase pods
4. Configure iOS push notification capabilities

### Production Setup
1. Replace test `google-services.json` with production file
2. Configure Firebase project for production environment
3. Setup backend API endpoint `/api/auth/mobile-token`
4. Test end-to-end with real backend

## 🐛 Troubleshooting

### Common Issues
1. **Build errors**: Make sure Android Studio and SDK are properly installed
2. **Token not received**: Check Firebase project configuration
3. **Notifications not received**: Verify backend is sending to correct token
4. **Sound not playing**: Check device volume and notification settings

### Debug Commands
```bash
# Check TypeScript errors
npx tsc --noEmit

# Build Android
npx expo run:android

# Clean build
npx expo run:android --clear
```

## 📚 Documentation References
- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [React Navigation](https://reactnavigation.org/) 