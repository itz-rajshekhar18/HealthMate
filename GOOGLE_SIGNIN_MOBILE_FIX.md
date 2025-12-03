# Google Sign-In Mobile Fix Guide

## Problem
Google Sign-In is not working on mobile devices (iOS/Android) because:
1. Missing configuration in app.json
2. Need to add Google Services files
3. Need proper OAuth client IDs for mobile platforms

## Solution Steps

### Step 1: Get OAuth Client IDs from Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Note down the **Web client ID** (you already have this)

### Step 2: Get iOS OAuth Client ID

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. If you don't have an iOS app, click **Add app** → **iOS**
4. Fill in:
   - **iOS bundle ID**: `com.yourcompany.healtmate` (or your bundle ID)
   - **App nickname**: HealthMate iOS
   - Download the `GoogleService-Info.plist` file
5. In the downloaded plist file, find the `CLIENT_ID` value
6. This is your **iOS OAuth Client ID**

### Step 3: Get Android OAuth Client ID

1. In Firebase Console, go to **Project Settings**
2. If you don't have an Android app, click **Add app** → **Android**
3. Fill in:
   - **Android package name**: `com.yourcompany.healtmate`
   - **App nickname**: HealthMate Android
   - **Debug signing certificate SHA-1**: Get this by running:
     ```bash
     # For Windows
     keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
     
     # For Mac/Linux
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
   - Copy the SHA-1 fingerprint
4. Download the `google-services.json` file
5. The Android OAuth Client ID will be auto-generated

### Step 4: Update app.json

Add Google Sign-In plugin configuration:

```json
{
  "expo": {
    "name": "healtmate",
    "slug": "healtmate",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "healtmate",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.healtmate",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "package": "com.yourcompany.healtmate",
      "googleServicesFile": "./google-services.json",
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_REVERSED"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

### Step 5: Add Google Services Files

1. **For iOS**: Place `GoogleService-Info.plist` in the root of your project
2. **For Android**: Place `google-services.json` in the root of your project

### Step 6: Update .env File

Add all OAuth client IDs to your `.env` file:

```env
# Existing
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com

# Add these
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

### Step 7: Update authService.ts

Update the Google Sign-In configuration:

```typescript
// Configure Google Sign-In for native platforms
export const configureGoogleSignIn = () => {
    if (GoogleSignin && Platform.OS !== 'web') {
        const webClientId = Platform.OS === 'ios' 
            ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID 
            : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
            
        GoogleSignin.configure({
            webClientId: webClientId || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
        
        console.log('Google Sign-In configured for', Platform.OS);
    }
};
```

### Step 8: Rebuild the App

After making these changes, you need to rebuild:

```bash
# Clear cache
npx expo start -c

# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

## Testing on Mobile

### iOS Testing
1. Run on iOS simulator or device
2. Tap "Sign in with Google"
3. Should open Google Sign-In screen
4. Select account
5. Should redirect back to app

### Android Testing
1. Run on Android emulator or device
2. Ensure Google Play Services are installed
3. Tap "Sign in with Google"
4. Should open Google account picker
5. Select account
6. Should redirect back to app

## Common Issues & Solutions

### Issue 1: "Google Play Services not available"
**Solution**: 
- Ensure Google Play Services are installed on the device/emulator
- Update Google Play Services to latest version

### Issue 2: "Error 10: Developer Error"
**Solution**:
- Check SHA-1 fingerprint is correct in Firebase Console
- Ensure package name matches exactly
- Wait 5-10 minutes after adding SHA-1 for changes to propagate

### Issue 3: "Sign-in failed with error code 12501"
**Solution**:
- This means sign-in was cancelled
- Check if the OAuth consent screen is configured in Google Cloud Console
- Ensure the app is added to test users if in testing mode

### Issue 4: "Invalid client ID"
**Solution**:
- Verify the client ID in .env matches Firebase Console
- Check you're using the correct client ID for the platform (iOS/Android)
- Ensure there are no extra spaces in the client ID

### Issue 5: iOS - "No valid URL scheme found"
**Solution**:
- Check the `iosUrlScheme` in app.json is correct
- It should be the reversed iOS client ID
- Format: `com.googleusercontent.apps.YOUR_CLIENT_ID`

## Alternative: Expo Google Sign-In

If the above doesn't work, you can use Expo's built-in Google authentication:

```bash
npx expo install expo-auth-session expo-web-browser
```

Then update authService.ts to use Expo AuthSession for all platforms.

## Verification Checklist

- [ ] Firebase project has iOS app configured
- [ ] Firebase project has Android app configured
- [ ] SHA-1 fingerprint added to Android app in Firebase
- [ ] GoogleService-Info.plist downloaded and placed in project root
- [ ] google-services.json downloaded and placed in project root
- [ ] app.json updated with Google Sign-In plugin
- [ ] .env file has all client IDs
- [ ] authService.ts updated with platform-specific configuration
- [ ] App rebuilt with `npx expo run:ios` or `npx expo run:android`
- [ ] Tested on physical device or emulator
- [ ] Google Sign-In button appears
- [ ] Clicking button opens Google Sign-In
- [ ] Can select account
- [ ] Redirects back to app after sign-in

## Quick Debug Commands

### Check if Google Sign-In is configured:
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Check configuration
console.log('Is configured:', await GoogleSignin.isSignedIn());
console.log('Current user:', await GoogleSignin.getCurrentUser());
```

### Test Google Play Services (Android):
```typescript
try {
  await GoogleSignin.hasPlayServices();
  console.log('Play Services available');
} catch (error) {
  console.log('Play Services error:', error);
}
```

## Support Resources

- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [Firebase Android Setup](https://firebase.google.com/docs/android/setup)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [Expo Google Sign-In](https://docs.expo.dev/guides/google-authentication/)

## Next Steps

After completing all steps:
1. Test on iOS device/simulator
2. Test on Android device/emulator
3. Verify user data is saved to Firebase
4. Test sign-out functionality
5. Test with multiple Google accounts
